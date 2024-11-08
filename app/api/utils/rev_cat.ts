const projectId = process.env.REV_CAT_PROJECT_ID
const apiKey = process.env.REV_CAT_API_KEY

export const getRevenueCatSubscription = async (rcCustomerId: string) => {
  const manualId = '$RCAnonymousID:b16aaa0cfd6947c18f2ae6fe3b78d111'
  try {
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/customers/${manualId}/subscriptions`,
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
