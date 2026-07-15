import { Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-8">
      <h1 className="text-3xl font-sans font-light uppercase tracking-widest">Socials</h1>
      <p className="text-muted-foreground leading-relaxed">
        Tag us
      </p>
      <a
        href="https://www.instagram.com/in_snuggle?igsh=ZnQ3b3M0bGoxMA=="
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-black px-8 py-3 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors duration-300"
      >
        <Instagram className="w-4 h-4" />
        Instagram
      </a>
    </div>
  );
};

export default Contact;
