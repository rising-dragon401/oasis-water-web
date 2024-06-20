export const submitFeedback = async (feedback: string, uid?: string | null) => {
  const result = await fetch('/api/submit-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feedback,
      uid,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }

      throw new Error('Failed to submit feedback')
    })
    .catch((error) => {
      console.error('Error submitting feedback:', error)
      return { error }
    })

  return result
}
