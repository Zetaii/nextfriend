"use client"
import React, { useState } from "react"
import FriendProfile from "./FriendProfile"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="fixed h-full z-20 text-white hidden lg:block">
      <div
        className={`absolute bg-gradient-to-b border-gray-500 shadow-xl from-zinc-800 to-zinc-800 h-full ${
          isCollapsed ? "w-48" : "w-[13%]"
        } p-2 transition-width duration-300 shadow-xl`}
      >
        <button
          className="absolute top-1 right-1 bg-slate-500 text-white p-1 rounded-full focus:outline-none"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ArrowLeft /> : <ArrowRight />}
        </button>
        {isCollapsed && (
          <div>
            <div className="flex items-center mb-6">
              <Image
                src="/friendprofile.png"
                alt="friend"
                width={24}
                height={24}
              />
              <div className="ml-2">Friend Profiles:</div>
            </div>
            <div className="mb-6">
              <FriendProfile />
            </div>
            <div className="mb-6">Suggested Friends:</div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-6">
                <Image
                  src="/friendprofile.png"
                  alt="friend"
                  width={24}
                  height={24}
                />
                <div className="ml-2">Friend 1</div>
              </div>
              <div className="flex items-center mb-6">
                <Image
                  src="/friendprofile.png"
                  alt="friend"
                  width={24}
                  height={24}
                />
                <div className="ml-2">Friend 2</div>
              </div>
              <div className="flex items-center mb-6">
                <Image
                  src="/friendprofile.png"
                  alt="friend"
                  width={24}
                  height={24}
                />
                <div className="ml-2">Friend 3</div>
              </div>
              <div className="flex items-center mb-6">
                <Image
                  src="/friendprofile.png"
                  alt="friend"
                  width={24}
                  height={24}
                />
                <div className="ml-2">Friend 4</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
