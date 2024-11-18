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
    const { product_id, product_type, product_name, image, lab_id, user_id } = await req.json()

    console.log('product_id: ', product_id)
    console.log('product_type: ', product_type)
    console.log('lab_id: ', lab_id)
    console.log('user_id: ', user_id)

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
      const sessionParams = {
        customer,
        customer_update: {
          address: 'auto',
        },
        line_items: [
          {
            // price_data: {
            //   currency: 'usd',
            //   // product: `prod_REec5gvSo54UXL`,
            //   // product_data: {
            //   //   name: `${product_name} - Standard Water Testing`,
            //   //   description: `Contribute to the lab testing for ${product_name}. 100% of funds go directly to the lab cost.`,
            //   //   images: [image],
            //   //   unit_amount: amount * 100, // Convert dollars to cents
            //   // },
            // },
            price: `price_1QMcgtB1nYcLK5a9I9SSTULx`,
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          product_id,
          product_type,
          lab_id,
          user_id,
        },
        custom_text: {
          submit: {
            message: `Contribute to the lab testing for ${product_name}`, // Custom message for the submit button
          },
        },
        submit_type: 'donate',
        success_url: `${getURL()}/`,
        cancel_url: `${getURL()}/`,
      }

      // @ts-ignore
      session = await stripe.checkout.sessions.create(sessionParams)

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
