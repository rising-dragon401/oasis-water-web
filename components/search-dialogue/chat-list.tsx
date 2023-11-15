import { ChatMessage } from './chat-message'
import Loader from '@/components/loader'

export interface ChatList {
  messages: any[]
  isLoading: boolean
}

export default function ChatList({ messages, isLoading }: ChatList) {
  return (
    <div className="relative mx-auto min-w-[60vw] max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="my-4 md:my-8">
          <ChatMessage
            message={message}
            index={index}
            messagesLength={messages.length}
            isLoading={isLoading}
          />
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center w-full">
          <div className="relative flex w-10 h-10 ml-2">
            <Loader />
          </div>
        </div>
      )}
    </div>
  )
}
