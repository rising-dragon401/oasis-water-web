import { MemoizedReactMarkdown } from '@/components/markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import remarkGfm from 'remark-gfm'
import { OasisButton } from '../custom-markdown'

const OasisAvatar =
  'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/logo/icon.png'
const FallBackAvatar =
  'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/avatars/blue-gradient-1.png?t=2024-03-22T12%3A06%3A06.617Z'

export interface ChatMessageProps {
  message: any
  isLoading: boolean
  messagesLength: number
  index?: number
  userAvatar?: string
}

export function ChatMessage({
  message,
  isLoading,
  index,
  messagesLength,
  userAvatar,
  ...props
}: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start max-w-2xl', {
        'flex-row-reverse': message.role === 'user',
      })}
      {...props}
    >
      {message.role === 'assistant' && (
        <Avatar className="flex md:h-8 md:w-8 h-6 w-6">
          <AvatarImage src={OasisAvatar} alt="chat avatar" />
          <AvatarFallback>O</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`space-y-2 overflow-hidden  rounded-xl px-4 ${message.role === 'user' ? 'bg-muted py-2' : 'flex justify-start w-full'}
      `}
      >
        <MemoizedReactMarkdown
          className={`prose break-words prose-p:leading-relaxed prose-pre:p- md:text-lg text-sm bg-background',
            ${message.role === 'user' ? 'text-right text-slate-600' : 'text-slate-900'}`}
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
