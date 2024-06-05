import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Timestamp } from "firebase/firestore"

interface Message {
  id: string
  createdAt: Timestamp
  text: string
  user: string
  uid: string
  username: string
}

interface GroupedMessage {
  user: string
  username: string
  messages: Message[]
}

interface MessageListProps {
  messages: GroupedMessage[]
  formatTimestamp: (timestamp: Timestamp) => string
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  formatTimestamp,
}) => {
  return (
    <ScrollArea className="h-[600px] mb-6">
      {messages.map((group, index) => (
        <div className="text-white flex border-b-2 pb-6 mb-4" key={index}>
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
                {formatTimestamp(group.messages[0].createdAt)}
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
  )
}

export default MessageList
