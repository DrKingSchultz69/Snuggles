import { ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, type ShopifyProduct } from '../lib/shopify';
import { formatPrice } from '../lib/utils';

const ProductListing = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const localFallback = [
    {
      id: 'cami-set-cream',
      handle: 'cami-set-cream',
      title: 'Cami Set Cream',
      priceRange: { minVariantPrice: { amount: '749.95', currencyCode: 'INR' } },
      images: { edges: [{ node: { url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20fashion%20cream%20cami%20set%20lounge%20studio&image_size=portrait_4_3', altText: '' } }] },
      description: '',
      variants: { edges: [] }
    },
    {
      id: 'cami-set-brown',
      handle: 'cami-set-brown',
      title: 'Cami Set Brown',
      priceRange: { minVariantPrice: { amount: '1200', currencyCode: 'INR' } },
      images: { edges: [{ node: { url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20fashion%20brown%20cami%20set%20lounge%20studio&image_size=portrait_4_3', altText: '' } }] },
      description: '',
      variants: { edges: [] }
    }
  ] as unknown as ShopifyProduct[];

  const displayProducts = products.length > 0 ? products : localFallback;

  if (loading && products.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container-padding py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif uppercase tracking-widest">{category?.replace('-', ' ') || 'All Products'}</h1>
        
        <div className="flex gap-4 text-sm uppercase tracking-widest">
          <button className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
            Filters <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
            Sort <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
        {displayProducts.map((product) => {
          const price = product.priceRange?.minVariantPrice?.amount || '299';
          const currency = product.priceRange?.minVariantPrice?.currencyCode || 'INR';
          const imgUrl = product.images?.edges?.[0]?.node?.url || '';
          
          return (
            <Link key={product.id} to={`/product/${product.handle}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-muted mb-4 relative">
                <img 
                  src={imgUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide mb-1 group-hover:text-muted-foreground transition-colors">{product.title}</h3>
                  <p className="text-xs text-muted-foreground">The Collection</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(price, currency)}</p>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-24 text-center">
        <button className="border-b border-black pb-1 uppercase tracking-widest text-sm hover:text-muted-foreground hover:border-muted-foreground transition-all">
          Load More
        </button>
      </div>
    </div>
  );
};

export default ProductListing;
