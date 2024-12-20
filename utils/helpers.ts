import { Database } from '@/types/supabase'

type Price = Database['public']['Tables']['prices']['Row']

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`

  if (process?.env?.NEXT_PUBLIC_NODE_ENV === 'development') {
    // remove https with http for local development
    url = url.replace('https://', 'http://')
  }

  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  // If url ends with '/', remove it.
  url = url.endsWith('/') ? url.slice(0, -1) : url

  return url
}

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}

export const determineLink = (item: any) => {
  if (item.type === 'tap_water') {
    return `/search/location/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
  } else if (
    item.type === 'filter' ||
    item.type === 'bottle_filter' ||
    item.type === 'shower_filter'
  ) {
    return `/search/filter/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
  } else if (item.type === 'ingredient') {
    return `/search/ingredient/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
  } else if (
    item.type === 'item' ||
    item.type === 'bottled_water' ||
    item.type === 'water_gallon' ||
    item.type === 'flavored_water' ||
    item.type === 'energy_drink' ||
    item.type === 'sports_drink' ||
    item.type === 'coconut_water'
  ) {
    return `/search/item/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
  } else if (item.type === 'user') {
    return `/${item.username}`
  } else if (item.type === 'company') {
    return `/search/company/${item.name}`
  } else {
    return '/'
  }
}

export const postData = async ({
  url,
  data,
}: {
  url: string
  data?: { price: Price; metadata: any; referral: string | null }
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.log('Error in postData', { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}

export const postDataDonate = async ({
  url,
  data,
}: {
  url: string
  data: {
    product_id: string
    product_type: string
    product_name: string
    image?: string
    lab_id: string
    user_id: string
  }
}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.log('Error in postData', { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}

export const timeSince = (date: string) => {
  const now = new Date()
  const createdAt = new Date(date)
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())

  const diffSeconds = Math.floor(diffTime / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }
}
