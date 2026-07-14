import { Link } from 'react-router-dom';

const Policy = () => {
  return (
    <div className="max-w-3xl mx-auto py-24 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl uppercase tracking-widest">Policy & Care</h1>
        <p className="text-muted-foreground">Everything you need to know about your Snuggle pieces.</p>
      </div>

      {/* Shipping */}
      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Shipping Policy</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <strong>Timeline:</strong> All Snuggle pieces are made in limited batches. Orders are dispatched within 5–10 working days from the date of purchase.
          </p>
          <p>
            <strong>Delivery:</strong>
            <br/>Metro cities: 2–4 days after dispatch
            <br/>Non-metro: 4–7 days after dispatch
          </p>
          <p>
            <strong>Charges:</strong>
            <br/>Tamil Nadu: ₹60
            <br/>South India: ₹70–₹80
            <br/>Rest of India: ₹90–₹110
          </p>
        </div>
      </section>

      {/* Returns */}
      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Refund & Return Policy</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            At Snuggle, every piece is made in small batches with high attention to detail, fit, and comfort. 
            To maintain hygiene standards and protect all our customers, we currently follow a <strong>no return / no exchange policy</strong> on all products.
          </p>
          <div className="bg-muted/30 p-6 rounded-sm">
            <h3 className="font-medium text-black mb-2">Replacement Policy</h3>
            <p>We offer replacements ONLY if:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>You received a wrong item</li>
              <li>The product arrived damaged</li>
              <li>There is a manufacturing defect</li>
            </ul>
            <p className="mt-4 text-sm">
              Please reach out within 48 hours with your order number, <strong>unboxing video (mandatory)</strong>, and clear photos.
            </p>
          </div>
        </div>
      </section>

      {/* Care */}
      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Product Care</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>To keep your Snuggle sets soft, comfy, and long-lasting:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <li>• Hand wash or machine wash on gentle mode</li>
            <li>• Use mild detergent</li>
            <li>• Wash with similar colours</li>
            <li>• Do not bleach or tumble dry</li>
            <li>• Dry flat or hang in shade</li>
            <li>• Remove pads before washing</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <h2 className="text-2xl border-b border-black pb-2">Frequently Asked Questions</h2>
        
        {[
          { q: "What sizes do you offer?", a: "We currently offer XS, S, M, L. Our sizing is designed to be form-fitting but comfortable." },
          { q: "Are the pads removable?", a: "Yes! All our cami tops come with moulded removable pads for your comfort." },
          { q: "Are Snuggle sets true to size?", a: "Yes. If you’re between sizes, we recommend choosing the bigger size for a relaxed fit." },
          { q: "Can I wash the pads?", a: "Remove pads before washing the garment. Hand wash pads gently and air dry." },
          { q: "Why small batches?", a: "Snuggle is crafted intentionally to ensure quality and minimize waste." }
        ].map((faq, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-medium text-lg">{faq.q}</h3>
            <p className="text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </section>

      <div className="text-center pt-12">
        <Link to="/" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-muted-foreground transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Policy;
