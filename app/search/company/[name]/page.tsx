import SubpageLayout from '@/components/home-layout'
import type { Metadata, ResolvingMetadata } from 'next'
import { OG_IMAGE } from '@/lib/constants/images'
import CompanyForm from './components/company-form'

type Props = {
  params: { name: string }
  searchParams: { id: string; [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const name = decodeURIComponent(params.name)

  const fullName = name + ' Products'

  return {
    title: fullName || 'Oasis',
    openGraph: {
      images: [OG_IMAGE],
    },
  }
}

export default function CompanyPage({ params }: Props) {
  const name = decodeURIComponent(params.name)

  return (
    <SubpageLayout>
      <CompanyForm name={name} />
    </SubpageLayout>
  )
}
