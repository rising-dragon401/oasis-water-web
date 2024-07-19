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
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { useAtom } from 'jotai'
import { Lock, SendHorizontal, Sparkles, X } from 'lucide-react'
import { AssistantStream } from 'openai/lib/AssistantStream'
import React, { useEffect, useRef } from 'react'
import Typography from '../../typography'
import ChatList from './chat-list'

const STARTER_PROMPTS = [
  'Filters that remove PFAS',
  'Why are microplastics in water?',
  'Bottled water with Fluoride',
  'Water filters for lead',
  'What are phthalates?',
  'What are PFAS?',
  'What foods have phthalates?',
  'What chocolates contain lead?',
]

export function AISearchDialog({
  size,
  variant = 'button',
  placeholder = 'Message Oasis',
}: {
  size: 'small' | 'medium' | 'large'
  variant?: 'button' | 'input'
  placeholder?: string
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { user, uid, userData, subscription } = useUserProvider()
  const { openModal } = useModal()

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [starterPrompts, setStarterPrompts] = React.useState<string[]>([])
  const [abortController, setAbortController] = React.useState<AbortController>()

  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [threadId, setThreadId] = useAtom(threadIdAtom)

  const [, setRedirectUrl] = useLocalStorage('redirectUrl', '')

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

    if (messages.length === 0) {
      generateStarterPrompts()
    }
  }, [messages])

  const generateStarterPrompts = () => {
    const prompts = STARTER_PROMPTS.sort(() => 0.5 - Math.random()).slice(0, 3)
    setStarterPrompts(prompts)
  }

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
      handleSubmit(e, query)
    }
  }

  const handleSearchButtonClick = () => {
    // check if user is signed in
    if (!user || !subscription) {
      openModal('SubscriptionModal')
      return
    }

    setOpen(true)
  }

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit = async (e: any, query_: string) => {
    e.preventDefault()

    if (!open) {
      handleModalToggle()
    }

    const question = query || query_

    try {
      setIsLoading(true)

      const newMessage = {
        role: 'user',
        content: question,
      }

      // prepare messages
      setMessages((messages) => [...messages, newMessage])

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
          query: question,
          assistant_id: assistant,
          thread_id: thread,
          is_stream: true,
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
        <div className="flex items-center relative justify-between w-full">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            name="search"
            value={query}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-muted flex w-full rounded-full h-12 pl-6"
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
              onClick={(e) => handleSubmit(e, query)}
            >
              <SendHorizontal className="w-6 h-6 text-primary" />
            </Button>
          )}
        </div>
        {open && (
          <div className="p-1 pb-2">
            <Typography size="xs" fontWeight="normal">
              *Oasis AI his feature is in beta and may hallucinate / provide inaccurate answers.
            </Typography>
          </div>
        )}
      </div>
    )
  }

  const SearchButton = () => {
    if (variant === 'button') {
      return (
        <Button
          onClick={handleSearchButtonClick}
          variant="outline"
          className="gap-2 rounded-full h-12 text-secondary-foreground"
        >
          <Sparkles className="w-4 h-4 text-secondary-foreground" />
        </Button>
      )
    } else {
      return <div className="mt-2">{SearchInput()}</div>
    }
  }

  return (
    <>
      {SearchButton()}

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open)
        }}
      >
        <DialogContent className="md:max-h-[80vh] lg:!max-w-3xl md:!max-w-2xl max-w-none mt-1 mb-2 w-[90vw] max-h-[85vh] rounded-xl  text-black">
          {messages.length > 1 || isLoading ? (
            <>
              <DialogHeader className="sticky flex flex-row items-center w-full justify-between px-4">
                <DialogTitle className="text-left w-30">Oasis health companion</DialogTitle>

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
                <div className="grid gap-4 py-1 text-slate-700 overflow-y-scroll hide-scrollbar min-h-[44vh] max-h-[60vh] w-full">
                  <ChatList
                    messages={messages}
                    isLoading={isLoading}
                    userAvatar={userData?.avatar_url}
                    messagesEndRef={messagesEndRef}
                  />
                </div>

                <DialogFooter className="flex flex-col gap-2 w-full h-16 items-center relative">
                  {/* {isLoading && (
                    <Button
                      variant="outline"
                      className="self-center mb-2 rounded-full h-6 w-24 shadow-sm absolute"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )} */}

                  {SearchInput()}
                </DialogFooter>
              </div>
            </>
          ) : (
            <div className="flex flex-col ">
              <Typography size="2xl" fontWeight="normal">
                Oasis health companion
              </Typography>
              <Typography size="base" fontWeight="normal" className="mb-4 text-secondary">
                👋 Hey I am here to help you find the best products for your health. How can I help?
              </Typography>
              <div className="gap-2 flex md:flex-row flex-col mb-4">
                {starterPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-8"
                    onClick={(e) => {
                      setQuery(prompt)
                      handleSubmit(e, prompt)
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              {SearchInput()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
