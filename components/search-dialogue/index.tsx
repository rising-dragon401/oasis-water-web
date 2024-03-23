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
import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'

export function AISearchDialog({ size }: { size: 'small' | 'medium' | 'large' }) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { uid, userData } = useUserProvider()
  const { subscription, products } = useSubscription()
  const router = useRouter()

  const proProduct = products?.find(
    (product: any) => product.name === process.env.PRO_STRIPE_PRICE_NAME
  )
  const proPrice = proProduct?.prices[0]

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const [abortController, setAbortController] = React.useState<AbortController>()

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
    if (!uid) {
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

  const redirectToPayment = async () => {
    if (!proPrice) {
      console.error('No pro price found')
      return
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: proPrice },
      })

      console.log('sessionId: ', sessionId)

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (e) {
      console.error('Error: ', e)
      toast('Error creating portal link')
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    // check for subscription
    if (!subscription) {
      toast('Subscription required to use AI search')

      redirectToPayment()
      return
    }

    try {
      setIsLoading(true)
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

      const newMessage = {
        role: 'user',
        content: query,
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

        console.log('fullNewMessage: ', fullNewMessage)

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

  return (
    <>
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

      <Dialog open={open} modal={true}>
        <DialogContent className="md:max-h-[80vh] lg:!max-w-4xl md:!max-w-2xl max-w-none mt-1 mx-2 mb-2 md:w-full w-[90vw] max-h-[90vh] rounded-md overflow-y-auto text-black">
          {messages.length > 1 || isLoading ? (
            <>
              <DialogHeader className="sticky flex flex-row items-center w-full justify-between">
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

              <form onSubmit={handleSubmit} className="flex flex-col relative items-center">
                <div className="grid gap-4 py-1 text-slate-700 overflow-y-scroll max-h-[62vh]">
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

                  <div className="flex items-center relative w-full max-w-2xl pt-2">
                    <Input
                      ref={inputRef}
                      placeholder="Search water questions"
                      name="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="md:col-span-3 bg-muted w-full rounded-full h-12"
                    />

                    <Button
                      type="submit"
                      variant="ghost"
                      className="absolute right-3 h-14 w-full rounded-full"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <SendHorizontal className="w-6 h-6 text-primary" />
                      {!subscription && <Lock className="w-4 h-4 text-background ml-2" />}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </>
          ) : (
            <form className="relative" onSubmit={handleSubmit}>
              <Input
                ref={inputRef}
                placeholder="Search water questions"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="md:col-span-3 bg-muted w-full rounded-full h-14"
              />

              <Button
                type="submit"
                className="w-32 absolute right-6 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                Ask Oasis {!subscription && <Lock className="w-4 h-4 text-background ml-2" />}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
