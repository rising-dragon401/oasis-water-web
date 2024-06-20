import { ApplicationError } from '@/lib/errors'

import { stripe } from '@/utils/stripe'
import { createOrRetrieveCustomer } from '@/utils/supabase-admin'
import { getURL } from '@/utils/helpers'
import { getSession } from '@/utils/supabase/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      if (!supabaseUrl) {
        throw new ApplicationError('Missing environment variable SUPABASE_URL')
      }

      if (!supabaseServiceKey) {
        throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
      }

      // 2. Get the user from Supabase auth
      const authSession = await getSession()

      const user = authSession?.user

      if (!user) throw Error('Could not get user')
      const customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || '',
      })

      if (!customer) throw Error('Could not get customer')
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/`,
      })

      return new Response(JSON.stringify({ url }), {
        status: 200,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'

      return new Response(JSON.stringify({ error: { statusCode: 500, message: message } }), {
        status: 500,
      })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    })
  }
}
