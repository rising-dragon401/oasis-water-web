import { stripe } from '@/utils/stripe'
import {
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
} from '@/utils/supabase-admin'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      // Return a response indicating missing signature or webhook secret
      return new Response('Missing signature or webhook secret', { status: 400 })
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.log(`❌ Error message: ${(err as Error).message}`)
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product)
          break
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price)
          break
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          )
          break
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          if (checkoutSession.mode === 'subscription') {
            // // hard-coded for testing
            // await manageSubscriptionStatusChange(
            //   'sub_1Pwz4BB1nYcLK5a9wWgjCT2u',
            //   'cus_Qo4oNrU2WIixjL',
            //   true
            // )

            const subscriptionId = checkoutSession.subscription
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            )
          }
          break
        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new Response('Webhook handler failed. View your nextjs function logs.', {
        status: 400,
      })
    }
  }
  return new Response(JSON.stringify({ received: true }))
}
