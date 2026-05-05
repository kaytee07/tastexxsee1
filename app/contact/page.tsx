import type { Metadata } from 'next';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — TasteXXSee',
  description:
    'Find TasteXXSee in Ghana. Address, phone, opening hours, and a contact form.',
};

const HOURS = [
  { days: 'Every Day', hours: '12:00 PM – 11:59 PM' },
];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="pt-40 pb-16 px-6 md:px-12 lg:px-20 bg-ink">
        <div className="max-w-[1280px] mx-auto">
          <Eyebrow>Get in Touch</Eyebrow>
          <h1
            className="font-display text-cream mt-3 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Find <em className="italic text-gold">us.</em>
          </h1>
        </div>
      </section>

      {/* Split layout */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-ink">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: info */}
          <div className="flex flex-col gap-10">
            {/* Address */}
            <div>
              <Eyebrow>Address</Eyebrow>
              <a
                href="https://maps.app.goo.gl/vhX2VudDfq8gfuJP6"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-cream-200 mt-3 leading-relaxed hover:text-gold transition-colors block"
              >
                Broadcasting Road, Mile 11<br />
                Accra, Ghana
              </a>
            </div>

            <Divider />

            {/* Phone & Email */}
            <div className="flex flex-col gap-4">
              <div>
                <Eyebrow>Phone</Eyebrow>
                <a
                  href="tel:+233593086978"
                  className="font-sans text-cream hover:text-gold transition-colors mt-2 block"
                >
                  +233 59 308 6978
                </a>
              </div>
              <div>
                <Eyebrow>Email</Eyebrow>
                <a
                  href="mailto:tastexseegh@gmail.com"
                  className="font-sans text-cream hover:text-gold transition-colors mt-2 block"
                >
                  tastexseegh@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Eyebrow>Follow Us</Eyebrow>
              <a
                href="https://www.instagram.com/tastexxsee"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-cream hover:text-gold transition-colors"
              >
                Instagram — @tastexxsee
              </a>
              <a
                href="https://www.tiktok.com/@tastexxsee"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-cream hover:text-gold transition-colors"
              >
                TikTok — @tastexxsee
              </a>
            </div>

            <Divider />

            {/* Hours */}
            <div>
              <Eyebrow>Opening Hours</Eyebrow>
              <table className="mt-4 w-full font-sans text-sm text-cream-200">
                <tbody>
                  {HOURS.map(({ days, hours }) => (
                    <tr key={days} className="border-b border-ink-600">
                      <td className="py-2.5 pr-8">{days}</td>
                      <td className="py-2.5 text-cream">{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: map */}
          <div className="flex flex-col gap-4">
            <Eyebrow>Location</Eyebrow>
            <div className="relative w-full aspect-video border border-gold-700/60 overflow-hidden mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8!2d-0.2!3d5.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdfbd4766529599%3A0xc29409c850ae7a17!2sTaste+xx+See!5e0!3m2!1sen!2sgh!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.1) brightness(0.7)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TasteXXSee location map"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink-800" aria-labelledby="contact-form-heading">
        <div className="max-w-[720px] mx-auto">
          <Eyebrow>Send a Message</Eyebrow>
          <h2
            id="contact-form-heading"
            className="font-display text-cream mt-3 mb-10 leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            Drop us a <em className="italic text-gold">line.</em>
          </h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
