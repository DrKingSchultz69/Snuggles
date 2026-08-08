/**
 * Signed-in customer account: saved shipping address and order history.
 *
 * There are no register/login/logout endpoints here — Clerk owns the whole
 * credential flow in the browser, and this server only ever verifies the
 * session token Clerk issues.
 */
import { Router, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth, type AuthedRequest } from '../lib/auth.js';
import { getProfile, isValidProfileAddress, listOrders, saveProfile } from '../lib/profiles.js';

const router = Router();

const accountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(accountLimiter, requireAuth);

/**
 * GET /api/account/profile
 * Returns the saved shipping address, or null if none has been saved yet.
 */
router.get('/profile', async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const address = await getProfile(req.userId!);
    res.status(200).json({ success: true, address });
  } catch (error) {
    console.error('[account] Failed to load profile:', error);
    res.status(500).json({ success: false, error: 'Failed to load profile' });
  }
});

/**
 * PUT /api/account/profile
 * Creates or replaces the saved shipping address.
 */
router.put('/profile', async (req: AuthedRequest, res: Response): Promise<void> => {
  const address = req.body?.address;

  if (!isValidProfileAddress(address)) {
    res.status(400).json({ success: false, error: 'A valid shipping address is required' });
    return;
  }

  try {
    await saveProfile(req.userId!, address);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[account] Failed to save profile:', error);
    res.status(500).json({ success: false, error: 'Failed to save profile' });
  }
});

/**
 * GET /api/account/orders
 * Order history for the signed-in user, newest first.
 */
router.get('/orders', async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const orders = await listOrders(req.userId!);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('[account] Failed to load orders:', error);
    res.status(500).json({ success: false, error: 'Failed to load orders' });
  }
});

export default router;
