import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'
import { Suspense } from 'react'

export default async function TopRatedPage() {
  return (
    <SubpageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <RankingList />
      </Suspense>
    </SubpageLayout>
  )
}
