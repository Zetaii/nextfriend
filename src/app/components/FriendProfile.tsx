"use client"
import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/config"
import { collection, getDoc, doc, getDocs } from "firebase/firestore"
import MaxWidthWrapper from "../components/MaxWidthWrapper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface User {
  uid: string
  email: string | null
}

interface UserData {
  username: string
  friends?: Record<string, boolean>
  address?: string
  email?: string
}

interface Friend {
  id: string
  data: UserData
}

const FriendProfile: React.FC = () => {
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
    <div>
      {userFriends.length > 0 ? (
        userFriends.map((friend) => (
          <div key={friend.id} className="w-full no-underline">
            <Accordion
              type="single"
              collapsible
              className="w-full text-center no-underline"
            >
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="font-bold text-center justify-center">
                  {friend.data.username}
                </AccordionTrigger>
                <AccordionContent className="border-0">
                  <AccordionItem className="border-0 mb-4" value="f">
                    {friend.data.address}
                  </AccordionItem>
                  <AccordionItem className="border-0 w-full" value="f">
                    {friend.data.email}
                  </AccordionItem>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))
      ) : (
        <p className="text-center">No friends found.</p>
      )}
    </div>
  )
}

export default FriendProfile
