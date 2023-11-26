'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchItems } from '@/app/actions/items'
import { useDebounce } from '@/lib/hooks/use-debounce'
import ResultsRow from './results-row'
import { Search } from 'lucide-react'

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

    const data = await searchItems(query)

    if (data) {
      setResults(data)
    }

    setIsLoading(false)
    return
  }

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        {isShowSearch ? (
          <div className="flex flex-col gap-2 relative md:w-full w-56">
            <Input
              placeholder="Enter brand of water"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-base flex gap-2 items-center px-4 py-2 z-50 relative bg-muted transition-colors rounded-md border border-secondary-foreground md:min-w-[300px] shadow-md"
            />
            {results.length > 0 && (
              <div className="flex flex-col gap-2 bg-muted border-secondary-foreground border rounded-md absolute top-10 w-full">
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
