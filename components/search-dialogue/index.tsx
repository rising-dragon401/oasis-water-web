'use client'

import { updateUserData } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { assistantIdAtom, messagesAtom, threadIdAtom } from '@/lib/atoms'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { useAtom } from 'jotai'
import { Lock, SendHorizontal, Sparkles, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { AssistantStream } from 'openai/lib/AssistantStream'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import Typography from '../typography'
import ChatList from './chat-list'

export function AISearchDialog({ size }: { size: 'small' | 'medium' | 'large' }) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user, uid, userData, subscription } = useUserProvider()
  const router = useRouter()
  const pathname = usePathname()
  const { openModal } = useModal()

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const [abortController, setAbortController] = React.useState<AbortController>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(true)
      }

      if (e.key === 'Escape') {
        console.log('esc')
        handleModalToggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (userData?.assistant_id) {
      setAssistantId(userData.assistant_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function createNewAssistant() {
    try {
      const response = await fetch('/api/create-new-assistant', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        // add assistant to user
        updateUserData('assistant_id', data.id)

        setAssistantId(data.id)
        return data.id
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }

  async function createNewThread() {
    try {
      const response = await fetch('/api/create-new-thread', {
        method: 'POST',
        body: JSON.stringify({
          uid,
          assistantId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setThreadId(data.id)
        return data.id
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      return null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('enter')
      handleSubmit(e)
    }
  }

  const handleSearchButtonClick = () => {
    // check if user is signed in
    if (!user) {
      toast('Sign in to use Oasis AI')
      // return to auth
      router.push(`/auth/signin?redirectUrl=${pathname}`)
      return
    } else if (!subscription) {
      openModal('SubscriptionModal')
    }

    setOpen(true)
  }

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit = async (e: any) => {
    console.log('submit')

    e.preventDefault()

    try {
      setIsLoading(true)

      const newMessage = {
        role: 'user',
        content: query,
      }

      setQuery('')

      let assistant = assistantId

      // first check for user assistantId
      if (!userData.assistantId) {
        assistant = await createNewAssistant()
      }

      if (!assistant) {
        console.log('no assistant id found')
        return
      }

      // initi threadId
      let thread: string | null = threadId
      if (!thread) {
        thread = await createNewThread()
      }

      if (!thread) {
        console.log('no thread id found')
        return
      }

      console.log('thread:', thread)
      console.log('assistant:', assistant)

      // prepare messages
      setMessages((messages) => [...messages, newMessage])

      // create instance of AbortController to handle stream cancellation
      const abortController_ = new AbortController()
      setAbortController(abortController_)
      const { signal } = abortController_

      // Set filler AI message
      const newAssistantMessage = {
        role: 'assistant',
        content: '',
      }

      setMessages((messages) => [...messages, newAssistantMessage])

      const response = await fetch('/api/send-message', {
        method: 'POST',
        body: JSON.stringify({
          query,
          assistant_id: assistant,
          thread_id: thread,
        }),
        signal,
      })

      if (!response.body) {
        return
      }
      const runner = AssistantStream.fromReadableStream(response.body)

      let fullNewMessage = ''
      runner.on('textDelta', (_delta, contentSnapshot) => {
        fullNewMessage = contentSnapshot.value

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages]
          newMessages[newMessages.length - 1].content = fullNewMessage
          return newMessages
        })
      })

      runner.on('messageDone', (message) => {
        //  // get final message content
        //  const finalContent = message.content[0].type == 'text' ? message.content[0].text.value : ''

        //  // add assistant message to list of messages
        //  setMessages((prevMessages) => [
        //    ...prevMessages,
        //    {
        //      role: 'assistant',
        //      content: finalContent,
        //      createdAt: new Date(),
        //    },
        //  ])

        // remove busy indicator
        setIsLoading(false)
      })

      runner.on('error', (error) => {
        console.error(error)
        setIsLoading(false)
      })
    } catch (e) {
      handleResetFailedSend()
      setIsLoading(false)
    }
  }

  const handleResetFailedSend = () => {
    setMessages((messages) => messages.slice(0, messages.length - 2))
  }

  const handleReset = async () => {
    setMessages([])
    setThreadId(null)
  }

  const handleCancel = async () => {
    // Cancel the fetch operation
    abortController?.abort()

    setIsLoading(false)
  }

  const handleOpenSubscription = () => {
    openModal('SubscriptionModal')
  }

  const SearchInput = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center relative justify-between">
          <Input
            ref={inputRef}
            placeholder="Message Oasis"
            name="search"
            value={query}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-muted w-full rounded-full h-12 pl-6"
          />

          {/* @ts-ignore */}
          {!subscription || subscription.status !== 'active' ? (
            <Button
              type="submit"
              variant="default"
              className="absolute right-2 h-10 rounded-full"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={handleOpenSubscription}
            >
              Ask <Lock className="w-4 h-4 text-background ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              className="absolute right-0 h-14 rounded-full"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              onClick={handleSubmit}
            >
              <SendHorizontal className="w-6 h-6 text-primary" />
            </Button>
          )}
        </div>
        <div className="p-1 pb-2">
          <Typography size="xs" fontWeight="normal">
            *Please note this feature is in early beta and is experimental. It may hallucinate and
            provide inaccurate answers.
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <>
      <Button onClick={handleSearchButtonClick} variant="ghost" className="gap-2 rounded-full h-8">
        <Sparkles className="w-4 h-4 text-secondary" />
      </Button>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open)
        }}
      >
        <DialogContent className="md:max-h-[80vh] lg:!max-w-3xl md:!max-w-2xl max-w-none mt-1 mb-2 w-[90vw] max-h-[90vh] rounded-xl overflow-y-auto text-black">
          {messages.length > 1 || isLoading ? (
            <>
              <DialogHeader className="sticky flex flex-row items-center w-full justify-between px-4">
                <DialogTitle className="text-left w-30">Chat with Oasis</DialogTitle>

                <div className="flex flex-row gap-2">
                  <Button variant="ghost" className="h-8 p-0 mr-1" onClick={handleReset}>
                    <span className="inline">Reset</span>
                  </Button>

                  <Button variant="outline" className="h-8" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4 dark:text-gray-100" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex flex-col relative items-center">
                <div className="grid gap-4 py-1 text-slate-700 overflow-y-scroll max-h-[44vh] min-h-[44vh]">
                  <ChatList
                    messages={messages}
                    isLoading={isLoading}
                    userAvatar={userData?.avatar_url}
                    messagesEndRef={messagesEndRef}
                  />
                </div>

                <DialogFooter className="flex flex-col gap-2 w-full h-16 items-center relative">
                  {isLoading && (
                    <Button
                      variant="outline"
                      className="self-center mb-2 rounded-full h-6 w-24 shadow-sm absolute"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}

                  {SearchInput()}
                </DialogFooter>
              </div>
            </>
          ) : (
            <div className="flex">{SearchInput()}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
