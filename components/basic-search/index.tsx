'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/lib/hooks/use-debounce'
import ResultsRow from './results-row'
import { Search } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import algoliasearch from 'algoliasearch'

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOIA_SEARCH_KEY!
)

export default function BasicSearch({ showSearch }: { showSearch: boolean }) {
  const [isShowSearch, setIsShowSearch] = React.useState<boolean>(showSearch)
  const [query, setQuery] = React.useState<string>('')
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const debouncedQuery = useDebounce(query, 500) // 500ms delay

  useEffect(() => {
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
          hitsPerPage: 5,
        },
      },
      {
        indexName: 'water_filters',
        query: query,
        params: {
          hitsPerPage: 10,
        },
      },
      {
        indexName: 'ingredients',
        query: query,
        params: {
          hitsPerPage: 3,
        },
      },
    ]

    client.multipleQueries(queries).then(({ results }) => {
      const hits = results.map((result: any) => result.hits)
      setResults(hits.flat())

      setIsLoading(false)
    })
  }

  return (
    <>
      <div className="flex flex-row gap-2 items-center justify-center w-full">
        {isShowSearch ? (
          <div className="flex flex-col gap-2 relative w-full max-w-xl">
            <div className="relative">
              <Input
                placeholder="Search water..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-base flex gap-2 items-center px-4 py-2 z-50 relative bg-muted transition-colors rounded-md border border-secondary-foreground md:min-w-[300px] shadow-md"
              />
              {isLoading && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50">
                  <Loader2 size={20} className="animate-spin text-secondary-foreground" />
                </div>
              )}
            </div>
            {results.length > 0 && (
              <div className="flex flex-col gap-2 bg-muted border-secondary-foreground border rounded-md absolute top-10 w-full z-10 h-56 overflow-y-scroll">
                {results.map((result) => (
                  <ResultsRow key={result.id} itemResult={result} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            type="submit"
            loading={isLoading}
            onClick={() => setIsShowSearch(true)}
          >
            <Search size={20} />
          </Button>
        )}
      </div>
    </>
  )
}
