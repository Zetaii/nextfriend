import React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Main = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col text-black ">
      <main className="container mx-auto my-8 flex-grow">
        <section className="">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold ">FriendMap</h1>
          </div>

          <div className="grid grid-cols-2 mb-40 ">
            <div className="flex bg-purple-950 rounded-lg justify-center w-[600px] ml-8">
              <Image
                className=""
                src="/GoogleMap.png"
                alt="HomeCat"
                width={400}
                height={400}
              />
            </div>

            <div className="flex  justify-center items-center ">
              <div className="mt-6 flex-col justify-center items-center">
                <p className="text-6xl font-bold w-[500px]">
                  Find Common Locations
                </p>
                <p className="mt-6">Find your travel time and your friends!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 mb-40">
            <div className="flex justify-center items-center rounded-lg">
              <div className=" mt-6 ml-8 ">
                <p className="text-6xl font-bold w-[600px] ">
                  Share with your friends
                </p>
                <p className="mt-6">Find your travel time and your friends!</p>
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <div className="flex bg-purple-950 rounded-lg justify-center w-[600px] -ml-32">
                <Image
                  className=""
                  src="/homefriends.png"
                  alt="HomeCat"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 mb-40">
            <div className="flex bg-purple-950 rounded-lg justify-center w-[600px]">
              <Image
                className=""
                src="/GoogleMap.png"
                alt="HomeCat"
                width={400}
                height={400}
              />
            </div>
            <div className="flex justify-center items-center ">
              <div className="mt-6 flex-col justify-center items-center">
                <p className="text-6xl font-bold w-[500px]">
                  Find Common Locations
                </p>
                <p className="mt-6">Find your travel time and your friends!</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Main
