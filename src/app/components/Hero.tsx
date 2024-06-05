import React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="bg-purple-950 min-h-screen flex flex-col text-white ">
      <main className="container mx-auto my-8 flex-grow">
        <section className="">
          <div className="mb-32">
            <h1 className="text-3xl font-extrabold ">FriendMap</h1>
          </div>

          <div className="flex">
            <div className="">
              <p className="text-7xl font-extrabold mb-0 w-[700px] ">
                Welcome to
              </p>{" "}
              <div className="font-bold text-7xl  w-[450px]  bg-white px-2  text-blue-600  mb-12 ">
                FriendMap!
              </div>
              <p className="text-lg">
                The easy way to find locations for you and your friends!
              </p>
              <a href="/map">
                <Button className="mt-12 bg-purple-800">Get Started</Button>
              </a>
            </div>

            <Image
              className=""
              src="/HomeCat.png"
              alt="HomeCat"
              width={400}
              height={500}
            />
          </div>
        </section>
        <section className=""></section>
      </main>
    </div>
  )
}

export default Hero
