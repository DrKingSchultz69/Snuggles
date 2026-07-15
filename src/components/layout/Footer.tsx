import { Instagram } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToNewsletter } from '../../lib/newsletter';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const result = await subscribeToNewsletter(email);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Thank you for subscribing.');
      setEmail('');
      return;
    }

    setStatus('error');
    setMessage(result.error || 'Could not subscribe right now.');
  };

  return (
    <footer className="bg-white border-t border-muted py-12 md:py-24">
      <div className="container-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-logo font-normal">Snuggle</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium contemporary fashion for the modern minimalist. Designed for those who value quality and timeless style.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="editors-note-font font-medium text-sm tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/sets" className="hover:text-black transition-colors">Shop All</Link></li>
              <li><Link to="/product/cami-set-cream" className="hover:text-black transition-colors">Cream Set</Link></li>
              <li><Link to="/product/cami-set-brown" className="hover:text-black transition-colors">Brown Set</Link></li>
              <li><Link to="/policy" className="hover:text-black transition-colors">Care & Policy</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="editors-note-font font-medium text-sm tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/policy" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/policy" className="hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link to="/policy" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="editors-note-font font-medium text-sm tracking-wider">Newsletter</h4>
            <p className="text-muted-foreground text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="flex-1 bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="bg-black text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-black/90 transition-colors"
              >
                {status === 'loading' ? 'Joining' : 'Join the list'}
              </button>
            </form>
            {message && (
              <p className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-muted-foreground'}`}>
                {message}
              </p>
            )}
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.instagram.com/in_snuggle?igsh=ZnQ3b3M0bGoxMA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-black transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Snuggle. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
