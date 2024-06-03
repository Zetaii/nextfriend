import React, { useEffect, useState } from "react"
import { auth, db } from "../firebase/config"
import "firebase/firestore"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const Chat = () => {
  const [user] = useAuthState(auth)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const messagesRef = collection(db, "messages")

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid) // Specify user's UID
          const docSnapshot = await getDoc(userDocRef)
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            console.log("Document data:", userData)
            setUserData(userData)
          } else {
            console.log("No such document!")
          }
        }
      } catch (error) {
        console.error("Error getting document:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [user]) // Ensure useEffect runs when user changes

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"), limit(25))
    onSnapshot(queryMessages, (snapshot) => {
      let messages = []
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })

      const groupedMessages = []
      let currentGroup = null

      messages.forEach((message) => {
        if (currentGroup && currentGroup.user === message.user) {
          currentGroup.messages.push(message)
        } else {
          if (currentGroup) {
            groupedMessages.push(currentGroup)
          }
          currentGroup = {
            user: message.user,
            username: message.username,
            messages: [message],
          }
        }
      })

      if (currentGroup) {
        groupedMessages.push(currentGroup)
      }

      setMessages(groupedMessages)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newMessage === "" || !userData) return

    await addDoc(messagesRef, {
      createdAt: serverTimestamp(),
      text: newMessage,
      user: user.email,
      uid: user.uid,
      username: userData.username,
    })

    setNewMessage("")
  }

  const formatTime = (timestamp) => {
    const date = timestamp?.toDate()
    return date
      ? `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : ""
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="fixed  h-full w-auto right-0  border-gray-900/10 border-l-2 hidden lg:block md:block">
        <div className="border-b h-[6%] flex justify-center items-center bg-black w-full text-white">
          Chat Box
        </div>
        <div className="bg-gradient-to-b flex flex-col from-zinc-900 to-zinc-950 h-full p-2">
          <form onSubmit={handleSubmit}>
            <div className="flex-grow overflow-auto mt-4 mb-4">
              <ScrollArea className=" h-[600px] mb-6">
                {messages.map((group, index) => (
                  <div
                    className="text-white  flex border-b-2 pb-6 mb-4"
                    key={index}
                  >
                    <img src="user.png" className="h-6 mr-4"></img>
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between">
                        <h1 className="font-bold text-l text-blue-300">
                          {group.username}
                        </h1>
                        <h1 className="text-sm">
                          {formatTime(group.messages[0].createdAt)}
                        </h1>
                      </div>
                      {(group.messages || []).map((message, msgIndex) => (
                        <div key={msgIndex} className="mt-1 text-sm">
                          <h1>{message.text}</h1>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="grid w-full gap-2">
              <Textarea
                className="text-black"
                value={newMessage}
                placeholder="Type your message here."
                id="messageInput"
                disabled={!userData}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button>Send message</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chat
