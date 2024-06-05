import React, { ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface MessageInputProps {
  newMessage: string
  onMessageChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  onMessageChange,
  disabled,
}) => {
  return (
    <div className="grid w-full gap-2">
      <Textarea
        className="text-black"
        value={newMessage}
        placeholder="Type your message here."
        id="messageInput"
        disabled={disabled}
        onChange={onMessageChange}
      />
      <Button type="submit">Send message</Button>
    </div>
  )
}

export default MessageInput
