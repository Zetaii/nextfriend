"use client"
import React, { useState } from "react"
import FriendProfile from "./FriendProfile"
import { ArrowLeft, ArrowRight } from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="h-full z-20 text-white hidden lg:block">
      <div
        className={`absolute bg-gradient-to-b  border-gray-500 shadow-xl from-zinc-900 to-zinc-600 h-full ${
          isCollapsed ? "w-16" : "w-[13%]"
        } p-2 transition-width duration-300 shadow-xl`}
      >
        <button
          className="absolute top-2 right-2 bg-slate-500 text-white p-1 rounded-full focus:outline-none"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
        </button>
        {!isCollapsed && (
          <div>
            <div className="flex items-center">
              <img src="friendprofile.png" className="w-6 h-6 -mr-2" />
              <div className="w-full text-center mb-6">Friend Profiles:</div>
            </div>
            <div className="mb-6 w-full">
              <FriendProfile />
            </div>
            <div className="w-full text-center mb-6">Suggested Friends:</div>
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-full mb-6">
                <img src="friendprofile.png" className="w-6 h-6 -mr-2" />
                <div className="w-full text-center">Friend 1</div>
              </div>
              <div className="flex justify-center items-center w-full mb-6">
                <img src="friendprofile.png" className="w-6 h-6 -mr-2" />
                <div className="w-full text-center">Friend 2</div>
              </div>
              <div className="flex justify-center items-center w-full mb-6">
                <img src="friendprofile.png" className="w-6 h-6 -mr-2" />
                <div className="w-full text-center">Friend 3</div>
              </div>
              <div className="flex justify-center items-center w-full mb-6">
                <img src="friendprofile.png" className="w-6 h-6 -mr-2" />
                <div className="w-full text-center">Friend 4</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
