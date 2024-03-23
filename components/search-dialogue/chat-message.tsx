import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Loader from '@/components/shared/loader'
import { OasisButton } from '../custom-markdown'

const ChatAvatar =
  'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/logo/icon.png'

const FallBackAvatar =
  'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/avatars/blue-gradient-1.png?t=2024-03-22T12%3A06%3A06.617Z'

export interface ChatMessageProps {
  message: any
  isLoading: boolean
  index?: number
  messagesLength: number
}

export function ChatMessage({
  message,
  isLoading,
  index,
  messagesLength,
  ...props
}: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12 ', {
        'flex-row-reverse': message.role === 'user',
      })}
      {...props}
    >
      <div
        className={cn(
          'flex md:h-8 md:w-8 h-6 w-6 shrink-0 select-none items-center justify-center rounded-full border shadow',
          message.role === 'user' ? 'bg-background ' : 'bg-primary text-primaryMuted'
        )}
      >
        {message.role === 'assistant' ? (
          <Avatar className="md:h-8 md:w-8 h-6 w-6">
            <AvatarFallback>O</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="md:h-8 md:w-8 h-6 w-6">
            <AvatarImage src={FallBackAvatar} alt="chat avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex-1 md:px-1 md:ml-4 ml-2 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className={`prose break-words prose-p:leading-relaxed prose-pre:p- md:text-lg text-sm',
            ${message.role === 'user' ? 'text-right text-slate-600 mr-2' : 'text-slate-900'}`}
          remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <p className={`md:text-base text-sm`}>{children}</p>
            },
            a: ({ href, title, children }) => {
              if (title === 'oasis-button') {
                return <OasisButton href={href}>{children}</OasisButton>
              }
              return <a href={href}>{children}</a>
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}
