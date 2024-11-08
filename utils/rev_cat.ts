const projectId = process.env.REV_CAT_PROJECT_ID
const apiKey = process.env.REV_CAT_API_KEY

export const getRevenueCatSubscription = async (rcCustomerId: string) => {
  try {
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/customers/${rcCustomerId}/subscriptions`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return false
  }
}

export const getRevenueCatEntitlement = async (rcCustomerId: string, entitlementId: string) => {
  try {
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/entitlements/${entitlementId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching entitlement:', error)
    return false
  }
}
