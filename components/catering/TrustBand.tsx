const TESTIMONIALS = [
  {
    quote:
      "They turned our anniversary dinner into something we'll talk about for years.",
    attribution: 'Ama K., Accra',
  },
  {
    quote:
      'Every dietary need was handled without a single compromise on flavour.',
    attribution: 'David O., East Legon',
  },
  {
    quote: 'Professional, punctual, and the food was extraordinary.',
    attribution: 'Nana A., Airport Residential',
  },
];

export function TrustBand() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink-800" aria-label="Testimonials">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-600">
        {TESTIMONIALS.map((t) => (
          <div key={t.attribution} className="bg-ink-800 p-8 md:p-10 flex flex-col gap-6">
            <blockquote
              className="font-display italic text-cream leading-snug"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <footer
              className="font-sans text-gold text-xs uppercase"
              style={{ letterSpacing: '0.4em' }}
            >
              {t.attribution}
            </footer>
          </div>
        ))}
      </div>
    </section>
  );
}
