"use client"
import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/config"
import { collection, getDoc, doc, getDocs } from "firebase/firestore"
import Image from "next/image"

interface User {
  uid: string
  email: string | null
}

interface UserData {
  username: string
  friends?: Record<string, boolean>
  address?: string
}

interface Friend {
  id: string
  data: UserData
}

interface PageProps {
  onFriendBoxButtonClick: (address?: string, username?: string) => void
}

const Page: React.FC<PageProps> = ({ onFriendBoxButtonClick }) => {
  const [user] = useAuthState(auth) as [User | null, boolean, Error | undefined]
  const [users, setUsers] = useState<Friend[] | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userFriends, setUserFriends] = useState<Friend[]>([])

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid)
          const docSnapshot = await getDoc(userDocRef)
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserData
            setUserData(userData)
          } else {
            console.log("No such document!")
          }
        }
      } catch (error) {
        console.error("Error getting document:", error)
      }
    }
    fetchDocument()
  }, [user])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users")
        const querySnapshot = await getDocs(usersRef)
        const fetchedUsers: Friend[] = []
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, data: doc.data() as UserData })
        })
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (userData && users) {
      const userFriendsIds = userData.friends
        ? Object.keys(userData.friends)
        : []
      const friendsData = userFriendsIds.map((friendId) => {
        const friend = users.find((user) => user.id === friendId)
        return friend ? { id: friend.id, data: friend.data } : null
      })
      setUserFriends(friendsData.filter(Boolean) as Friend[])
      console.log("Friends data:", friendsData)
    }
  }, [userData, users])

  return (
    <div className="flex justify-center w-64">
      <div className="">
        <div className="flex mb-1 text-center justify-center justify-items-center">
          <Image src="/friend.png" alt="friends" width={32} height={32} />
          <h1 className="text-center font-bold text-white">Friends</h1>
        </div>
        <div className="flex">
          {userFriends.length > 0 ? (
            userFriends.map((friend) => (
              <div key={friend.id} className="m-1">
                <button
                  onClick={() =>
                    onFriendBoxButtonClick(
                      friend.data.address,
                      friend.data.username
                    )
                  }
                  className="bg-blue-400 rounded-lg p-1.5"
                >
                  {friend.data.username}
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center">Add some friends first!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
