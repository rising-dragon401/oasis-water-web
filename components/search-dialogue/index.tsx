'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCompletion } from 'ai/react'
import { X, RotateCcw, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'
import { SEARCH_PREVIEW_QUESTIONS } from './constants'
import { useAtom } from 'jotai'
import { assistantIdAtom, messagesAtom, threadIdAtom } from '@/lib/atoms'
import ChatList from './chat-list'
import useDevice from '@/lib/hooks/use-device'

export function SearchDialog() {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [threadId, setThreadId] = useAtom(threadIdAtom)
  const [abortController, setAbortController] = React.useState<AbortController>()

  const { isMobile } = useDevice()

  React.useEffect(() => {
    if (open && !assistantId) {
      createNewAssistant()
    }
  }, [open])

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
        setAssistantId(data.id)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
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
    setOpen(true)
  }

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      setQuery('')

      const newMessage = {
        role: 'user',
        content: query,
      }

      setMessages((messages) => [...messages, newMessage])

      // create instance of AbortController to handle stream cancellation
      const abortController_ = new AbortController()
      setAbortController(abortController_)
      const { signal } = abortController_

      const response = await fetch('/api/send-message', {
        method: 'POST',
        body: JSON.stringify({
          query,
          assistant_id: assistantId,
          thread_id: threadId,
        }),
        signal,
      })

      const data = await response.json()

      const newAssistantMessage = {
        role: 'assistant',
        content: data.content,
      }

      setThreadId(data.thread_id)

      setMessages((messages) => [...messages, newAssistantMessage])

      setIsLoading(false)
    } catch (e) {
      // remove the last message
      setMessages((messages) => messages.slice(0, messages.length - 1))
    }
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
      <button
        onClick={handleSearchButtonClick}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative bg-muted transition-colors  rounded-md
        border border-secondary-foreground 
        min-w-[300px] shadow-md "
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search water</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
      </button>

      <Dialog open={open} modal={true}>
        <DialogContent className="md:max-h-[80vh] lg:!max-w-4xl md:!max-w-2xl m-6 md:w-full w-[90vw] max-h-[90vh] rounded-md overflow-y-auto text-black">
          <DialogHeader className="sticky flex flex-row items-center w-full justify-between">
            <DialogTitle className="text-left w-30">Ask me a question about your water</DialogTitle>

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

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700 overflow-y-scroll max-h-[62vh]">
              <ChatList messages={messages} isLoading={isLoading} />
            </div>

            <DialogFooter className="flex md:flex-row flex-col gap-2 w-full pt-2">
              <div className="w-full">
                <Input
                  ref={inputRef}
                  placeholder={
                    SEARCH_PREVIEW_QUESTIONS[
                      Math.floor(Math.random() * SEARCH_PREVIEW_QUESTIONS.length)
                    ]
                  }
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="md:col-span-3 bg-muted"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              {isLoading && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="md:w-40 w-full">
                Ask Oaisys
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
