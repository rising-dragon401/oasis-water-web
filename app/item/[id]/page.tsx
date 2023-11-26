import SubpageLayout from '@/components/home-layout'
import ItemForm from './components/item-form'

export default function ItemPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <SubpageLayout>
      <ItemForm id={id} />
    </SubpageLayout>
  )
}

// search
// most popular
// highest score
// lowest score
// local water
