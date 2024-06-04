"use client"
import React, { useState, useEffect, useRef } from "react"
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import Image from "next/image"

interface User {
  uid: string
  username: string
  [key: string]: any
}

interface FriendSearchProps {
  currentUserUid: string
}

const FriendSearch: React.FC<FriendSearchProps> = ({ currentUserUid }) => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [showUserList, setShowUserList] = useState<boolean>(false)
  const [isInsideUserList, setIsInsideUserList] = useState<boolean>(false)
  const userListRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        userListRef.current &&
        !userListRef.current.contains(event.target as Node)
      ) {
        setShowUserList(false)
      }
    }

    document.body.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.body.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users")
        const querySnapshot = await getDocs(usersRef)
        const fetchedUsers: User[] = []

        querySnapshot.forEach((doc) => {
          const userData = doc.data() as User // Retrieve user data from Firestore document
          if (doc.id !== currentUserUid) {
            fetchedUsers.push({
              ...userData,
            })
          }
        })

        setUsers(fetchedUsers)
        setFilteredUsers([...fetchedUsers]) // Update filteredUsers with fetchedUsers
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [currentUserUid])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowUserList(true)
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  const handleInputFocus = () => {
    setShowUserList(true)
  }

  const handleInputBlur = () => {
    if (document.activeElement !== inputRef.current && !isInsideUserList) {
      setShowUserList(false)
    }
  }

  const handleUserListMouseEnter = () => {
    setIsInsideUserList(true)
  }

  const handleUserListMouseLeave = () => {
    setIsInsideUserList(false)
  }

  const addFriend = async (friendUid: string, friendData: User) => {
    try {
      const userRef = doc(db, "users", currentUserUid) // Reference to current user's document
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data() as { friends?: Record<string, User> }
        const updatedFriends = {
          ...userData.friends,
          [friendUid]: friendData,
        }

        await updateDoc(userRef, {
          friends: updatedFriends,
        })

        console.log("Friend added successfully!")
      } else {
        console.error("Current user document does not exist.")
      }
    } catch (error) {
      console.error("Error adding friend:", error)
    }
  }

  return (
    <div>
      <div className="relative flex">
        <input
          ref={inputRef}
          className="text-black p-2 border-slate-400 border-2 rounded-lg w-96"
          placeholder="Search for a friend..."
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoComplete="off"
          id="searchInput"
        />
        <div className="absolute right-2 mt-3">
          <Image
            src="/searchblue.png"
            alt="search icon"
            width={20}
            height={12}
          />
        </div>
      </div>

      {showUserList && (
        <div
          ref={userListRef}
          className="absolute bg-zinc-800 text-white rounded w-56 py-1"
          onMouseEnter={handleUserListMouseEnter}
          onMouseLeave={handleUserListMouseLeave}
        >
          {filteredUsers.map((user) => (
            <div
              className="flex justify-between items-center pl-2 pr-4 pt-1"
              key={user.uid}
            >
              <div>{user.username}</div>
              <button
                className="bg-black rounded px-2 py-1"
                onClick={() => addFriend(user.uid, user)} // Pass both UID and data of the friend
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FriendSearch
