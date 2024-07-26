import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'
import { Suspense } from 'react'

export default async function FiltersPage() {
  return (
    <SubpageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RankingList categoryId="filter" />
      </Suspense>
    </SubpageLayout>
  )
}
