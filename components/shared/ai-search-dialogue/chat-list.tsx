import { Loader2 } from 'lucide-react'
import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: any[]
  isLoading: boolean
  messagesEndRef: any
  userAvatar?: string
}

export default function ChatList({ messages, isLoading, userAvatar, messagesEndRef }: ChatList) {
  return (
    <div className="relative mx-auto max-w-2xl md:px-4 w-full flex flex-col flex-1">
      {messages.map((message, index) => (
        <div key={index} className="my-4">
          <ChatMessage
            message={message}
            index={index}
            messagesLength={messages.length}
            isLoading={isLoading}
            userAvatar={userAvatar}
          />
        </div>
      ))}

      <div ref={messagesEndRef} className="mt-6" />

      {isLoading &&
        (messages[messages.length - 1]?.content.length < 10 || !messages[messages.length - 1]) && (
          <div className="flex justify-center w-full">
            <div className="relative flex w-10 h-10 ml-2">
              <Loader2 className="animate-spin h-4 w-4" />
            </div>
          </div>
        )}
    </div>
  )
}
