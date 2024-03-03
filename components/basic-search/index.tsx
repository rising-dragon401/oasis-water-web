'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/lib/hooks/use-debounce'
import ResultsRow from './results-row'
import { Search, Loader2 } from 'lucide-react'
import algoliasearch from 'algoliasearch'
import { motion } from 'framer-motion'
import Typography from '@/components/typography'
import { FeedbackModal } from '@/components/shared/feedback-modal'

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOIA_SEARCH_KEY!
)

export default function BasicSearch({
  showSearch,
  size,
}: {
  showSearch: boolean
  size: 'small' | 'medium' | 'large'
}) {
  const [isShowSearch, setIsShowSearch] = React.useState<boolean>(showSearch)
  const [query, setQuery] = React.useState<string>('')
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputFocused, setInputFocused] = React.useState(false)
  const [queryCompleted, setQueryCompleted] = React.useState(false)
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false)

  const debouncedQuery = useDebounce(query, 500)

  const searchContainerRef = useRef<HTMLDivElement>(null) // Create a ref for the search container

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setInputFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setQueryCompleted(false)
    if (debouncedQuery) {
      handleSearch(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const queries = [
      {
        indexName: 'items',
        query: query,
        params: {
          hitsPerPage: 5,
        },
      },
      {
        indexName: 'tap_water_locations',
        query: query,
        params: {
          hitsPerPage: 3,
        },
      },
      {
        indexName: 'water_filters',
        query: query,
        params: {
          hitsPerPage: 3,
        },
      },
      {
        indexName: 'ingredients',
        query: query,
        params: {
          hitsPerPage: 3,
        },
      },
      {
        indexName: 'companies',
        query: query,
        params: {
          hitsPerPage: 3,
        },
      },
    ]

    setQueryCompleted(true)

    client.multipleQueries(queries).then(({ results }) => {
      const hits = results.map((result: any) => result.hits)
      setResults(hits.flat())

      setIsLoading(false)
    })
  }

  let paddingY, top
  switch (size) {
    case 'small':
      paddingY = '4'
      top = '12'
      break
    case 'medium':
      paddingY = '8'
      top = '12'
      break
    case 'large':
      paddingY = '12'
      top = '12'
      break
    default:
      paddingY = '12' // Default to large size values
      top = '14'
  }

  return (
    <>
      <FeedbackModal open={openFeedbackModal} setOpen={setOpenFeedbackModal} />

      {isShowSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 relative w-full max-w-xl"
          ref={searchContainerRef}
        >
          <div className="relative">
            <Input
              placeholder="Search water..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              className={` text-base flex gap-2 items-center px-4 py-${paddingY} z-50 relative bg-muted transition-colors border border-secondary-foreground md:min-w-[300px] shadow-md rounded-full`}
            />
            {isLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50">
                <Loader2 size={20} className="animate-spin text-secondary-foreground" />
              </div>
            )}
          </div>
          {query.length > 2 && inputFocused && queryCompleted && (
            <div
              className={`flex flex-col gap-2 bg-muted border-secondary-foreground border rounded-xl absolute w-full z-10 overflow-y-scroll max-h-64 top-${top}`}
            >
              {results.length > 0 && (
                <div className="flex-grow ">
                  {results.map((result) => (
                    <ResultsRow key={result.id} itemResult={result} />
                  ))}
                </div>
              )}

              {!isLoading && (
                <div className="flex items-center flex-wrap justify-between bg-muted  px-4 py-2">
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <Typography size="base" fontWeight="normal">
                      Not seeing what you are looking for?
                    </Typography>
                  </div>
                  <Button
                    variant="outline"
                    className="text-secondary-foreground"
                    onClick={() => {
                      setOpenFeedbackModal(true)
                    }}
                  >
                    Let us know
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {!isShowSearch && (
        <Button
          variant="ghost"
          type="submit"
          loading={isLoading}
          onClick={() => setIsShowSearch(true)}
        >
          <Search size={20} />
        </Button>
      )}
    </>
  )
}
