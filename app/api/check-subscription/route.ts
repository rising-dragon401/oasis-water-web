import { getRevenueCatSubscription } from '@/utils/rev_cat'
import { getStripeSubscription } from '@/utils/stripe'
import {
  getUserSubscription,
  manageRcSubscriptionChange,
  updateSubscriptionStatus,
} from '@/utils/supabase-admin'

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { uid, rcCustomerId: defaultRcCustomerId } = await req.json()

    console.log('uid: ', uid)
    console.log('defaultRcCustomerId: ', defaultRcCustomerId)

    // TODO - need to check if rcCustomerId matches uid
    // this seems like an edge case
    // Basically only problem if a user account with a stripe id logs into device where they have an rc sub

    try {
      let provider = null
      let subscriptionId = null
      let dbSubData = null

      if (!defaultRcCustomerId || defaultRcCustomerId === undefined) {
        // first get user subscription data from supabase
        // returns most recent subscription
        dbSubData = await getUserSubscription(uid)

        subscriptionId = dbSubData?.id

        // Determine provider
        if (dbSubData) {
          // Stripe subs metadata === {}
          // Revenue Cat subs metadata === { ..., provider: 'revenue_cat', originalAppUserId }
          const metadata = dbSubData?.metadata as any

          if (metadata?.provider === 'revenue_cat') {
            provider = 'revenue_cat'
          } else {
            provider = 'stripe'
          }
        }
      } else {
        provider = 'revenue_cat'
      }

      console.log('provider: ', provider)
      console.log('subscriptionId: ', subscriptionId)

      let subscriptionData = null
      let status = null
      // Now check each provider
      if (provider === 'stripe' && subscriptionId) {
        // get stripe subscription data
        subscriptionData = await getStripeSubscription(subscriptionId)
        console.log('stripe sub data: ', subscriptionData)

        // Now update the subscription status in supabase
        status = subscriptionData?.status
        if (status) {
          await updateSubscriptionStatus(subscriptionId, status)
        }
      } else if (provider === 'revenue_cat') {
        let rcCustomerId = null

        if (!defaultRcCustomerId) {
          // First need to identitfy the rev cat id
          const metadata = dbSubData?.metadata as any

          console.log('metadata: ', JSON.stringify(metadata, null, 2))
          rcCustomerId =
            metadata?.originalAppUserId || metadata?.rcCustomerId || metadata?.customerId
        } else {
          rcCustomerId = defaultRcCustomerId
        }

        console.log('rcCustomerId: ', rcCustomerId)

        subscriptionData = await getRevenueCatSubscription(rcCustomerId)

        console.log('rc sub data: ', JSON.stringify(subscriptionData, null, 2))

        // status = subscriptionData?.items[0]?.status
        // subscriptionId = subscriptionData?.items[0]?.id

        if (subscriptionData) {
          // update or insert subscription to supabase
          const updateRes = await manageRcSubscriptionChange(subscriptionData, rcCustomerId, uid)

          // Used to not return the status/sub id if found duplicate rc customer id
          if (updateRes && updateRes?.success) {
            status = subscriptionData?.items[0]?.status
            subscriptionId = subscriptionData?.items[0]?.id
          }
        }
      }

      console.log('returning status: ', status)
      console.log('returning subscriptionId: ', subscriptionId)

      const responseData = {
        uid,
        subscriptionId,
        provider,
        status,
        subscriptionData,
      }

      // console.log('Subscription Data:', JSON.stringify(responseData, null, 2))

      return new Response(JSON.stringify(responseData), { status: 200 })
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
