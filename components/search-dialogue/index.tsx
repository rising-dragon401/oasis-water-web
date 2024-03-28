'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { X, RotateCcw, Lock, SendHorizontal } from 'lucide-react'
import { useAtom } from 'jotai'
import { assistantIdAtom, messagesAtom, threadIdAtom } from '@/lib/atoms'
import ChatList from './chat-list'
import useDevice from '@/lib/hooks/use-device'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useUserProvider } from '@/providers/UserProvider'
import { updateUserData } from '@/app/actions/user'
import Typography from '../typography'
import useSubscription from '@/lib/hooks/use-subscription'
import { toast } from 'sonner'

import { SubscribeModal } from '../shared/subscribe-modal'

export function AISearchDialog({ size }: { size: 'small' | 'medium' | 'large' }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { user, userData } = useUserProvider()
  const { subscription } = useSubscription()
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const [abortController, setAbortController] = React.useState<AbortController>()
  const [openSubscription, setOpenSubscription] = React.useState(false)

  const { isMobile } = useDevice()

  React.useEffect(() => {
    if (userData?.assistant_id) {
      setAssistantId(userData.assistant_id)
    }
  }, [userData])

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
  }, [])

  // TODO should be persistant for each user
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

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  const handleSearchButtonClick = () => {
    // check if user is signed in
    if (!user) {
      // return to auth
      router.push('/auth/signin')
      return
    }

    setOpen(true)
  }

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit = async (e: any) => {
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
      // setThreadId(data.thread_id)
      setMessages((messages) => [...messages, newAssistantMessage])

      const response = await fetch('/api/send-message', {
        method: 'POST',
        body: JSON.stringify({
          query,
          assistant_id: assistant,
          thread_id: threadId,
        }),
        signal,
      })

      let fullNewMessage = ''

      if (response?.status === 400) {
        const object = await response.json()
        const err = object.error
        toast(err)
        handleResetFailedSend()
        return
      }

      const textDecoder = new TextDecoder()
      const reader = response?.body?.getReader()

      let chunk = await reader?.read()
      const chunkContent = textDecoder.decode(chunk?.value)

      fullNewMessage += chunkContent

      // finish reading the response
      while (!chunk?.done) {
        chunk = await reader?.read()
        const chunkContent = textDecoder.decode(chunk?.value)
        fullNewMessage += chunkContent

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages]
          newMessages[newMessages.length - 1].content = fullNewMessage
          return newMessages
        })
      }

      setIsLoading(false)
    } catch (e) {
      handleResetFailedSend()
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
    setOpenSubscription(true)
  }

  const SearchInput = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center relative justify-between">
          <Input
            ref={inputRef}
            placeholder="Search water questions"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-muted w-full rounded-full h-12"
          />

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
        <Typography size="xs" fontWeight="normal">
          *Please note this feature is in early beta and is experimental. It may hallucinate and
          provide inaccurate answers.
        </Typography>
      </div>
    )
  }

  return (
    <>
      <SubscribeModal open={openSubscription} setOpen={setOpenSubscription} />
      <Button
        onClick={handleSearchButtonClick}
        variant="outline"
        className="gap-2 rounded-full h-8"
      >
        {size === 'large' && (
          <Typography size="base" fontWeight="normal">
            AI search
          </Typography>
        )}

        <Sparkles className="w-4 h-4 text-secondary" />
        {/* <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '} */}
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
                <DialogTitle className="text-left w-30">Oasis assistant</DialogTitle>

                <div className="flex flex-row gap-2">
                  <Button variant="outline" className="h-8" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />

                    {!isMobile && <span className="hidden md:inline">Reset</span>}
                  </Button>

                  <Button variant="outline" className="h-8" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4 dark:text-gray-100" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex flex-col relative items-center">
                <div className="grid gap-4 py-1 text-slate-700 overflow-y-scroll max-h-[44vh] min-h-[44vh]">
                  <ChatList messages={messages} isLoading={isLoading} />
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
