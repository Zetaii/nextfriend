import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import "./globals.css"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Poppins } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700", "800"] })

export const metadata: Metadata = {
  title: "FriendMap",
  description: "A social media platform for friends",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${poppins.className} bg-slate-800   flex flex-col min-h-screen scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-900
           scrollbar-w-3 `}
        >
          <Navbar />
          <div className="flex flex-1 ">
            <Sidebar />
            <div className="flex-1 bg-slate-200">{children}</div>
          </div>
          <div className="border-top-2 border-white">
            <Footer />
          </div>
        </body>
      </html>
    </>
  )
}
