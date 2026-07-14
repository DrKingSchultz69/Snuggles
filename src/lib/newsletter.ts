export type NewsletterResult = {
  success: boolean
  message?: string
  error?: string
}

export const subscribeToNewsletter = async (email: string): Promise<NewsletterResult> => {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const data = (await response.json().catch(() => ({}))) as NewsletterResult

  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'Could not subscribe right now.',
    }
  }

  return {
    success: true,
    message: data.message || 'Thank you for subscribing.',
  }
}
