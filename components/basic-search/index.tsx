'use client'

import { FeedbackModal } from '@/components/shared/feedback-modal'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/lib/hooks/use-debounce'
import algoliasearch from 'algoliasearch'
import { Loader2, Search } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { AISearchDialog } from '../search-dialogue'
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
}: {
  showSearch: boolean
  size: 'small' | 'medium' | 'large'
  indices?: string[]
  placeholder?: string
  numResults?: number
}) {
  const [isShowSearch, setIsShowSearch] = React.useState<boolean>(showSearch)
  const [query, setQuery] = React.useState<string>('')
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [inputFocused, setInputFocused] = React.useState(false)
  const [queryCompleted, setQueryCompleted] = React.useState(false)
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false)
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])

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

  useEffect(() => {
    if (indices) {
      setSelectedFilters(indices)
    }
  }, [indices])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    let queries: any[] = []
    if (selectedFilters) {
      queries = selectedFilters.map((index) => ({
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
            hitsPerPage: numResults || 5,
          },
        },
        {
          indexName: 'tap_water_locations',
          query: query,
          params: {
            hitsPerPage: numResults || 5,
          },
        },
        {
          indexName: 'water_filters',
          query: query,
          params: {
            hitsPerPage: numResults || 3,
          },
        },
        {
          indexName: 'ingredients',
          query: query,
          params: {
            hitsPerPage: numResults || 3,
          },
        },
        {
          indexName: 'companies',
          query: query,
          params: {
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
        return 'py-4'
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
        return 'top-12'
      case 'medium':
        return 'top-12'
      case 'large':
        return 'top-14'
      default:
        return 'top-12'
    }
  }

  return (
    <>
      <FeedbackModal open={openFeedbackModal} setOpen={setOpenFeedbackModal} />

      {isShowSearch && (
        <div className="flex flex-col gap-2 relative w-full max-w-xl" ref={searchContainerRef}>
          <div className="relative">
            <Input
              placeholder={
                size !== 'large'
                  ? 'Search water'
                  : placeholder || 'Search water, locations, filters...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              className={`md:text-base text-xs flex gap-2 items-center px-4 ${getSearchPaddingY()} relative bg-muted transition-colors border border-secondary-foreground md:min-w-[300px] min-w-[200px] shadow-md rounded-full`}
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 flex flex-row gap-2 items-center">
              {/* <SearchDropdown item={selectedFilters} setItem={setSelectedFilters} /> */}

              {isLoading && (
                <Loader2 size={20} className="animate-spin text-secondary-foreground" />
              )}

              <AISearchDialog size={size} />
            </div>
          </div>
          {query.length > 1 && inputFocused && queryCompleted && (
            <div
              className={`flex flex-col gap-2 bg-muted border-secondary-foreground border rounded-xl absolute w-full z-10 overflow-y-scroll max-h-64 ${getSearchTop()}`}
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
