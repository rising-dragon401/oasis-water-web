// import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Loader from '@/components/loader'

const MaiaChatAvatar =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/chat/maia%20chat%20avatar.png'

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
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow',
          message.role === 'user' ? 'bg-background ' : 'bg-primary text-primaryMuted'
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="chat avatar" />
          {/* <AvatarFallback>{name.charAt(0) || 'M'}</AvatarFallback> */}
        </Avatar>
      </div>
      <div className="flex-1 px-1 md:ml-4 ml-2 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className={cn(
            'prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-primaryMuted md:text-lg text-sm',
            {
              'text-right text-primaryMuted-foreground mr-2': message.role === 'user',
            }
          )}
          // remarkPlugins={[remarkGfm]}
          components={{
            p({ children }) {
              return <p className="md:text-lg text-sm">{children}</p>
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}
