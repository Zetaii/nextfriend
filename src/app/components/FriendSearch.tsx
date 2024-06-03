"use client"
import React, { useState, useEffect, useRef } from "react"
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

const FriendSearch = ({ currentUserUid }) => {
  // Pass current user's UID as a prop
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)
  const [isInsideUserList, setIsInsideUserList] = useState(false)
  const userListRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (userListRef.current && !userListRef.current.contains(event.target)) {
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
        const fetchedUsers = []

        querySnapshot.forEach((doc) => {
          const userData = doc.data() // Retrieve user data from Firestore document
          if (doc.id !== currentUserUid) {
            // Exclude current user from friend list
            fetchedUsers.push({
              uid: doc.id, // Use doc.id to get the user's UID
              username: userData.username, // Access the username from userData
              ...userData, // Include other user data
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
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowUserList(true)
  }

  const handleInputFocus = () => {
    setShowUserList(true)
  }

  const handleInputBlur = () => {
    if (!document.activeElement === inputRef.current && !isInsideUserList) {
      setShowUserList(false)
    }
  }

  const handleUserListMouseEnter = () => {
    setIsInsideUserList(true)
  }

  const handleUserListMouseLeave = () => {
    setIsInsideUserList(false)
  }

  const addFriend = async (friendUid, friendData) => {
    try {
      const userRef = doc(db, "users", currentUserUid) // Reference to current user's document
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const updatedFriends = {
          ...userData.friends,
          [friendUid]: friendData, // Use friendUid as the key for the friend object
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
      <div className="relative">
        <input
          ref={inputRef}
          className="text-black p-2 border-slate-400 border-2 rounded-lg w-96"
          placeholder="Search for a friend..."
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autocomplete="off"
          id="searchInput"
        />
        <img
          src="searchblue.png"
          alt="search icon"
          className="absolute z-100 bg-white right-1 top-1/2 transform -translate-y-1/2 w-6 h-6"
        />
      </div>

      {showUserList && (
        <div
          ref={userListRef}
          className="absolute bg-slate-800 rounded w-56 py-1"
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
                className="bg-slate-300 rounded px-2 py-1"
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
