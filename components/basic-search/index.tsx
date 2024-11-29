'use client'

import { FeedbackModal } from '@/components/shared/feedback-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { P } from '@/components/ui/typography'
import { useDebounce } from '@/lib/hooks/use-debounce'
import algoliasearch from 'algoliasearch'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import ResultsRow from './results-row'

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOIA_SEARCH_KEY!
)

export default function BasicSearch({
  showSearch,
  size,
  indices,
  placeholder,
  numResults,
  searchBoxStyle = 'bubble',
  setItem,
  manualDisable = false,
}: {
  showSearch: boolean
  size: 'small' | 'medium' | 'large'
  indices?: string[]
  placeholder?: string
  numResults?: number
  searchBoxStyle?: 'bubble' | 'line'
  setItem?: (item: string) => void
  manualDisable?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null) // Create a ref for the input element
  const [isShowSearch, setIsShowSearch] = React.useState<boolean>(showSearch)
  const [query, setQuery] = React.useState<string>('')
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputFocused, setInputFocused] = React.useState(false)
  const [queryCompleted, setQueryCompleted] = React.useState(false)
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false)
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])
  const [image, setImage] = React.useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 200)

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
    if (isShowSearch && inputRef.current) {
      inputRef.current.focus() // Automatically focus the input when isShowSearch is true
    }
  }, [isShowSearch])

  useEffect(() => {
    setQueryCompleted(false)
    if (debouncedQuery) {
      handleSearch(debouncedQuery)
    } else {
      setResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    if (indices) {
      setSelectedFilters(indices)
    }
  }, [indices])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    let queries: any[] = []
    if (indices && indices.length > 0) {
      queries = indices.map((index) => ({
        indexName: index,
        query: query,
        params: {
          hitsPerPage: numResults || 5,
        },
      }))
    } else {
      queries = [
        {
          indexName: 'items',
          query: query,
          params: {
            restrictSearchableAttributes: ['name'],

            hitsPerPage: numResults || 15,
          },
        },
        {
          indexName: 'tap_water_locations',
          query: query,
          params: {
            restrictSearchableAttributes: ['name'],

            hitsPerPage: numResults || 5,
          },
        },
        {
          indexName: 'water_filters',
          query: query,
          params: {
            hitsPerPage: numResults || 10,
          },
        },
        {
          indexName: 'ingredients',
          query: query,
          params: {
            restrictSearchableAttributes: ['name'],
            hitsPerPage: numResults || 3,
          },
        },
        {
          indexName: 'companies',
          query: query,
          params: {
            restrictSearchableAttributes: ['name'],

            hitsPerPage: numResults || 3,
          },
        },
        {
          indexName: 'users',
          query: query,
          params: {
            restrictSearchableAttributes: ['name', 'username'],

            hitsPerPage: numResults || 3,
          },
        },
      ]
    }

    await client.multipleQueries(queries).then(({ results }) => {
      const hits = results.map((result: any) => result.hits)

      setResults(hits.flat())
    })

    setIsLoading(false)
    setQueryCompleted(true)
  }

  const getSearchPaddingY = () => {
    switch (size) {
      case 'small':
        return 'py-1'
      case 'medium':
        return 'py-4'
      case 'large':
        return 'py-6'
      default:
        return 'py-10'
    }
  }

  const getSearchTop = () => {
    switch (size) {
      case 'small':
        return 'top-8'
      case 'medium':
        return 'top-12'
      case 'large':
        return 'top-12'
      default:
        return 'top-6'
    }
  }

  const getSearchStyle = () => {
    switch (searchBoxStyle) {
      case 'bubble':
        return 'md:text-base text-base flex gap-2 items-center md:pl-12 pl-10 pr-6 relative bg-card transition-colors border border-border '
      case 'line':
        return 'md:text-base text-base flex gap-2 items-center md:pl-12 pl-10 pr-6 relative border-b'
      default:
        return 'md:text-base text-base flex gap-2 items-center md:pl-12 pl-10 pr-6 relative bg-card transition-colors border border-border'
    }
  }

  const showResults = () => {
    return query.length > 1 && inputFocused && queryCompleted
  }

  const getSearchRounded = () => {
    if (showResults()) {
      return 'rounded-md border-b-none rounded-b-none'
    } else {
      return 'rounded-full'
    }
  }

  return (
    <>
      <FeedbackModal open={openFeedbackModal} setOpen={setOpenFeedbackModal} />

      {isShowSearch && (
        <div className="flex flex-col gap-2 relative w-full max-w-lg" ref={searchContainerRef}>
          <div className="flex flex-row items-center">
            <div className="relative w-full">
              <Input
                ref={inputRef}
                placeholder={placeholder || 'Search'}
                value={query}
                disabled={manualDisable}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setInputFocused(true)}
                icon={<Search className="w-4 h-4 md:ml-2 ml-0" />}
                className={`${getSearchRounded()} ${getSearchStyle()} ${getSearchPaddingY()} !shadow-none`}
              />

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-row items-center">
                {isLoading && (
                  <Loader2 size={20} className="animate-spin text-secondary-foreground" />
                )}
              </div>

              {showResults() && !manualDisable && (
                <div
                  className={`flex flex-col gap-2 bg-card border-b top-4 border-x rounded-b-md absolute w-full z-20 overflow-y-scroll max-h-64  ${getSearchTop()}`}
                >
                  {results.length > 0 && (
                    <div className="flex-grow">
                      {results.map((result) => (
                        <ResultsRow key={result.id} itemResult={result} setItem={setItem} />
                      ))}
                    </div>
                  )}

                  {!isLoading && (
                    <div className="flex items-center flex-wrap justify-between px-4 py-2">
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Link href="/contact">
                          <P>Looking for something else?</P>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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
