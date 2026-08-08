import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'
import { CartProvider } from './context/CartContext.tsx'
import { SearchProvider } from './context/SearchContext.tsx'

// Vite only exposes VITE_-prefixed variables to the browser, so the Clerk
// publishable key is mirrored under this name (the Marketplace provisions it
// as NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, which never reaches the client here).
// Publishable keys are designed to be public — the secret key stays server-side.
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is missing. Run `vercel env pull .env.local --yes`.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
      <BrowserRouter>
        <SearchProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SearchProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
