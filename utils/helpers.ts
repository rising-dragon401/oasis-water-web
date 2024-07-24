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
    item.type === 'water_gallon'
  ) {
    return `/search/item/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
  } else if (item.type === 'user') {
    return `/${item.id}`
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
