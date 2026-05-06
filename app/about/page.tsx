import type { Metadata } from 'next';
import Image from 'next/image';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Divider } from '@/components/ui/Divider';

export const metadata: Metadata = {
  title: 'About — TastexxSee',
  description:
    'The story behind TastexxSee — Ghanaian comfort food meets Asian-influenced rice and noodles in one kitchen.',
};

const PILLARS = [
  {
    eyebrow: 'ROOTED IN GHANA',
    title: 'Local Plates',
    body: 'Banku, yam chips, goat stew — the dishes that Ghanaian households have passed down for generations. We serve them the way they were meant to be eaten: generous, unfussy, and full of the kind of flavour that only time and tradition can build. These are our anchor.', // TODO: replace with client copy
  },
  {
    eyebrow: 'BEYOND BORDERS',
    title: 'International Rice & Noodles',
    body: 'Thai fried rice, spicy jollof, assorted noodles — dishes that borrow from East Asian kitchens and pass through ours. The result is a menu that moves between continents without losing its sense of place. Global curiosity, served Ghanaian.', // TODO: replace with client copy
  },
  {
    eyebrow: 'YOUR TABLE, OUR KITCHEN',
    title: 'Catering',
    body: 'When the restaurant isn\'t enough, we come to you. From intimate dinner parties to large private events, our boutique catering service brings the TastexxSee kitchen to your home, your venue, your table. Two tiers: Private Chef Hire and Custom Diet Catering.', // TODO: replace with client copy
  },
];

const PHOTOS = [
  '/img/spicy_jollof_beef_and_chicken.png',
  '/img/thai_shrimp_friedrice.png',
  '/img/banku_with_tilapia.png',
  '/img/noodles_egg_sausage.png',
  '/img/yam_chips_goat.png',
  '/img/spicy_jollof_shrimp.png',
];

export default function AboutPage() {
  return (
    <>
      {/* Hero band */}
      <section className="relative flex items-end min-h-[55vh] overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/thai_firedrice_beef_chicken.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.4) 100%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-20 max-w-[1280px] mx-auto w-full">
          <Eyebrow>Our Story</Eyebrow>
          <h1
            className="font-display text-cream mt-3 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Three traditions,{' '}
            <em className="italic text-gold">one table.</em>
          </h1>
        </div>
      </section>

      {/* Origin */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink">
        <div className="max-w-[65ch] mx-auto">
          <Divider short />
          <p className="font-sans text-lg text-cream-200 leading-relaxed mt-8">
            {/* TODO: replace with client copy */}
            TastexxSee opened with one intention: to feed people well. Not with
            pretension, and not with compromise. The restaurant sits at the intersection
            of Ghanaian home cooking and the kind of Asian-influenced rice and noodle
            dishes that have quietly become a fixture on West African plates. We didn&apos;t
            invent the combination — we just made it the whole point.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink-800" aria-label="Menu pillars">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-600">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-ink-800 p-8 md:p-10 flex flex-col gap-4">
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h2 className="font-display text-cream text-2xl md:text-3xl">{p.title}</h2>
              <Divider short />
              <p className="font-sans text-cream-200 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-ink" aria-label="Photo gallery">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-px bg-ink-600">
          {PHOTOS.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-ink-800">
              <Image
                src={src}
                alt="TastexxSee food photography"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
