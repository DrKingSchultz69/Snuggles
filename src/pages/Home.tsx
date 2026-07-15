import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import { getProducts, type ShopifyProduct } from '../lib/shopify';
import { formatPrice } from '../lib/utils';
import { subscribeToNewsletter } from '../lib/newsletter';

const Home = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    getProducts(4).then(data => {
      if (data) setProducts(data);
    });
  }, []);

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    const result = await subscribeToNewsletter(newsletterEmail);

    if (result.success) {
      setNewsletterStatus('success');
      setNewsletterMessage(result.message || 'Thank you for subscribing.');
      setNewsletterEmail('');
      return;
    }

    setNewsletterStatus('error');
    setNewsletterMessage(result.error || 'Could not subscribe right now.');
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <img 
          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20fashion%20editorial%20woman%20model%20minimal%20background%20studio%20lighting%20high%20end%20clothing&image_size=landscape_16_9" 
          alt="Hero Campaign" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          <h1 className="font-logo text-2xl md:text-4xl lg:text-6xl tracking-normal mb-4 animate-fade-in">Snuggle</h1>
          <p className="text-base md:text-lg tracking-[0.2em] uppercase mb-4 animate-fade-in delay-100">COMFORT IS THE MOOD</p>
          <p className="max-w-md text-base mb-8 animate-fade-in delay-100 opacity-90 font-light leading-relaxed">
            Minimal. Comforting. Intentionally designed.<br/>
            Effortless silhouettes, soft fabrics, and calm colours that move with you.
          </p>
          <Link 
            to="/category/new-in" 
            className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors duration-300 animate-fade-in delay-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* About Snuggle */}
      <section className="py-24 px-4 md:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About Snuggle</span>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight">Your Soft Place to Land</h2>
          <p className="text-muted-foreground leading-relaxed text-sm font-light text-center">
            Snuggle was created for the woman who does everything. The one who shows up, dreams big, hustles 
            <br />
            hard, and still needs a place to breathe. In a world that’s loud and overwhelming, Snuggle is your pause.
            <br />
            <span className="block text-center">Your comfort. Your softness.</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8">
            {['Minimal', 'Breathable', 'Thoughtfully Supported', 'Form-Hugging', 'Movement Design', 'Real Bodies'].map((item) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="editors-note-font text-xl font-light italic text-muted-foreground">"It’s the clothing you reach for not because you need to… but because your body wants to."</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] w-full">
        {[
          { title: 'shop cream', link: '/product/cami-set-cream', img: 'minimal fashion woman cream cami set studio' },
          { title: 'shop brown', link: '/product/cami-set-brown', img: 'minimal fashion woman brown cami set studio' }
        ].map((cat) => (
          <Link 
            key={cat.title} 
            to={cat.link} 
            className="group relative h-full w-full overflow-hidden border-r border-b border-white/10"
          >
            <img 
              src={`https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(cat.img)}&image_size=square_hd`} 
              alt={cat.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <h2 className="editors-note-font text-3xl md:text-4xl font-normal text-white tracking-normal group-hover:tracking-wide transition-all duration-300">
                {cat.title}
              </h2>
            </div>
          </Link>
        ))}
      </section>

      {/* Editorial Campaign */}
      <section className="py-24 px-4 md:px-12 bg-muted/20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome Home</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              A Soft Place <br/> 
              <span className="italic">To Land</span>
            </h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Inspired by calm mornings, slow moments, and the comfort of being held, every piece is designed to feel like home on your skin. Warm tones, soft fabrics, gentle support, and thoughtful silhouettes come together to create loungewear you’ll live in not just wear.
            </p>
            <Link 
              to="/category/women"
              className="inline-flex items-center gap-2 border-b border-black pb-1 uppercase tracking-widest text-sm hover:text-muted-foreground hover:border-muted-foreground transition-colors"
            >
              Discover The Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 h-[600px] overflow-hidden">
            <img 
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=woman%20relaxing%20at%20home%20minimal%20loungewear%20cozy%20sunlight&image_size=portrait_4_3" 
              alt="Welcome Home Collection" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-24 px-4 md:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-1">
            <img
              src="/images/founder.jpeg"
              alt="Shimona, Founder"
              className="w-full max-w-sm h-auto mr-auto lg:ml-12"
            />
          </div>
          <div className="order-2 space-y-8 text-center">
            <h2 className="text-2xl font-serif italic relative -left-24">Founder's Note</h2>
            <p className="leading-relaxed text-muted-foreground font-light text-base relative -left-24">
              "I created snuggle because I wanted clothing that felt like comfort - like a warm cup of tea on a rainy day.  Something soft, minimal, calming… something I could live in, not just wear. After years of working in design, I realised the pieces I wanted didn’t exist in the quality I envisioned — soothing colours, soft fabrics, gentle support, and silhouettes that made you feel held, not squeezed. Snuggle is my love letter to comfort, and I hope every piece feels like a deep breath for you."
            </p>
            <p className="uppercase tracking-widest text-sm relative -left-24">— Shimona, Founder</p>
          </div>
        </div>
      </section>

      {/* Featured Sets */}
      <section className="py-24 container-padding">
        <div className="flex justify-between items-end mb-12">
          <h2 className="editors-note-font text-3xl md:text-4xl tracking-wide">The Collection</h2>
          <Link to="/category/sets" className="hidden md:block text-sm uppercase tracking-widest border-b border-transparent hover:border-black transition-all">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 max-w-4xl mx-auto">
          {products.slice(0, 2).map((product) => (
            <Link key={product.id} to={`/product/${product.handle}`} className="group cursor-pointer block">
              <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                <img
                  src={product.images?.edges?.[0]?.node?.url || ''}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-0 left-0 w-full bg-black text-white py-3 uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  Shop Now
                </button>
              </div>
              <h3 className="text-sm tracking-normal mb-1">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{formatPrice(product.priceRange?.minVariantPrice?.amount || '0', product.priceRange?.minVariantPrice?.currencyCode || 'INR')}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link to="/category/sets" className="text-sm uppercase tracking-widest border-b border-black pb-1">View All</Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-black text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-sans text-3xl md:text-4xl mb-6 uppercase tracking-widest">Join the List</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sign up for exclusive access to new collections, events, and editorial content.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              required
              className="flex-1 bg-transparent border border-gray-700 px-6 py-3 text-white focus:outline-none focus:border-white transition-colors text-center sm:text-left"
            />
            <button 
              type="submit" 
              disabled={newsletterStatus === 'loading'}
              className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
            >
              {newsletterStatus === 'loading' ? 'Subscribing' : 'Subscribe'}
            </button>
          </form>
          {newsletterMessage && (
            <p className={`mt-4 text-sm ${newsletterStatus === 'error' ? 'text-red-300' : 'text-gray-300'}`}>
              {newsletterMessage}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
