import { Divider } from '@/components/ui/Divider';

export function Footer() {
  return (
    <footer className="bg-ink">
      <Divider />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Wordmark + tagline + address */}
          <div className="flex flex-col gap-4">
            <span className="font-display italic text-cream text-2xl leading-none">
              TasteXXSee
            </span>
            <p className="font-sans text-sm text-cream-200 leading-relaxed max-w-[240px]">
              Local roots. Global plates. Boutique catering for private events across Ghana.
            </p>
            <address className="not-italic font-sans text-xs text-cream-200/60 leading-relaxed">
              Broadcasting Road, Mile 11<br />
              Accra, Ghana
            </address>
          </div>

          {/* Column 2: Opening hours */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xs text-gold tracking-ultra uppercase font-medium">
              Opening Hours
            </span>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between font-sans text-sm text-cream-200">
                <span>Every Day</span>
                <span className="text-cream/60">12:00 PM – 11:59 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Social + copyright */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-xs text-gold tracking-ultra uppercase font-medium">
              Follow Us
            </span>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.instagram.com/tastexxsee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-cream-200 hover:text-gold transition-colors duration-200"
                >
                  Instagram — @tastexxsee
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@tastexxsee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-cream-200 hover:text-gold transition-colors duration-200"
                >
                  TikTok — @tastexxsee
                </a>
              </li>
            </ul>
            <p className="font-sans text-xs text-cream-200/40 mt-auto pt-6 md:pt-0">
              &copy; 2025 TasteXXSee. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
