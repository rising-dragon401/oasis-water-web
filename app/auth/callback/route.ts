import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (e) {
      console.log('auth exchange code error: ', e)
    }
  }

  const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL
  //  const redirectUrl = requestUrl.origin

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectUrl + '/auth/signin')
}
