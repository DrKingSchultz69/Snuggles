import { Minus, Plus, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct, type ShopifyProduct, type ShopifyVariantEdge, type ShopifySelectedOption, type ShopifyImageEdge } from '../lib/shopify';
import { formatPrice } from '../lib/utils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  
  // Determine product based on URL
  const isBrown = id?.includes('brown');
  const productColor = isBrown ? 'Brown' : 'Cream';
  const productImgPrompt = isBrown 
    ? 'minimal fashion brown cami set lounge studio' 
    : 'minimal fashion cream cami set lounge studio';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const product = await getProduct(id);
      if (product) {
        setShopifyProduct(product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  // Derived data (Shopify or Local Fallback)
  const productName = shopifyProduct?.title || (isBrown ? 'Snuggle Cami Set - Brown' : 'Snuggle Cami Set - Cream');
  const productPrice = shopifyProduct?.priceRange?.minVariantPrice?.amount || '2499.00';
  const productCurrency = shopifyProduct?.priceRange?.minVariantPrice?.currencyCode || 'INR';

  // Find matching variant
  const hasVariants = shopifyProduct?.variants?.edges?.some((edge: ShopifyVariantEdge) => 
    edge.node.selectedOptions.some(opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'color')
  );

  const selectedVariant = hasVariants 
    ? shopifyProduct?.variants?.edges?.find((edge: ShopifyVariantEdge) => {
        const variant = edge.node;
        const hasSize = variant.selectedOptions.some(
          (opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'size' && opt.value.toLowerCase() === selectedSize.toLowerCase()
        );
        const hasColor = variant.selectedOptions.some(
          (opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === productColor.toLowerCase()
        );
        const hasColorOption = variant.selectedOptions.some((opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'color');
        return hasSize && (!hasColorOption || hasColor);
      })?.node
    : shopifyProduct?.variants?.edges?.[0]?.node;

  const isAvailable = shopifyProduct ? (selectedVariant ? selectedVariant.availableForSale : false) : true;
  const quantityAvailable = undefined; // We removed this from storefront query to prevent permissions errors

  const getSizeAvailability = (size: string) => {
    if (!shopifyProduct) return true;
    if (!hasVariants) return true; // If no size variants exist, all sizes are visually select-able
    const variant = shopifyProduct.variants?.edges?.find((edge: ShopifyVariantEdge) => {
      const v = edge.node;
      const hasSize = v.selectedOptions.some(
        (opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'size' && opt.value.toLowerCase() === size.toLowerCase()
      );
      const hasColor = v.selectedOptions.some(
        (opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === productColor.toLowerCase()
      );
      const hasColorOption = v.selectedOptions.some((opt: ShopifySelectedOption) => opt.name.toLowerCase() === 'color');
      return hasSize && (!hasColorOption || hasColor);
    })?.node;
    return variant ? variant.availableForSale : false;
  };

  const productDescription = shopifyProduct?.description || (
    <div className="space-y-4 text-muted-foreground leading-relaxed">
      <p className="font-medium text-black">Minimal. Soft. Comfort-driven.</p>
      <p>
        Snuggle is built for the quiet moments — the slow mornings, the gentle evenings, the space where you return to yourself. Designed to feel like a hug, not a trend.
      </p>
      <ul className="list-disc list-inside text-sm space-y-1 pt-4">
        <li>Soft, breathable fabrics (Cotton-Lycra)</li>
        <li>Moulded removable pads</li>
        <li>Double-layered front with under-bust elastic</li>
        <li>Wide-leg lounge pants with soft waistband</li>
        <li>Warm, calming colours</li>
      </ul>
    </div>
  );

  const images = shopifyProduct?.images?.edges?.map((e: ShopifyImageEdge) => e.node.url) || [
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(productImgPrompt)}&image_size=portrait_4_3`,
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(productImgPrompt + ' detail shot')}&image_size=portrait_4_3`,
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(productImgPrompt + ' fabric texture')}&image_size=portrait_4_3`,
    `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(productImgPrompt + ' lifestyle shot')}&image_size=portrait_4_3`
  ];

  const handleAddToCart = () => {
    addToCart({
      variantId: selectedVariant?.id,
      name: productName,
      size: selectedSize,
      color: productColor,
      price: parseFloat(productPrice),
      img: images[0],
      quantity: quantity
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left: Gallery */}
      <div className="lg:h-screen lg:overflow-y-auto hide-scrollbar bg-muted/20">
        <div className="grid grid-cols-1 gap-1">
          {images.map((url: string, i: number) => (
            <img 
              key={i}
              src={url} 
              alt={`${productName} view ${i + 1}`}
              className="w-full h-auto object-cover"
            />
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="p-8 lg:p-24 lg:h-screen lg:overflow-y-auto flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-serif uppercase tracking-widest leading-tight">
                {productName}
              </h1>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xl font-medium">{formatPrice(productPrice, productCurrency)}</p>
          </div>

          {/* Controls */}
          <div className="space-y-8 pt-8 border-t border-muted">
            {/* Color Selection */}
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-wide">Color: {productColor}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/product/cami-set-cream')}
                  className={`w-8 h-8 rounded-full bg-[#F5F5F5] border-2 transition-all ${!isBrown ? 'border-black ring-1 ring-black ring-offset-2' : 'border-transparent hover:border-muted-foreground'}`}
                  aria-label="Cream"
                />
                <button 
                  onClick={() => navigate('/product/cami-set-brown')}
                  className={`w-8 h-8 rounded-full bg-[#8B4513] border-2 transition-all ${isBrown ? 'border-black ring-1 ring-black ring-offset-2' : 'border-transparent hover:border-muted-foreground'}`}
                  aria-label="Brown"
                />
              </div>
            </div>

            {/* Size */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm uppercase tracking-wide">
                <span>Size</span>
                <button className="underline decoration-muted-foreground underline-offset-4 hover:decoration-black transition-all">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L'].map((size) => {
                  const available = getSizeAvailability(size);
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      className={`py-3 text-sm border transition-colors relative ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : available 
                            ? 'border-muted hover:border-black' 
                            : 'border-muted text-muted-foreground/40 cursor-not-allowed bg-muted/10 line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {shopifyProduct && selectedVariant && selectedVariant.availableForSale && quantityAvailable !== null && quantityAvailable !== undefined && quantityAvailable <= 5 && (
                <p className="text-xs text-amber-600 mt-2 font-medium">
                  Only {quantityAvailable} left in stock - order soon
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <div className="flex items-center border border-muted px-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:text-muted-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:text-muted-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`flex-1 py-4 uppercase tracking-widest transition-colors ${
                  isAvailable 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>
          </div>

          {/* Description */}
          {typeof productDescription === 'string' ? (
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap mt-8">
              {productDescription}
            </div>
          ) : (
            <div className="mt-8">
              {productDescription}
            </div>
          )}
          
          {/* Accordion sections */}
          <div className="pt-12 space-y-4">
             <div className="border-b border-muted py-4 group">
               <div className="flex justify-between cursor-pointer">
                 <span className="uppercase tracking-wide text-sm group-hover:pl-2 transition-all">Fabric & Care</span>
                 <Plus className="w-4 h-4" />
               </div>
               <div className="hidden group-hover:block pt-4 text-sm text-muted-foreground space-y-2 animate-fade-in">
                 <p>To keep your Snuggle sets soft, comfy, and long-lasting:</p>
                 <ul className="list-disc list-inside space-y-1">
                   <li>Hand wash or machine wash on gentle mode</li>
                   <li>Use mild detergent with similar colours</li>
                   <li>Do not bleach, tumble dry, or wring</li>
                   <li>Dry flat or hang in shade</li>
                   <li>Iron on low heat (avoid elastics)</li>
                   <li>Remove pads before washing</li>
                 </ul>
               </div>
             </div>

             <div className="border-b border-muted py-4 group">
               <div className="flex justify-between cursor-pointer">
                 <span className="uppercase tracking-wide text-sm group-hover:pl-2 transition-all">Shipping & Returns</span>
                 <Plus className="w-4 h-4" />
               </div>
               <div className="hidden group-hover:block pt-4 text-sm text-muted-foreground space-y-2 animate-fade-in">
                 <p><strong>Shipping:</strong> Dispatched within 5–10 working days.</p>
                 <p><strong>Returns:</strong> No return/exchange policy due to hygiene standards.</p>
                 <p>Replacements offered only for damaged/wrong items with unboxing video within 48h.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
