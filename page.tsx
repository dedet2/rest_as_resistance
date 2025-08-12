'use client';
import React, { useMemo, useState, useEffect } from 'react';
import TimeBox from '../components/TimeBox';
import TrustCard from '../components/TrustCard';

export default function Page() {
  const deadline = useMemo(() => new Date('2025-09-01T06:59:59.000Z'), []);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));
  useEffect(() => { const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000); return () => clearInterval(id); }, [deadline]);

  const tiers = [
    { name: 'Tier 1 – Essential', price: 7900, tag: 'Foundation of rest & care', highlight: false },
    { name: 'Tier 2 – Private Indulgence', price: 10500, tag: 'Privacy & premium comfort', highlight: true },
    { name: 'Tier 3 – VIP Sanctuary', price: 12900, tag: 'Top-tier access & ease', highlight: false },
  ] as const;

  // Updated value stack including $1k per workshop (x2)
  const valueStack = [
    { label: 'Luxury hotels & ryokans (9 nights)', value: 6000 },
    { label: 'Domestic transport & transfers', value: 1500 },
    { label: 'Guided experiences & entries', value: 1800 },
    { label: 'Dining (kaiseki & chef dinners)', value: 2200 },
    { label: 'Workshops (2 live sessions)', value: 2000 }, // updated
    { label: 'Gifts & cultural care kit', value: 500 },
  ];
  const TOTAL_VALUE = valueStack.reduce((s, v) => s + v.value, 0);

  // Add-ons (removed recordings add-on per your direction)
  const ADDONS = [
    { key: 't1_private_room', label: 'Private Room Upgrade (Essential)', price: 1200, appliesTo: 'Tier 1 – Essential' },
    { key: 't2_private_room', label: 'Private Room Upgrade (Private Indulgence)', price: 900, appliesTo: 'Tier 2 – Private Indulgence' },
    { key: 't3_culinary', label: 'Luxury Culinary Night (VIP)', price: 800, appliesTo: 'Tier 3 – VIP Sanctuary' },
    { key: 'post_trip_coaching', label: 'Post‑Trip Integration Coaching (3 sessions)', price: 600, appliesTo: 'all' },
    { key: 'airfare', label: 'Round‑Trip Airfare (estimate, price confirmed at booking)', price: 1800, appliesTo: 'all' },
  ] as const;

  const [selectedTier, setSelectedTier] = useState<typeof tiers[number]>(tiers[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const PODIA_CHECKOUT_URL = process.env.NEXT_PUBLIC_PODIA_CHECKOUT_URL || '#';

  function toggleAddOn(key: string) {
    setSelectedAddOns((curr) =>
      curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key]
    );
  }

  function addOnsForTier(tierName: string) {
    return ADDONS.filter(a => a.appliesTo === 'all' || a.appliesTo === tierName);
  }

  function addOnTotal(tierName: string) {
    return addOnsForTier(tierName).filter(a => selectedAddOns.includes(a.key)).reduce((s, a) => s + a.price, 0);
  }

  function savings(price: number) {
    return Math.max(0, TOTAL_VALUE - price);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier: selectedTier.name, addOns: selectedAddOns }),
      });
      if (!res.ok) throw new Error('Network');
      alert('Thanks! We received your inquiry and will email you shortly.');
    } catch {
      window.location.href = `mailto:${process.env.EMAIL_CONTACT || 'info@incluu.us'}?subject=${encodeURIComponent('RAR Japan Inquiry — ' + selectedTier.name)}&body=${encodeURIComponent('Name: ' + form.name + '\\nEmail: ' + form.email + '\\nPhone: ' + form.phone + '\\nAddOns: ' + selectedAddOns.join(', ') + '\\nNotes: ' + form.notes)}`;
    }
  }

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[#5B2A86] to-[#F1C376]" />
            <span className="font-semibold tracking-wide">Rest as Resistance — Japan 2025</span>
          </div>
          <a href="#reserve" className="btn-outline text-sm">Reserve Your Spot</a>
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
            <div className="mt-6 text-sm text-white/80 space-x-3">
              <span className="badge"><span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Only 6 client spots</span>
              <span className="badge"><span className="inline-block h-2 w-2 rounded-full bg-brand.gold" /> White‑glove concierge</span>
              <span className="badge"><span className="inline-block h-2 w-2 rounded-full bg-blue-400" /> Booking closes Aug 31</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold">Savings you can feel</h2>
            <p className="text-white/70 mt-2">Book as part of our curated group and access luxury experiences for less than building it alone.</p>
            <div className="mt-6 flex gap-4 text-center">
              <TimeBox label="Days" value={timeLeft.days} />
              <TimeBox label="Hours" value={timeLeft.hours} />
              <TimeBox label="Minutes" value={timeLeft.minutes} />
              <TimeBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TrustCard title="Secure Payments" desc="Stripe via Podia" />
            <TrustCard title="Cultural Care" desc="Hair, skin, and consent aware" />
            <TrustCard title="Exclusive Heritage Stay" desc="Full private use of Sakura‑Sakura (3 rooms) for our group" />
            <TrustCard title="Accessibility" desc="Pain‑aware routing & pace" />
          </div>
        </div>
      </section>

      {/* Limited Spots Section */}
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xl font-semibold">Limited to 8 total travelers (6 client spots)</div>
              <p className="text-white/80 text-sm">Sakura‑Sakura and Iwaso have very limited inventory in December. Once we’re full, we’re full.</p>
            </div>
            <div className="flex gap-3 min-w-[280px] w-full sm:w-auto">
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 text-center">
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-xs uppercase tracking-widest text-white/70">Days Left</div>
              </div>
              <a href="#reserve" className="btn-primary w-full sm:w-auto text-center">Claim Your Spot</a>
            </div>
          </div>
        </div>
      </section>

      <section id="tiers" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-8">
            <h2 className="text-3xl font-semibold">Choose Your Tier</h2>
            <p className="text-white/70">Dec 8–17, 2025 • 6 paying guests + 2 hosts</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div key={t.name} className={"rounded-3xl border bg-white/5 p-6 transition " + (t.highlight ? "border-brand.gold shadow-[0_0_0_2px_rgba(241,195,118,0.4)]" : "border-white/10 hover:bg-white/10")}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <span className="text-sm text-white/70">{t.tag}</span>
                </div>
                {t.highlight && <div className="badge mt-1">Most Popular</div>}
                <div className="mt-4 text-4xl font-bold tracking-tight">
                  ${t.price.toLocaleString()} <span className="text-base font-medium text-white/60">pp</span>
                </div>
                <div className="mt-2 text-sm text-white/80">Value: ${TOTAL_VALUE.toLocaleString()} • You Save ${Math.max(0, TOTAL_VALUE - t.price).toLocaleString()}</div>

                <div className="mt-5 space-y-2">
                  <div className="text-sm font-semibold">Enhance Your Experience</div>
                  {addOnsForTier(t.name).map(a => (
                    <label key={a.key} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10">
                      <input type="checkbox" checked={selectedAddOns.includes(a.key)} onChange={() => toggleAddOn(a.key)} className="mt-1 h-4 w-4 rounded border-white/20 bg-black" />
                      <div>
                        <div className="font-medium">{a.label}</div>
                        <div className="text-white/70 text-sm">+${a.price.toLocaleString()} per person</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button onClick={() => setSelectedTier(t)} className="mt-6 w-full btn-primary">Select {t.name.split(' – ')[1]}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="callout">
            <div className="font-semibold">Bring a Friend or Bring Your Daughter</div>
            <p className="text-white/80 text-sm mt-1">Traveling together deepens the joy of the journey. Book two spots and you’ll both receive a <span className="font-semibold">$300 credit</span> toward optional upgrades or excursions.</p>
          </div>
        </div>
      </section>

      <section id="reserve" className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold">Reserve Your Spot</h2>
            <p className="text-white/70 mt-2">Two Kamakura nights are at Sakura‑Sakura — an intimate heritage home with only three rooms reserved entirely for our group. All other nights follow your selected privacy level.</p>

            <div className="mt-6 grid lg:grid-cols-2 gap-8">
              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80">Selected Tier</label>
                  <select value={selectedTier.name} onChange={(e) => setSelectedTier(tiers.find(tt => tt.name === e.target.value) || tiers[0])} className="mt-1 w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand.gold">
                    {tiers.map(tt => (<option key={tt.name} value={tt.name}>{tt.name} — ${tt.price.toLocaleString()}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/80 mb-2">Add-Ons</label>
                  <div className="space-y-2">
                    {addOnsForTier(selectedTier.name).map(a => (
                      <label key={a.key} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10">
                        <input type="checkbox" checked={selectedAddOns.includes(a.key)} onChange={() => toggleAddOn(a.key)} className="mt-1 h-4 w-4 rounded border-white/20 bg-black" />
                        <div>
                          <div className="font-medium">{a.label}</div>
                          <div className="text-white/70 text-sm">+${a.price.toLocaleString()} per person</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Estimated Total</div>
                    <div className="text-2xl font-bold">${(selectedTier.price + addOnTotal(selectedTier.name)).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-white/60 mt-1">Airfare is estimated and finalized upon booking if selected.</div>
                </div>

                <div>
                  <label className="block text-sm text-white/80">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand.gold" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm text-white/80">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand.gold" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-white/80">Phone (optional)</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand.gold" placeholder="+1 (___) ___‑____" />
                </div>
                <div>
                  <label className="block text-sm text-white/80">Notes (dietary, mobility, requests)</label>
                  <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-xl bg-black/30 border border-white/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand.gold" placeholder="Tell us what you need so we can care for you." />
                </div>

                <button type="submit" className="w-full btn-primary">Send Inquiry</button>
                <a href={PODIA_CHECKOUT_URL} target="_blank" rel="noreferrer" className="block text-center rounded-2xl border border-brand.gold text-brand.gold px-4 py-3 font-semibold hover:bg-brand.gold/10 mt-2">Or Proceed to Secure Deposit (Podia)</a>
              </form>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 p-5">
                  <h3 className="font-semibold">What’s Included</h3>
                  <ul className="mt-2 text-white/80 text-sm list-disc ml-5 space-y-1">
                    <li>Luxury hotels & traditional ryokans (shared at Sakura‑Sakura)</li>
                    <li>All domestic transport & luggage forwarding</li>
                    <li>Onsen rituals in Shichirigahama & Beppu</li>
                    <li>Miyajima stay at Iwaso Ryokan</li>
                    <li>Daily quiet hour + opt‑out culture</li>
                    <li>Two live workshops on wellness & rest for Black women</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 p-5">
                  <h3 className="font-semibold">Early Booking Bonuses</h3>
                  <ul className="mt-2 text-white/80 text-sm list-disc ml-5 space-y-1">
                    <li>Complimentary 60‑min spa treatment in Beppu</li>
                    <li>$250 retreat credit toward upgrades (book by Aug 31)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-white/10 text-center text-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Rest as Resistance • A Dr. Dédé Healing Journey</p>
        </div>
      </footer>
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