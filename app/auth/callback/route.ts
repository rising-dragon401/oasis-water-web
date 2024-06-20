import { createSupabaseServerClient } from '@/utils/supabase/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This is only called for Provider Supabase auth, not email password
// email passowrd is handled in onAuthStateChanged listener
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || '/'
  const modalToOpen = requestUrl.searchParams.get('modal') || ''

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

  let finalRedirectUrl = requestUrl.origin + redirectUrl
  if (modalToOpen) {
    finalRedirectUrl += modalToOpen
  }
  return NextResponse.redirect(finalRedirectUrl)
}
