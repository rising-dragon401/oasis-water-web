import { ApplicationError } from '@/lib/errors'
import { getURL } from '@/utils/helpers'
import { stripe } from '@/utils/stripe'
import { createOrRetrieveCustomer } from '@/utils/supabase-admin'
import { getSession } from '@/utils/supabase/server'

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
    const { price, quantity = 1, metadata = {}, referral } = await req.json()

    try {
      // 2. Get the user from Supabase auth
      const authSession = await getSession()

      const user = authSession?.user

      // 3. Retrieve or create the customer in Stripe
      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || '',
      })

      // 4. Create a checkout session in Stripe
      let session
      if (price.type === 'recurring') {
        const sessionParams = {
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer,
          customer_update: {
            address: 'auto',
          },
          line_items: [
            {
              price: price.id,
              quantity,
            },
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            metadata,
          },
          success_url: `${getURL()}/`,
          cancel_url: `${getURL()}/`,
        }
        if (referral) {
          // @ts-ignore
          sessionParams.client_reference_id = referral
        }
        // @ts-ignore
        session = await stripe.checkout.sessions.create(sessionParams)
      } else if (price.type === 'one_time') {
        const sessionParams = {
          payment_method_types: ['card'],
          billing_address_collection: 'required',
          customer,
          customer_update: {
            address: 'auto',
          },
          line_items: [
            {
              price: price.id,
              quantity,
            },
          ],
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: `${getURL()}/`,
          cancel_url: `${getURL()}/`,
        }
        if (referral) {
          // @ts-ignore
          sessionParams.client_reference_id = referral
        }
        // @ts-ignore
        session = await stripe.checkout.sessions.create(sessionParams)
      }

      if (session) {
        return new Response(JSON.stringify({ sessionId: session.id }), {
          status: 200,
        })
      } else {
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: 'Session is not defined' },
          }),
          { status: 500 }
        )
      }
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
