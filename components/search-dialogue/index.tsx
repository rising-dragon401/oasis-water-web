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
import { X, User, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'
import { SEARCH_PREVIEW_QUESTIONS } from './constants'
import { useAtom } from 'jotai'
import { assistantIdAtom, messagesAtom } from '@/lib/atoms'
import ChatList from './chat-list'

export function SearchDialog() {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [assistantId, setAssistantId] = useAtom(assistantIdAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = useAtom(messagesAtom)
  const [abortController, setAbortController] = React.useState<AbortController>()

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
        }),
        signal,
      })

      const data = await response.json()

      const newAssistantMessage = {
        role: 'assistant',
        content: data.data,
      }

      setMessages((messages) => [...messages, newAssistantMessage])

      setIsLoading(false)
    } catch (e) {
      // remove the last message
      setMessages((messages) => messages.slice(0, messages.length - 1))
    }
  }

  const handleReset = async () => {
    setMessages([])
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
        <span className="inline-block ml-4">Search...</span>
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
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <div className="flex flex-row gap-2">
              <DialogTitle>Ask me a question about your water</DialogTitle>

              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
            {/* <DialogDescription>
              Build your own ChatGPT style search with Next.js, OpenAI & Supabase.
            </DialogDescription> */}
            {/* <hr /> */}
            <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {/* {query && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{' '}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
                </div>
              )} */}

              {/* {isLoading && (
                <div className="relative flex w-10 h-10 ml-2">
                  <Loader />
                </div>
              )} */}

              {/* {error && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )} */}

              <ChatList messages={messages} isLoading={isLoading} />

              {/* {completion && !error ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <Logo />

                  {completion && JSON.parse(completion).data} 
                </div>
              ) : null} */}

              <div className="relative">
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
                  className="col-span-3 bg-muted"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              {/* <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{' '}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => setQuery('What are embeddings?')}
                >
                  What are embeddings?
                </button>
              </div> */}
            </div>
            <DialogFooter>
              {isLoading && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">Ask</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
