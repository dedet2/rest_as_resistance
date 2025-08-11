'use client';
import React, { useMemo, useState, useEffect } from 'react';
import TimeBox from '../components/TimeBox';
import TrustCard from '../components/TrustCard';

export default function Page() {
  const deadline = useMemo(() => new Date('2025-09-01T06:59:59.000Z'), []);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const [activeDay, setActiveDay] = useState(1);
  const [selectedTier, setSelectedTier] = useState('Tier 1 – Essential Healing');
  const [upsells, setUpsells] = useState<string[]>([]);
  const PODIA_CHECKOUT_URL = process.env.NEXT_PUBLIC_PODIA_CHECKOUT_URL || '#';

  const tiers = [
    {
      name: 'Tier 1 – Essential Healing',
      price: 6500,
      tag: 'Everything you need for deep rest',
      bullets: [
        'Double occupancy accommodations (city hotels + ryokans)',
        'Daily breakfast + most dinners (kaiseki, chef dinners)',
        'All scheduled activities & entry fees',
        'All in‑country transport incl. luggage forwarding',
        'Daily quiet hour + onsen etiquette host',
      ],
      cta: 'Reserve Essential',
    },
    {
      name: 'Tier 2 – Private Indulgence',
      price: 8500,
      tag: 'Private baths + premium transfers',
      bullets: [
        'Everything in Essential',
        'Private onsen reservations (Beppu + Miyajima)',
        'Private intercity transfers + Green Car seats',
        'Deluxe/suite upgrades in Tokyo',
        'One 60‑min in‑room massage',
      ],
      highlight: true,
      cta: 'Reserve Indulgence',
    },
    {
      name: 'Tier 3 – Ultra Restoration (VIP)',
      price: 12000,
      tag: 'Solo occupancy + premium care (max 2)',
      bullets: [
        'Everything in Private Indulgence',
        'Solo occupancy throughout (best‑available rooms)',
        'Priority room selection at each property',
        'Pre‑trip 1:1 intention & accessibility consult with Dr. Dédé (45 min)',
        'VIP welcome set (onsen kit, travel altar, premium amenities)',
        'Reserved front‑row seating + private Q&A salon during workshops',
        'Post‑trip 60‑min integration session (virtual)',
      ],
      cta: 'Apply for VIP',
    },
  ];

  const valueStack = [
    { label: 'Tokyo & Ryokan Lodging (9 nights)', value: 4200 },
    { label: 'In‑Country Flights/Trains/Ferries', value: 1200 },
    { label: 'Private Onsen & Spa Sessions', value: 1400 },
    { label: 'Chef Dinners & Kaiseki', value: 1600 },
    { label: 'Guides, Transfers & Luggage Forwarding', value: 1200 },
    { label: 'Cultural Care & Onsen Kit', value: 500 },
  ];

  const upsellOptions = [
    { name: 'Private Tea Ceremony (Kyoto stopover)', price: 450 },
    { name: 'Kimono Dressing & Photoshoot', price: 300 },
    { name: 'Hair & Scalp Spa (textured hair friendly)', price: 250 },
    { name: 'Private Guide – Tokyo Shopping Day', price: 400 },
    { name: 'Premium Sake Pairing Dinner', price: 250 },
    { name: 'Extra Night in Tokyo (post‑trip)', price: 600 },
    { name: 'Airport VIP Fast‑Track Service', price: 150 },
  ];

  const itinerary = [
    { day: 1, title: 'Arrive Tokyo (Evening)', details: 'Private airport pickup, hotel check‑in, gentle meal, guided wind‑down.', stay: 'Tokyo – boutique luxury (e.g., Hotel Niwa / Mesm)' },
    { day: 2, title: 'Tokyo Grounding + Intention Setting', details: 'Slow morning stretch, intention circle, optional sento introduction, chef welcome dinner.', stay: 'Tokyo' },
    { day: 3, title: 'Kamakura + Shichirigahama Onsen Sunset', details: 'JR to Kamakura, check‑in at Open House Sakura Sakura; sea‑view soak at Inamuragasaki Onsen.', stay: 'Open House Sakura Sakura (Kamakura)' },
    { day: 4, title: 'Kamakura Forest Bathing', details: 'Shinrin‑yoku in the hills, journaling & art pause, private chef dinner at the house.', stay: 'Open House Sakura Sakura (Kamakura)' },
    { day: 5, title: 'Fly to Beppu (Kyushu)', details: 'Kamakura → Haneda → Oita flight; transfer to Beppu ryokan; kaiseki dinner & onsen.', stay: 'Beppu – luxury ryokan with private baths' },
    { day: 6, title: 'Beppu Deep Rest + Hells (Jigoku)', details: 'Private onsen blocks, gentle tour of Beppu’s geothermal wonders, onsen‑steamed snacks.', stay: 'Beppu' },
    { day: 7, title: 'Rail to Miyajima (Iwaso)', details: 'Ltd. Express → Shinkansen to Hiroshima → JR + ferry to Miyajima; check‑in at Iwaso.', stay: 'Iwaso Ryokan (Miyajima)' },
    { day: 8, title: 'Miyajima Stillness', details: 'Itsukushima Shrine sunrise (as energy allows), optional aromatherapy, calligraphy mini‑workshop.', stay: 'Iwaso Ryokan (Miyajima)' },
    { day: 9, title: 'Return to Tokyo + Closing Circle', details: 'Ferry → JR → Shinkansen to Tokyo; closing dinner and gratitude circle.', stay: 'Tokyo' },
    { day: 10, title: 'Depart for U.S.', details: 'Private airport transfers, optional escort service.', stay: '—' },
  ];

  const includedEveryTier = [
    'All scheduled activities & entry fees',
    'All in‑country transportation (flights, trains, ferries, taxis as needed)',
    'Luggage forwarding between cities',
    'Daily quiet hour + opt‑out culture',
    'Cultural care guide + onsen kit',
    'Chef‑curated welcome & farewell dinners',
    'Two guided workshops on wellness & rest as Black women (led by Dr. Dédé + guest)',
  ];

  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier: selectedTier, upsells }),
      });
      if (!res.ok) throw new Error('Network');
      alert('Thanks! We received your inquiry and will email you shortly.');
    } catch {
      window.location.href = `mailto:${process.env.EMAIL_CONTACT || 'info@incluu.us'}?subject=${encodeURIComponent('RAR Japan Inquiry — ' + selectedTier)}&body=${encodeURIComponent('Name: ' + form.name + '\nEmail: ' + form.email + '\nPhone: ' + form.phone + '\nUpsells: ' + (upsells.join(', ') || 'None') + '\nNotes: ' + form.notes)}`;
    }
  }

  const totalValue = valueStack.reduce((s, v) => s + v.value, 0);

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-500" />
            <span className="font-semibold tracking-wide">Rest as Resistance — Japan 2025</span>
          </div>
          <a href="#reserve" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition">Reserve Your Spot</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <img src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?q=80&w=1600&auto=format&fit=crop" alt="Misty forest" className="h-full w-full object-cover opacity-30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-xs text-white/70 mb-3">Dec 8–17, 2025 • Tokyo • Kamakura • Beppu • Miyajima</p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1]">Rest as Resistance<span className="block text-white/80">A Luxury Healing Journey in Japan</span></h1>
            <p className="mt-6 text-lg text-white/80">For Black women reclaiming rest as a right. Slow mornings, onsen rituals, forest bathing, and ryokan care—crafted for deep restoration, community, and liberation.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#tiers" className="rounded-2xl px-6 py-3 bg-white text-black font-semibold hover:bg-white/90 transition">Explore Tiers</a>
              <a href="#itinerary" className="rounded-2xl px-6 py-3 border border-white/30 hover:bg-white/10 transition">See the Itinerary</a>
            </div>
            <div className="mt-6 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 mr-6"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />Only 6 spots available</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-fuchsia-400" />White‑glove concierge</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Booking closes Aug 31</h2>
            <p className="text-white/70 mt-2">Secure your spot now. A deposit holds your tier; balance can be split on a payment schedule.</p>
            <div className="mt-6 flex gap-4 text-center">
              <TimeBox label="Days" value={timeLeft.days} />
              <TimeBox label="Hours" value={timeLeft.hours} />
              <TimeBox label="Minutes" value={timeLeft.minutes} />
              <TimeBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TrustCard title="Secure Payments" desc="Stripe via Podia" />
            <TrustCard title="Fair, Clear Terms" desc="Simple refund policy" />
            <TrustCard title="Cultural Care" desc="Hair, skin, and consent aware" />
            <TrustCard title="Accessibility" desc="Pain‑aware routing & pace" />
          </div>
        </div>
      </section>

      <section className="py-16" id="value">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold mb-6">$11,100 Total Value — Your Price from $6,500</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {valueStack.map((v, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/10 bg-white/5">
                <div className="text-white/80">{v.label}</div>
                <div className="mt-2 text-2xl font-semibold">${v.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <p className="text-white/70 mt-6">Transparent pricing. Strategic launch rates held while we finalize vendor confirmations.</p>
        </div>
      </section>

      <section id="tiers" className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <h2 className="text-3xl font-semibold">Choose Your Tier</h2>
            <p className="text-white/70">6 paying guests + host & partner • Dec 8–17, 2025</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div key={t.name} className={"rounded-3xl border bg-white/5 p-6 transition " + (t.highlight ? "border-fuchsia-400 shadow-[0_0_0_2px_rgba(232,121,249,0.4)]" : "border-white/10 hover:bg-white/10")}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <span className="text-sm text-white/70">{t.tag}</span>
                </div>
                <div className="mt-4 text-4xl font-bold tracking-tight">
                  ${t.price.toLocaleString()} <span className="text-base font-medium text-white/60">pp</span>
                </div>
                <ul className="mt-4 space-y-2 text-white/85">
                  {t.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setSelectedTier(t.name)} className="mt-6 w-full rounded-xl bg-white text-black font-semibold py-3 hover:bg-white/90">{t.cta}</button>
                <p className="mt-3 text-sm text-white/70">Selected: {selectedTier === t.name ? "✓" : "Set this tier above"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold mb-6">Curated Enhancements (Optional)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upsellOptions.map((u) => (
            <label key={u.name} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 cursor-pointer hover:bg-white/10">
              <input type="checkbox" checked={upsells.includes(u.name)} onChange={() => setUpsells(curr => curr.includes(u.name) ? curr.filter(x => x !== u.name) : [...curr, u.name])} className="mt-1 h-4 w-4 rounded border-white/20 bg-black" />
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-white/70">${u.price} per person</div>
              </div>
            </label>
          ))}
        </div>
        <p className="text-white/70 mt-4">We’ll confirm availability and add to your invoice post‑deposit.</p>
      </div>
    </section>

      <section id="itinerary" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold mb-6">Itinerary — Dec 8–17, 2025</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 divide-y divide-white/10">
                {itinerary.map((d) => (
                  <button key={d.day} onClick={() => setActiveDay(d.day)} className={"w-full text-left px-4 py-3 rounded-xl transition " + (activeDay === d.day ? "bg-white/15" : "hover:bg-white/10")}>
                    <div className="text-sm text-white/70">Day {d.day}</div>
                    <div className="font-semibold">{d.title}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              {itinerary.filter((d) => d.day === activeDay).map((d) => (
                <div key={d.day} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm text-white/70 mb-1">Day {d.day}</div>
                  <h3 className="text-2xl font-semibold">{d.title}</h3>
                  <p className="mt-3 text-white/85">{d.details}</p>
                  <div className="mt-4 text-white/70">Stay: {d.stay}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-white/70 text-sm">© {new Date().getFullYear()} Rest as Resistance • A Dr. Dédé Healing Journey</p>
        </div>
      </section>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left px-5 py-4 flex items-center justify-between">
        <span className="font-semibold">{q}</span>
        <span className="text-white/50">{open ? '–' : '+'}</span>
      </button>
      {open && <div className="px-5 pb-5 text-white/80">{a}</div>}
    </div>
  );
}

function getTimeLeft(d: Date) {
  const total = Math.max(0, d.getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}
