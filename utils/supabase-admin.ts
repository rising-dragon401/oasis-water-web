import { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { toDateTime } from './helpers'
import { stripe } from './stripe'

type Product = Database['public']['Tables']['products']['Row']
type Price = Database['public']['Tables']['prices']['Row']

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  }

  const { error } = await supabaseAdmin.from('products').upsert([productData])
  if (error) throw error
  console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  }

  const { error } = await supabaseAdmin.from('prices').upsert([priceData])
  if (error) throw error
  console.log(`Price inserted/updated: ${price.id}`)
}

const createOrRetrieveCustomer = async ({ email, uuid }: { email: string; uuid: string }) => {
  console.log('uuid: ', uuid)

  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single()
  if (error || !data?.stripe_customer_id) {
    // No customer record found, let's create one.
    const customerData: {
      metadata: { supabaseUUID: string }
      email?: string
    } = {
      metadata: {
        supabaseUUID: uuid,
      },
    }
    if (email) customerData.email = email
    const customer = await stripe.customers.create(customerData)
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }])
    if (supabaseError) throw supabaseError
    console.log(`New customer created and inserted for ${uuid}.`)
    return customer.id
  }
  return data.stripe_customer_id
}

const getUserByUUID = async (uuid: string) => {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', uuid).single()
  if (error) throw error
  return data
}

export const getUserSubscription = async (uid: string) => {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', uid)
    .order('created', { ascending: false })

  if (error) {
    return null
  }

  return data[0]
}

export const updateSubscriptionStatus = async (subscriptionId: string, status: any) => {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status })
    .eq('id', subscriptionId)
  if (error) {
    return false
  }

  return true
}

const RC_PRODUCT_IDS = {
  prod16696e4749: 'rc_pro_weekly_499',
  prod3486c429e8: 'rc_pro_annual_47',
  prodb1af374c51: 'rc_pro_weekly_499:rc-pro-weekly-499',
  prod4f3e26720b: 'rc_pro_annual_47:annual-autorenewing',
  prod30030bc74b: 'rc_pro_monthly_4:monthly-autorenewing',
  prod159d98128e: 'rc_pro_monthly_799',
}

export const manageRcSubscriptionChange = async (
  subscriptionData: any,
  rcCustomerId: string,
  uid: string
) => {
  try {
    console.log('manageRcSubscriptionChange', JSON.stringify(subscriptionData, null, 2))

    // Find the most recent subscription item based on starts_at
    // Note it doesn't check expiration date... however RevenueCat shouldn't let you double subscribe
    const subscriptionItem = subscriptionData?.items.sort((a: any, b: any) => {
      return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
    })[0]

    console.log('subscriptionItem', JSON.stringify(subscriptionItem, null, 2))

    // const subscriptionItem = subscriptionData?.items[0]
    const productId = subscriptionItem?.product_id
    const productIdentifier = RC_PRODUCT_IDS[productId as keyof typeof RC_PRODUCT_IDS] || productId
    const entitlementId = subscriptionItem?.entitlements.items[0]?.id
    // const entitlementData = await getRevenueCatEntitlement(rcCustomerId, entitlementId)
    const status = subscriptionItem?.status
    const customerId = rcCustomerId
    const proCreatedAt = subscriptionItem?.created
    const provider = 'revenue_cat'
    const currentPeriodEnd = subscriptionItem?.current_period_end
    const cancelAtPeriodEnd = subscriptionItem?.cancel_at_period_end
    const rcSubscriptionId = subscriptionItem?.id // why did I not use this lolol

    // TOOD maybe overritw all rc sub ids with the ids from revenue cat

    // THIS IS NOT UNIQUE... FUUUUDGE
    // so basically there will be duplicate sub ids for rev cat but never the same sub id for the same user, unless they purchase at the same exact time
    const oldSubId = 'sub_rc_' + proCreatedAt?.toString() + productIdentifier
    // const newSubId = 'sub_rc_' + proCreatedAt?.toString() + uid + productIdentifier
    const newSubId = rcSubscriptionId

    // Unknown amount
    let amount = 0

    if (productIdentifier === 'rc_pro_weekly_499') {
      amount = 499
    } else if (productIdentifier === 'rc_pro_annual_47') {
      amount = 4700
    } else if (productIdentifier === 'rc_pro_monthly_799') {
      amount = 799
    }

    let hasExistingSubscription = false
    let hasActiveSubId = false
    let hasArchivedSubId = false
    let identifiedSubId = null

    // First check for existing subscription with the new sub id
    const { data: newSubIdData, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', newSubId)
      .eq('user_id', uid)

    if (newSubIdData && newSubIdData?.length > 0) {
      identifiedSubId = newSubId
      hasActiveSubId = true
    }

    // If no active sub id, check for old id
    if (!hasActiveSubId) {
      const { data: oldSubIdData, error: fetchError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', oldSubId)
        .eq('user_id', uid)

      if (oldSubIdData && oldSubIdData?.length > 0) {
        identifiedSubId = oldSubId
        hasArchivedSubId = true
      }
    }

    // so we just checked if there is an existing row with the same sub id and user id
    // if there is update it
    // if not, we check if there is a row with the same rcCustomerId
    // if not we insert the new row

    // existing row with same sub id detected
    hasExistingSubscription = hasArchivedSubId || hasActiveSubId

    const subscriptionId = identifiedSubId ? identifiedSubId : newSubId

    console.log('subscriptionId', subscriptionId)
    console.log('hasExistingSubscription', hasExistingSubscription)
    console.log('status', status)

    // Latest data from rev cat
    const subDetailsToAdd = {
      id: subscriptionId,
      user_id: uid,
      metadata: {
        provider,
        rcSubscriptionId,
        rcCustomerId: customerId,
        ...subscriptionItem,
      },
      amount,
      status,
      price_id: productIdentifier || null,
      quantity: 1,
      created: proCreatedAt,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      rc_customer_id: customerId,
    }

    console.log('subDetailsToAdd: ', JSON.stringify(subDetailsToAdd, null, 2))

    // Only allow one row per newSubId
    //

    // if existing, update status
    if (hasExistingSubscription) {
      // need this for restoring purchases
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({ status, rc_customer_id: customerId })
        .eq('id', subscriptionId)

      if (error) {
        console.log('updating existing subscription error', error)
        throw new Error(error.message)
      }

      console.log('updated existing subscription!')
    } else {
      //Removing duplicate check becuase one user can have multiple subs
      // Also each user should have their onw rc customer id

      // Check for row with existing rcCustomerId and subscriptionId
      // const { data: existingRcCustomerIdData, error: fetchError } = await supabaseAdmin
      //   .from('subscriptions')
      //   .select('*')
      //   .eq('rc_customer_id', customerId)
      //   .eq('id', subscriptionId)

      // if (existingRcCustomerIdData && existingRcCustomerIdData?.length > 0) {
      //   // skip, this is a duplicate subscription that belongs to another user
      //   throw new Error(
      //     'Duplicate subscription. Same rcCustomerId but belongs to another user (uid)'
      //   )
      // }

      console.log('inserting new subscription')

      // Insert new subscription
      const { error } = await supabaseAdmin.from('subscriptions').insert(subDetailsToAdd)

      if (error) {
        console.log('inserting new subscription error', error)
        throw new Error(error.message)
      }

      // TODOonly reward referral if subscription is active and new sub
      // if (status === 'active') {
      //   await handleReferral(subscriptionData, uid)
      // }
    }

    return {
      success: true,
      subscriptionId,
      status,
    }
  } catch (error) {
    return {
      success: false,
      data: error,
    }
  }
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid: string, payment_method: Stripe.PaymentMethod) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string
  const { name, phone, address } = payment_method.billing_details
  if (!name || !phone || !address) return
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address })
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq('id', uuid)
  if (error) throw error
}

const handleReferral = async (subscription: Stripe.Subscription, uuid: string) => {
  try {
    console.log('handleReferral: ', subscription, uuid)
    // Attribute referral code to the user
    const userData = await getUserByUUID(uuid)

    // referral codes are simply the other user's username
    const referralCode = userData?.referred_by

    if (!referralCode) return

    // Check if a referral record already exists for this subscription
    const { data: existingReferral, error: fetchError } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('subscription_id', subscription.id)
      .single()

    const referralData = {
      referring_user_id: referralCode,
      user_id: uuid,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      amount: subscription.items.data[0].price.unit_amount,
      currency: subscription.items.data[0].price.currency,
      subscription_status: subscription.status,
    }

    if (existingReferral) {
      // Update existing referral record
      const { error } = await supabaseAdmin
        .from('referrals')
        .update(referralData)
        .eq('id', existingReferral.id)

      throw error
    } else {
      // Insert new referral record
      const { error } = await supabaseAdmin.from('referrals').insert([referralData])
      throw error
    }
  } catch (error) {
    console.error('Error handling referral: ', error)
  }
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  try {
    // Get customer's UUID from mapping table.
    const { data: customerData, error: noCustomerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (noCustomerError) throw noCustomerError

    const { id: uuid } = customerData

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method'],
    })

    // Upsert the latest status of the subscription object.
    const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] = {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(subscription.current_period_start).toISOString(),
      current_period_end: toDateTime(subscription.current_period_end).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
    }

    const { error } = await supabaseAdmin.from('subscriptions').upsert([subscriptionData])
    if (error) throw error
    console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`)

    // Handle referral
    await handleReferral(subscription, uuid)

    // For a new subscription copy the billing details to the customer object.
    // NOTE: This is a costly operation and should happen at the very end.
    if (createAction && subscription.default_payment_method && uuid)
      //@ts-ignore
      await copyBillingDetailsToCustomer(
        uuid,
        subscription.default_payment_method as Stripe.PaymentMethod
      )
  } catch (error) {
    console.error('Error managing subscription status change: ', error)
  }
}

export {
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
}
