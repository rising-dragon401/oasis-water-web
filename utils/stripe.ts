import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2023-10-16',
  }
)

export const getStripeSubscription = async (subscriptionId: string) => {
  console.log('getting stripe subscription: ', subscriptionId)

  const subscription = await stripe.subscriptions.retrieve(subscriptionId).catch((error) => {
    console.error('Error fetching subscription:', error)
    throw error
  })

  return subscription
}
