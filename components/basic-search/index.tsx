'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchItems } from '@/app/actions/items'
import { searchLocations } from '@/app/actions/locations'
import { useDebounce } from '@/lib/hooks/use-debounce'
import ResultsRow from './results-row'
import { Search } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { searchFilters } from '@/app/actions/filters'
// import { scoreItems } from '@/app/actions/scoring'

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

    const [data, locations, filters] = await Promise.all([
      searchItems(query),
      searchLocations(query),
      searchFilters(query),
    ])

    const combinedResults = [...data, ...locations, ...filters]

    if (combinedResults) {
      setResults(combinedResults)
    }
    setIsLoading(false)
    return
  }

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        {/* <Button variant="ghost" type="submit" loading={isLoading} onClick={() => scoreItems()}>
          Calculate item scores
        </Button> */}

        {/* <Button variant="ghost" type="submit" loading={isLoading} onClick={() => scoreLocations()}>
          Calculate locaitons
        </Button> */}

        {/* <Button variant="ghost" type="submit" loading={isLoading} onClick={() => scoreFilters()}>
          Calculate filter score
        </Button> */}

        {isShowSearch ? (
          <div className="flex flex-col gap-2 relative w-full">
            <div className="relative">
              <Input
                placeholder="Search for bottled water, filters, or tap water locations"
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
