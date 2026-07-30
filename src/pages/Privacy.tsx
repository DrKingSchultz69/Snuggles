import { Link } from 'react-router';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto py-24 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl uppercase tracking-widest">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: 30 July 2026</p>
      </div>

      <section className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          This Privacy Policy explains how Snuggle ("we", "us", "our") collects, uses, and protects
          your personal information when you visit snuggle.co.in or make a purchase with us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Information We Collect</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>When you place an order or sign up for our newsletter, we collect:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your name, email address, and phone number</li>
            <li>Your shipping address (address line, city, state, pincode)</li>
            <li>Order details — items purchased, size, colour, and amount paid</li>
          </ul>
          <p>
            We do not collect or store your card, UPI, or bank details. Payments are handled
            entirely by our payment processor, Razorpay — see "Payments" below.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">How We Use Your Information</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <ul className="list-disc list-inside space-y-1">
            <li>To process and fulfil your order, including shipping it to the correct address</li>
            <li>To send you order confirmations and updates</li>
            <li>To send newsletter emails, only if you've subscribed</li>
            <li>To respond to customer care requests</li>
            <li>To improve our products and website</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Payments</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            All payments are processed securely by <strong>Razorpay</strong>. When you pay,
            your payment details are sent directly to Razorpay and are subject to their own
            privacy policy and security standards — we never see or store your full card,
            UPI, or bank account details.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Third-Party Services</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>We rely on a small number of trusted third parties to run our store:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Razorpay</strong> — payment processing</li>
            <li><strong>Shopify</strong> — our product catalogue and inventory</li>
            <li><strong>Resend</strong> — sending order and newsletter emails</li>
          </ul>
          <p>
            These providers only receive the information necessary to perform their specific
            function (e.g. Razorpay receives payment details to process your transaction) and
            are not permitted to use your data for their own purposes.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Cookies & Local Storage</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We use your browser's local storage to remember the contents of your shopping bag
            between visits. This data stays on your device and is not used for tracking or
            advertising.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Data Sharing</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We do not sell or rent your personal information to anyone. We only share your
            information with the third-party services listed above, as needed to fulfil your
            order, or where required by law.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Data Retention</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We retain order information for as long as needed for accounting, tax, and legal
            purposes. You can ask us to delete your personal information at any time, subject to
            these legal requirements.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Your Rights</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            You can ask us to access, correct, or delete the personal information we hold about
            you at any time by reaching out to us (see Contact below).
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Children's Privacy</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Snuggle is not directed at children under 18, and we do not knowingly collect
            personal information from them.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Changes to This Policy</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            We may update this policy from time to time. Changes will be posted on this page
            with an updated "Last updated" date.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl border-b border-black pb-2">Contact Us</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            For any privacy-related questions or requests, contact us at{' '}
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

export default Privacy;
