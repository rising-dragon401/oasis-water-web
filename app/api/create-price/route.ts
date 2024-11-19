import { ApplicationError } from '@/lib/errors'
import { stripe } from '@/utils/stripe'
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

      // Create price
      const price = await stripe.prices.create({
        currency: 'usd',
        custom_unit_amount: {
          enabled: true,
        },
        product: `standardWaterTest_pID=${product_id}_pType=${product_type}_pName=${product_name}_labID=${lab_id}`,
      })

      if (price) {
        return new Response(JSON.stringify({ priceId: price.id }), {
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
