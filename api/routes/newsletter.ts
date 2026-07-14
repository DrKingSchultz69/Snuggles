import { Router, type Request, type Response } from 'express'

const router = Router()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ResendResponse = {
  id?: string
  message?: string
  name?: string
}

router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  const email = String(req.body?.email || '').trim().toLowerCase()

  if (!emailPattern.test(email)) {
    res.status(400).json({
      success: false,
      error: 'Please enter a valid email address.',
    })
    return
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.NEWSLETTER_NOTIFY_TO
  const fromEmail = process.env.NEWSLETTER_FROM || 'Snuggle <onboarding@resend.dev>'

  if (!resendApiKey || !notifyTo) {
    console.log(`[newsletter] New subscriber: ${email}`)
    res.status(200).json({
      success: true,
      message: 'Thank you for subscribing.',
      emailSent: false,
    })
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: notifyTo,
        subject: 'New Snuggle newsletter subscriber',
        html: `
          <p>A customer subscribed to the Snuggle newsletter.</p>
          <p><strong>Email:</strong> ${email}</p>
        `,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as ResendResponse

    if (!response.ok) {
      res.status(502).json({
        success: false,
        error: data.message || 'Could not send the subscription email.',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for subscribing.',
      emailSent: true,
    })
  } catch (error) {
    console.error('[newsletter] Subscribe failed:', error)
    res.status(500).json({
      success: false,
      error: 'Could not process the subscription right now.',
    })
  }
})

export default router
