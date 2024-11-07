import { ApplicationError } from '@/lib/errors'
import { stripe } from '@/utils/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: Request) {
  if (req.method === 'POST') {
    if (!supabaseUrl) {
      throw new ApplicationError('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseServiceKey) {
      throw new ApplicationError('Missing environment variable SUPABASE_SERVICE_ROLE_KEY')
    }

    // 1. Destructure the price and quantity from the POST body
    const { subscriptionId } = await req.json()

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method'],
      })

      return new Response(JSON.stringify(subscription), { status: 200 })
    } catch (err) {
      console.log(err)
      return new Response(JSON.stringify(err), { status: 500 })
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405,
    })
  }
}
