import { createSupabaseServerClient } from '@/utils/supabase/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || '/'

  console.log('code: ', code)

  if (code) {
    const supabase = await createSupabaseServerClient()

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (e) {
      console.log('auth exchange code error: ', e)
      // Redirect to the home page or a default page if there's an error
      return NextResponse.redirect(requestUrl.origin + '/errorPage')
    }
  }

  console.log('requestUrl.origin: ', requestUrl.origin + redirectUrl)

  return NextResponse.redirect(requestUrl.origin + redirectUrl)
}
