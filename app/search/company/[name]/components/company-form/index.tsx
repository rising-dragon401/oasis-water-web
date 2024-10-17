'use client'

import { getCompanyByName, getCompanyItems } from '@/app/actions/companies'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Company } from '@/types/custom'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ItemSkeleton from '../company-skeleton'

type Props = {
  name: string
}

export default function CompanyForm({ name }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [company, setCompany] = useState<Company>()
  const [items, setItems] = useState<any>([])

  const fetchCompany = async (id: string) => {
    // fetch company by name
    const company = await getCompanyByName(id)
    if (!company) {
      setIsLoading(false)
      return
    }
    setCompany(company)
    return company
  }

  const fetchItemsFromCompany = async (id: number) => {
    const items = await getCompanyItems(id)
    setItems(items)
    setIsLoading(false)
    return items
  }

  useEffect(() => {
    fetchCompany(name)
  }, [name])

  useEffect(() => {
    if (company && company.id) {
      fetchItemsFromCompany(company.id)
    }
  }, [company])

  if (isLoading || !company) {
    return <ItemSkeleton />
  }

  return (
    <>
      <div className="md:py-10 py-6 md:px-4 w-full">
        <div className="flex flex-col items-center justify-center w-full gap-6">
          <div className="flex flex-col gap-6 ">
            <Typography size="3xl" fontWeight="normal">
              {company.name}
            </Typography>
          </div>
          {company.image && (
            <Image
              src={company.image || ''}
              alt={company.name}
              width={200}
              height={200}
              className="rounded-md"
            />
          )}
        </div>
        <div className="flex flex-col items-start w-full gap-6 mt-10">
          <Typography size="xl" fontWeight="normal">
            Products
          </Typography>
          <div className="flex-wrap justify-start flex-row gap-6 grid md:grid-cols-3 grid-cols-1">
            {items &&
              items.map((item: any) => <ItemPreviewCard key={item.id} item={item} alwaysShow />)}
          </div>
        </div>
      </div>
    </>
  )
}
