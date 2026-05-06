'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Catering', href: '/catering' },
  { label: 'Founder', href: '/founder' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="relative group font-sans text-sm text-cream-200 hover:text-cream transition-colors duration-200"
    >
      {label}
      {/* Gold underline that draws left-to-right on hover */}
      <motion.span
        className="absolute left-0 -bottom-0.5 h-px bg-gold origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        style={{ width: '100%' }}
      />
    </a>
  );
}

export function Header() {
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300',
          scrolled
            ? 'bg-ink/95 backdrop-blur-sm border-b border-gold-700/60'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          {/* Wordmark */}
          <a href="/" className="font-display italic text-cream text-2xl leading-none z-10">
            TastexxSee
          </a>

          {/* Desktop nav — center */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button
              onClick={cart.open}
              aria-label={`Open cart${cart.itemCount > 0 ? `, ${cart.itemCount} items` : ''}`}
              className="relative flex items-center justify-center text-cream-200 hover:text-cream transition-colors duration-200"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-gold text-ink text-[10px] font-sans font-medium leading-none"
                >
                  {cart.itemCount}
                </motion.span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden flex items-center justify-center text-cream-200 hover:text-cream transition-colors duration-200 z-10"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen nav panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-ink flex flex-col pt-20"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-0 px-6 pt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display italic text-cream text-4xl py-4 border-b border-gold-700/30 hover:text-gold transition-colors duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
