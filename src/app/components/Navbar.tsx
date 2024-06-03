"use client"
import React from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase/config"
import FriendSearch from "./FriendSearch"

const Navbar = () => {
  const [user] = useAuthState(auth)

  const handleSignOut = () => {
    auth.signOut()
  }

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b-2 shadow-2xl border-gray-800/40 bg-blur bg-gradient-to-r from-zinc-950 to-zinc-400 transition-all">
      <div className="flex h-14 items-center justify-between border-zinc-200">
        <div className="flex items-center space-x-12 ml-12 mr-12 text-white p-2 ">
          <div className="font-bold text-2xl">
            <a>FriendMap</a>
          </div>
          <div className="flex">
            <img src="home1.png" className="w-6 h-6 mr-1 mt-2"></img>
            <a href="/" className="text-xl font-extrabold p-2 hover:text-black">
              Home
            </a>
          </div>
          <div className="flex">
            <img src="map.png" className="w-6 h-6 mr-1"></img>
            <a href="/map" className="text-xl font-extrabold hover:text-black">
              Map
            </a>
          </div>
          <div className="flex ">
            <img src="user.png" className="w-6 h-6 mr-1"></img>
            <a
              href="/profile"
              className="text-xl font-extrabold hover:text-black"
            >
              Profile
            </a>
          </div>
          <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
        </div>

        {/* Center FriendSearch */}
        <div className="flex-grow flex justify-center">
          {user && <FriendSearch currentUserUid={user.uid} />}
        </div>

        {/* Right side user info and sign out */}
        <div className="flex items-center space-x-4 mr-12 text-white">
          {user ? (
            <>
              <p className="m-3">{user.email}</p>
              <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <a href="/sign-in" className="text-white mr-4">
                Sign In
              </a>
              <a href="/sign-up" className="text-white">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
