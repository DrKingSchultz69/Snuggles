/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import accountRoutes from './routes/account.js'
import newsletterRoutes from './routes/newsletter.js'
import paymentRoutes from './routes/payment.js'

// load env. .env.local holds the Vercel-provisioned values (`vercel env pull`)
// and .env the older hand-managed secrets; dotenv never overwrites a key that
// is already set, so loading .env.local first gives it precedence. Neither
// file exists on Vercel, where the platform injects the variables directly.
dotenv.config({ path: '.env.local' })
dotenv.config()

const app: express.Application = express()

// Vercel (and most hosts) sit in front of this app as a reverse proxy, so
// req.ip would otherwise resolve to the proxy's address for every request —
// this tells Express to read the real client IP from X-Forwarded-For,
// which the rate limiters below rely on.
app.set('trust proxy', 1)

app.use(cors())
app.use(
  express.json({
    limit: '10mb',
    // Keep the raw bytes around so webhook handlers (e.g. Razorpay) can
    // verify the payload signature against the exact body Razorpay signed.
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: Buffer }).rawBody = buf
    },
  }),
)
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/account', accountRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/payment', paymentRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((_error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
