import React, { useEffect, useState, FormEvent, ChangeEvent } from "react"
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
  Timestamp,
} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface Message {
  id: string
  createdAt: Timestamp
  text: string
  user: string
  uid: string
  username: string
}

interface User {
  uid: string
  email: string | null
}

interface UserData {
  username: string
}

interface GroupedMessage {
  user: string
  username: string
  messages: Message[]
}

const Chat: React.FC = () => {
  const [user] = useAuthState(auth)
  const [newMessage, setNewMessage] = useState<string>("")
  const [messages, setMessages] = useState<GroupedMessage[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const messagesRef = collection(db, "messages")

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid)
          const docSnapshot = await getDoc(userDocRef)
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserData
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
  }, [user])

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"), limit(25))
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: Message[] = []
      snapshot.forEach((doc) => {
        messages.push({ ...(doc.data() as Message), id: doc.id })
      })

      const groupedMessages: GroupedMessage[] = []
      let currentGroup: GroupedMessage | null = null

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

    return () => unsubscribe()
  }, [messagesRef])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (newMessage === "" || !userData || !user) return

    await addDoc(messagesRef, {
      createdAt: serverTimestamp(),
      text: newMessage,
      user: user.email,
      uid: user.uid,
      username: userData.username,
    })

    setNewMessage("")
  }

  const formatTime = (timestamp: Timestamp) => {
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
      <div className="fixed h-full w-auto right-0 border-black/30 border-l-4 hidden lg:block md:block">
        <div className="border-b h-[6%] flex justify-center items-center bg-black w-full text-white">
          Chat Box
        </div>
        <div className="bg-gradient-to-b flex flex-col from-zinc-900 to-zinc-950 h-full p-2">
          <form onSubmit={handleSubmit}>
            <div className="flex-grow overflow-auto mt-4 mb-4">
              <ScrollArea className=" h-[600px] mb-6">
                {messages.map((group, index) => (
                  <div
                    className="text-white flex border-b-2 pb-6 mb-4"
                    key={index}
                  >
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-around">
                        <Image
                          src="/user.png"
                          alt="user"
                          width={30}
                          height={20}
                          className="mr-2"
                        />
                        <h1 className="font-bold text-l text-blue-300">
                          {group.username}
                        </h1>
                        <h1 className="text-sm">
                          {formatTime(group.messages[0].createdAt)}
                        </h1>
                      </div>
                      {group.messages.map((message, msgIndex) => (
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
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setNewMessage(e.target.value)
                }
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
