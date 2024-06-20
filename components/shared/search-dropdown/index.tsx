'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

export const Items = [
  {
    id: 'items',
    name: 'Bottled water',
  },
  {
    id: 'tap_water_locations',
    name: 'Tap water',
  },
  {
    id: 'water_filters',
    name: 'Filters',
  },
  {
    id: 'ingredients',
    name: 'Ingredients',
  },
  {
    id: 'companies',
    name: 'Companies',
  },
  {
    id: 'all',
    name: 'All',
  },
]

type Props = {
  item: string[]
  setItem: (item: string[]) => void
}

export default function SearchDropdown({ item, setItem }: Props) {
  const [label, setLabel] = useState('All')

  return (
    <div className="bg-background px-2 boder-input">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="btn btn-primary">{label || 'all'}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => {
                setItem([item.id])
                setLabel(item.name)
              }}
            >
              <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
