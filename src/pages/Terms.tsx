import { Link } from 'react-router';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto py-24 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl uppercase tracking-widest">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: 30 July 2026</p>
      </div>

      <section className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          These Terms of Service ("Terms") govern your use of snuggle.co.in and any purchase you
          make from us. By using our website or placing an order, you agree to these Terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Products & Pricing</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated
            otherwise. Our pieces are made in limited batches, so availability of a size or
            colour is not guaranteed and may sell out at any time. We reserve the right to
            correct pricing errors and to limit order quantities.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Orders & Payment</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All payments are processed securely through <strong>Razorpay</strong>. An order is
            only confirmed once payment has been successfully verified. You agree to provide
            accurate and complete contact and shipping information at checkout — we are not
            responsible for delayed or failed deliveries caused by incorrect address details.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Shipping, Returns & Replacements</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Full details on dispatch timelines, delivery charges, our return policy, and how
            replacements are handled are available on our{' '}
            <Link to="/policy" className="underline hover:text-black transition-colors">
              Policy & Care
            </Link>{' '}
            page, which forms part of these Terms.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Intellectual Property</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All content on this site — including our name, logo, product photography, and
            descriptions — belongs to Snuggle and may not be copied, reproduced, or used without
            our written permission.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Acceptable Use</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            You agree not to misuse our website — including attempting to interfere with its
            normal operation, submitting fraudulent orders, or using it for any unlawful purpose.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Limitation of Liability</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            To the extent permitted by law, Snuggle is not liable for any indirect, incidental,
            or consequential damages arising from your use of this site or our products. Our
            total liability for any claim is limited to the amount you paid for the relevant
            order.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Governing Law</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            These Terms are governed by the laws of India, and any disputes will be subject to
            the exclusive jurisdiction of the courts in <strong>Chennai, India</strong>.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Changes to These Terms</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We may update these Terms from time to time. Continued use of the site after changes
            are posted means you accept the updated Terms.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Contact Us</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:support@snuggle.co.in" className="underline hover:text-black transition-colors">
              support@snuggle.co.in
            </a>.
          </p>
        </div>
      </section>

      <div className="text-center pt-12">
        <Link to="/" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-muted-foreground transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Terms;
