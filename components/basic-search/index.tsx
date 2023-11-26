'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchItems } from '@/app/actions/items'
import { useDebounce } from '@/lib/hooks/use-debounce'
import ResultsRow from './results-row'

export default function BasicSearch() {
  const [query, setQuery] = React.useState<string>('')
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const debouncedQuery = useDebounce(query, 500) // 500ms delay

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery)
    }
  }, [debouncedQuery])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const data = await searchItems(query)

    console.log('data: ', data)

    if (data) {
      setResults(data)
    }

    setIsLoading(false)
    return
  }

  console.log('results: ', results)

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-col gap-2 relative w-full">
          <Input
            placeholder="Enter brand of water"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-base flex gap-2 items-center px-4 py-2 z-50 relative bg-muted transition-colors rounded-md  border border-secondary-foreground min-w-[300px] shadow-md "
          />
          {results.length > 0 && (
            <div className="flex flex-col gap-2 bg-muted border-secondary-foreground border rounded-md absolute top-10 w-full">
              {results.map((result) => (
                <ResultsRow key={result.id} itemResult={result} />
              ))}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className="md:w-40 w-full"
          loading={isLoading}
          onClick={() => handleSearch(query)}
        >
          Search
        </Button>
      </div>
    </>
  )
}
