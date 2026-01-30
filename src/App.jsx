import { useEffect, useRef, useState } from 'react';

const GOLD = '#BC9D37';
const GOLD_LIGHT = '#D4AF37';
const BORDER = '#31352b';
const BG_DARK = '#0A1628';
const BG_CARD = 'rgba(17, 37, 62, 0.65)';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'tournament', label: 'Tournament' },
  { id: 'players', label: 'Players' },
  { id: 'history', label: 'History' },
  { id: 'contact', label: 'Contact' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function useReveal() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, revealed];
}

function App() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '') || 'home';
      if (NAV.some((n) => n.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (NAV.some((n) => n.id === id)) setActive(id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const onNav = (id) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
    scrollToSection(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-rings opacity-50" />
        <header className="sticky top-0 z-50 border-b transition-smooth" style={{ backgroundColor: BG_DARK, borderColor: BORDER }}>
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 lg:px-8">
            <button type="button" onClick={() => onNav('home')} className="flex shrink-0 items-center gap-3 text-left transition-smooth hover:opacity-90">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-lg" style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}>
                🏸
              </div>
              <div>
                <div className="text-lg font-bold tracking-wide" style={{ color: GOLD_LIGHT }}>Shuttle Masters</div>
                <div className="-mt-0.5 text-[11px] font-medium tracking-[0.25em] text-white/90">CHAMPIONSHIP 2025</div>
              </div>
            </button>
            <nav className="flex items-center gap-8">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNav(item.id)}
                  className={`nav-link py-2 text-sm font-medium ${active === item.id ? 'active text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main>
          <section id="home">
            <HeroSection onNav={onNav} />
            <PlaceToGrowSection onNav={onNav} />
          </section>
          <section id="tournament">
            <TournamentAgendaSection onNav={onNav} />
            <PickYourTimeSection />
          </section>
          <BannerSection onNav={onNav} />
          <section id="players">
            <BuiltToImproveSection onNav={onNav} />
            <FeaturedPlayersSection />
          </section>
          <section id="history">
            <ArticleCornerSection />
            <HistoryTimelineSection />
          </section>
          <section id="contact">
            <ContactSection />
          </section>
          <PreFooterCTA onNav={onNav} />
        </main>

        <Footer onNav={onNav} />
      </div>
    </div>
  );
}

function HeroSection({ onNav }) {
  const [ref, revealed] = useReveal();
  const stagger = (i) => ({ transitionDelay: `${i * 80}ms` });
  return (
    <div className="relative flex min-h-[90vh] flex-col items-center justify-center bg-hero bg-cover bg-center px-6 py-20 lg:py-28">
      <div className="absolute inset-0 bg-rings opacity-35" />
      <div className="pointer-events-none absolute left-0 top-24 hidden lg:block" style={{ zIndex: 0 }}>
        <div className="animate-float-slow h-32 w-32 rounded-full border-2 opacity-25" style={{ borderColor: GOLD_LIGHT }} />
      </div>
      <div className="pointer-events-none absolute right-0 top-40 hidden lg:block" style={{ zIndex: 0 }}>
        <div className="animate-float-slow h-40 w-40 rounded-full border-2 opacity-20" style={{ borderColor: GOLD_LIGHT }} />
      </div>
      <div ref={ref} className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className={`hero-stagger inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white ${revealed ? 'hero-reveal' : ''}`} style={{ backgroundColor: GOLD_LIGHT, ...stagger(0) }}>
          <span className="text-base" aria-hidden>🏸</span>
          World&apos;s Premier Badminton Event
        </div>
        <div className={`hero-stagger mt-8 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 ${revealed ? 'hero-reveal' : ''}`} style={stagger(1)}>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl hero-glow" style={{ color: GOLD_LIGHT }}>
            Shuttle Masters
          </h1>
          <span className="text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: GOLD_LIGHT }}>·</span>
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Championship
          </h2>
        </div>
        <p className={`hero-stagger mt-4 text-lg text-white/90 ${revealed ? 'hero-reveal' : ''}`} style={stagger(2)}>August 15-22, 2025</p>
        <p className={`hero-stagger mt-2 flex items-center justify-center gap-2 text-base text-white/90 ${revealed ? 'hero-reveal' : ''}`} style={stagger(2)}>
          <span aria-hidden>🏟️</span>
          Royal Badminton Arena, Singapore
        </p>
        <div className={`hero-stagger mt-10 flex flex-wrap items-center justify-center gap-4 ${revealed ? 'hero-reveal' : ''}`} style={stagger(3)}>
          <button
            type="button"
            onClick={() => onNav('tournament')}
            className="btn-gold hero-cta rounded-lg px-7 py-3.5 text-sm font-semibold transition-smooth"
            style={{ backgroundColor: GOLD_LIGHT, color: BG_DARK }}
          >
            View Tournament Details
          </button>
          <button
            type="button"
            onClick={() => onNav('players')}
            className="btn-outline-gold hero-cta rounded-lg border-2 px-7 py-3.5 text-sm font-semibold transition-smooth"
            style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}
          >
            Meet The Players
          </button>
        </div>
        <div className={`hero-stagger mt-14 grid w-full max-w-3xl grid-cols-4 gap-8 ${revealed ? 'hero-reveal' : ''}`} style={stagger(4)}>
          <div className="hero-stat flex flex-col items-center">
            <span className="text-3xl font-bold text-white sm:text-4xl">64</span>
            <span className="mt-1 text-sm font-medium text-white/90">World Players</span>
          </div>
          <div className="hero-stat flex flex-col items-center">
            <span className="text-3xl font-bold text-white sm:text-4xl">$2M</span>
            <span className="mt-1 text-sm font-medium text-white/90">Prize Pool</span>
          </div>
          <div className="hero-stat flex flex-col items-center">
            <span className="text-3xl font-bold text-white sm:text-4xl">8</span>
            <span className="mt-1 text-sm font-medium text-white/90">Days of Action</span>
          </div>
          <div className="hero-stat flex flex-col items-center">
            <span className="text-3xl font-bold text-white sm:text-4xl">32</span>
            <span className="mt-1 text-sm font-medium text-white/90">Countries</span>
          </div>
        </div>
        <div className={`hero-stagger mt-12 flex justify-center ${revealed ? 'hero-reveal' : ''}`} style={stagger(5)}>
          <span className="animate-bounce-soft inline-block text-white/70" aria-hidden>↓</span>
        </div>
      </div>
    </div>
  );
}

const WHY_CARDS = [
  { icon: 'check', title: 'World-Class Athletes', body: 'Watch the top 64 ranked players compete for glory and the championship title.', img: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80' },
  { icon: 'vip', title: 'Premium Experience', body: 'VIP lounges, meet & greet sessions, and exclusive behind-the-scenes access.', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80' },
  { icon: 'heritage', title: 'Rich Heritage', body: 'Celebrating 25 years of excellence in international badminton competition.', img: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80' },
];

function PlaceToGrowSection({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="excellence-bg relative py-20 lg:py-28">
      <div className="excellence-backdrop absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`excellence-content text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Why Attend</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">Experience Excellence</h2>
          <p className="mt-4 text-slate-600">Shuttle Masters Championship 2025 — August 15-22, Singapore</p>
          <button type="button" onClick={() => onNav('tournament')} className="btn-gold mt-6 rounded-lg px-6 py-2.5 text-sm font-semibold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>View All</button>
        </div>
        <div className={`mt-12 grid gap-8 sm:grid-cols-3 stagger-children ${revealed ? 'revealed' : ''}`}>
          {WHY_CARDS.map((card) => (
            <WhyCard key={card.title} iconType={card.icon} title={card.title} body={card.body} img={card.img} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WhyCard({ iconType, title, body, img }) {
  const icons = {
    check: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    vip: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 12h2M15 12h2M11 10v4" strokeWidth="1.5" />
      </svg>
    ),
    heritage: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  };
  return (
    <div className="excellence-card group relative aspect-[4/4.2] overflow-hidden rounded-2xl border border-slate-300/50 shadow-xl">
      <img src={img} alt="" className="excellence-card-img absolute inset-0 h-full w-full object-cover" />
      <div className="excellence-card-overlay absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="excellence-card-icon z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-400/40" style={{ backgroundColor: GOLD_LIGHT, color: '#0f172a' }}>
          {icons[iconType] || icons.check}
        </div>
        <h3 className="excellence-card-title font-serif text-xl font-bold text-white">{title}</h3>
        <p className="excellence-card-desc mt-2 text-sm leading-relaxed text-white/90">{body}</p>
      </div>
    </div>
  );
}

const TOURNAMENT_ROUNDS = [
  { code: 'R1', title: 'Round of 64', date: 'Aug 15-16', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Opening rounds featuring all 64 players across 8 courts', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80' },
  { code: 'R2', title: 'Round of 32', date: 'Aug 17-18', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Intense matches as the competition heats up', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80' },
  { code: 'QF', title: 'Quarter Finals', date: 'Aug 19-20', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Top 8 players battle for semi-final spots', img: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80' },
  { code: 'SF', title: 'Semi Finals', date: 'Aug 21', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Four elite players compete for the finals', img: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80' },
];

function TournamentAgendaSection({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="section-light py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Tournament Details</p>
          <h2 className="text-3xl font-bold text-slate-900 lg:text-6xl">The Competition</h2>
          <p className="mt-4 text-slate-600">Shuttle Masters Championship — August 15-22, 2025</p>
        </div>
        <div className={`mt-12 grid gap-6 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {TOURNAMENT_ROUNDS.map((ev) => (
            <div key={ev.code} className="agenda-card card-hover shimmer-hover flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:flex-row">
              <div className="agenda-card-content flex flex-1 flex-col justify-between p-8 md:p-10">
                <div>
                  <span className="inline-block rounded-lg px-3 py-1.5 text-xs font-bold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>{ev.code}</span>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">{ev.title}</h3>
                  <p className="mt-2 text-slate-600">{ev.desc}</p>
                  <p className="mt-4 text-sm font-medium text-slate-700">{ev.date} · {ev.time}</p>
                  <p className="text-sm text-slate-600">{ev.location}</p>
                </div>
                <button type="button" onClick={() => onNav('tournament')} className="btn-outline-gold mt-6 w-fit rounded-lg border-2 px-5 py-2.5 text-sm font-semibold shimmer-hover" style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}>View Schedule</button>
              </div>
              <div className="agenda-card-img relative h-64 w-full overflow-hidden md:h-auto md:w-[45%]">
                <img src={ev.img} alt="" className="img-zoom h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
        <div className={`relative mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <div className="relative min-h-[200px] bg-slate-900 md:min-h-[240px]">
            <img
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center md:p-12"
              style={{ background: 'linear-gradient(to bottom, rgba(10, 22, 40, 0.75) 0%, rgba(10, 22, 40, 0.85) 50%, rgba(10, 22, 40, 0.9) 100%)' }}
            >
              <span className="inline-block rounded-full px-5 py-2 text-xs font-bold tracking-wide text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>GRAND FINALE</span>
              <h3 className="mt-6 font-serif text-3xl font-bold text-white md:text-4xl">Championship Finals</h3>
              <p className="mt-3 text-lg font-semibold" style={{ color: GOLD_LIGHT }}>August 22, 2025 · 7:00 PM SGT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerSection({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="relative overflow-hidden bg-stripes py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={`${revealed ? 'reveal-left revealed' : 'reveal-left'}`}>
            <h2 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
              Join our badminton community and grow together with players and have fun on court every week
            </h2>
            <p className="mt-4 text-white/80">Shuttle Masters Championship — August 15-22, 2025 · Royal Badminton Arena, Singapore</p>
            <button type="button" onClick={() => onNav('tournament')} className="btn-gold shimmer-hover mt-8 rounded-lg px-8 py-3.5 text-base font-semibold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>View Tournament</button>
          </div>
          <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${revealed ? 'reveal-right revealed' : 'reveal-right'}`}>
            <img src="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&q=80" alt="" className="img-zoom h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SCHEDULE_CARDS = [
  {
    titleLine1: 'Regular',
    titleLine2: 'Training',
    days: 'Friday & Saturday',
    time: '07.00 PM - 09.00 PM',
    venue: 'Royal Badminton Arena, Singapore',
    img: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=700&q=80',
    overlay: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(15, 23, 42, 0.4) 100%)',
  },
  {
    titleLine1: 'Advanced',
    titleLine2: 'Training',
    days: 'Saturday & Sunday',
    time: '08.00 PM - 11.00 PM',
    venue: 'Royal Badminton Arena, Singapore',
    img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=700&q=80',
    overlay: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.45) 100%)',
  },
];

function IconScheduleCalendar() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconScheduleClock() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconSchedulePin() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function PickYourTimeSection() {
  const [ref, revealed] = useReveal();
  return (
    <div
      className="relative py-20 lg:py-28"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: 'url(https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=60)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/85" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`text-left ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="text-sm font-medium uppercase tracking-widest text-white/55">Weekly Schedule</p>
          <h2 className="mt-2 text-3xl font-bold text-white lg:text-4xl">Pick Your Perfect Time</h2>
        </div>
        <div className={`mt-12 grid gap-8 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {SCHEDULE_CARDS.map((card) => (
            <div
              key={card.titleLine1 + card.titleLine2}
              className="schedule-card card-hover group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 md:flex-row"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
            >
              <div
                className="flex flex-1 flex-col justify-between p-8 md:p-10"
                style={{ backgroundColor: '#0f172a' }}
              >
                <div>
                  <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                    <span className="block">{card.titleLine1}</span>
                    <span className="block">{card.titleLine2}</span>
                  </h3>
                  <ul className="mt-6 space-y-4 text-sm font-medium text-white/95">
                    <li className="flex items-center gap-3">
                      <span className="text-white/90"><IconScheduleCalendar /></span>
                      {card.days}
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white/90"><IconScheduleClock /></span>
                      {card.time}
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-white/90"><IconSchedulePin /></span>
                      {card.venue}
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="schedule-btn group mt-8 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ color: GOLD }}
                >
                  Join training
                  <IconArrowRight />
                </button>
              </div>
              <div className="relative h-64 w-full overflow-hidden md:h-auto md:min-h-[300px] md:w-[48%]">
                <img
                  src={card.img}
                  alt=""
                  className="img-zoom absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: card.overlay }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuiltToImproveSection({ onNav }) {
  const [ref, revealed] = useReveal();
  const features = [
    { icon: '🏆', title: 'World-Class Athletes', body: 'Top 64 ranked players compete for the championship title.' },
    { icon: '⭐', title: 'Premium Experience', body: 'VIP lounges, meet & greet sessions, and exclusive access.' },
    { icon: '📜', title: 'Rich Heritage', body: 'Celebrating 25 years of international badminton excellence.' },
  ];
  return (
    <div className="section-light py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-center text-3xl font-bold text-slate-900 lg:text-4xl">Built to Help You Improve</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Experience excellence at Shuttle Masters Championship 2025</p>
        </div>
        <div className={`mt-12 grid gap-6 lg:grid-cols-4 stagger-children ${revealed ? 'revealed' : ''}`}>
          {features.map((f) => (
            <div key={f.title} className="card-hover shimmer-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-smooth">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
          <a href="#players" className="card-hover shimmer-hover group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-smooth" onClick={(e) => { e.preventDefault(); onNav('players'); }}>
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
              <img src="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400&q=80" alt="" className="img-zoom h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-semibold text-white">Meet The Players</p>
                <p className="mt-1 text-sm text-white/90">Elite athletes from 32 countries</p>
              </div>
            </div>
            <div className="flex flex-1 items-end p-6">
              <span className="text-sm font-semibold" style={{ color: GOLD }}>View Details</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function FeaturedPlayersSection() {
  const [ref, revealed] = useReveal();
  const players = [
    { seed: '#1 SEED', name: 'Viktor Axelsen', country: 'Denmark', flag: '🇩🇰', rank: '1', points: '124,358' },
    { seed: '#2 SEED', name: 'Kunlavut Vitidsarn', country: 'Thailand', flag: '🇹🇭', rank: '2', points: '108,290' },
    { seed: '#3 SEED', name: 'Anders Antonsen', country: 'Denmark', flag: '🇩🇰', rank: '3', points: '96,570' },
    { seed: '#4 SEED', name: 'Shi Yu Qi', country: 'China', flag: '🇨🇳', rank: '4', points: '89,440' },
  ];
  return (
    <div className="section-light py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Featured Players</h2>
          <p className="mt-4 text-slate-600">Elite athletes competing at Shuttle Masters Championship 2025</p>
        </div>
        <div className={`mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${revealed ? 'revealed' : ''}`}>
          {players.map((p) => (
            <div key={p.name} className="card-hover shimmer-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-smooth">
              <div className="relative h-40 bg-slate-800">
                <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>{p.seed}</span>
                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-700 text-2xl">{p.flag}</div>
              </div>
              <div className="p-5">
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="mt-1 text-sm text-slate-600">{p.flag} {p.country}</p>
                <p className="mt-3 text-xs text-slate-500">Rank {p.rank} · {p.points} pts</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[['🇩🇰', 'Denmark'], ['🇨🇳', 'China'], ['🇯🇵', 'Japan'], ['🇮🇩', 'Indonesia'], ['🇲🇾', 'Malaysia'], ['🇹🇭', 'Thailand'], ['🇮🇳', 'India'], ['🇰🇷', 'South Korea']].map(([flag, name]) => (
            <span key={name} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">{flag} {name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleCornerSection() {
  const [ref, revealed] = useReveal();
  const articles = [
    { title: 'Fastest Racket Sport', body: 'Shuttlecocks can travel over 400 km/h (249 mph), making badminton the fastest racket sport in the world.', img: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80' },
    { title: 'Feathered Shuttles', body: 'Professional shuttlecocks use 16 goose feathers and can be destroyed after just one rally.', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80' },
  ];
  return (
    <div className="section-light py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Did You Know?</h2>
          <p className="mt-4 text-slate-600">A journey through badminton excellence</p>
        </div>
        <div className={`mt-12 grid gap-8 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {articles.map((a) => (
            <div key={a.title} className="card-hover shimmer-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-smooth">
              <div className="aspect-video overflow-hidden">
                <img src={a.img} alt="" className="img-zoom h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryTimelineSection() {
  const [ref, revealed] = useReveal();
  const items = [
    { year: 'Ancient Origins', title: 'The Beginning', body: "Battledore and shuttlecock, badminton's ancestor, was played in ancient Greece, China, Japan, and India for over 2,000 years." },
    { year: '1870s', title: 'Birth of Modern Badminton', body: 'British army officers in India developed the modern rules. The game was named after Badminton House in Gloucestershire, England.' },
    { year: '1992', title: 'Olympic Debut', body: 'Badminton became an official Olympic sport at the Barcelona Games.' },
    { year: 'Today', title: 'Global Phenomenon', body: 'Over 220 million players worldwide, dominated by Asian nations in professional competition.' },
  ];
  return (
    <div className="section-light py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">History of Badminton</h2>
          <p className="mt-4 text-slate-600">A journey through centuries of racket sport excellence</p>
        </div>
        <div className="relative mt-14">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
          <div className="space-y-10">
            {items.map((item, i) => (
              <div key={item.year} className="grid grid-cols-[1fr_auto_1fr] items-start gap-6">
                <div className={i % 2 === 0 ? 'text-right' : ''}>
                  {i % 2 === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold" style={{ color: GOLD }}>{item.year}</p>
                      <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                    </div>
                  ) : null}
                </div>
                <div className="relative flex w-4 items-center justify-center">
                  <span className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white" style={{ borderColor: GOLD }} />
                </div>
                <div className={i % 2 === 1 ? 'text-left' : ''}>
                  {i % 2 === 1 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold" style={{ color: GOLD }}>{item.year}</p>
                      <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const [ref, revealed] = useReveal();
  return (
    <div className="section-dark py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-3xl font-bold text-white lg:text-4xl">Contact Us</h2>
          <p className="mt-4 text-white/70">Get in touch with the Shuttle Masters Championship team</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border p-8 transition-smooth" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <h3 className="font-serif text-xl font-semibold text-white">Tournament Office</h3>
            <div className="mt-6 space-y-5">
              <ContactRow icon={<IconPin />} label="Venue" lines={['Royal Badminton Arena', '1 Stadium Drive', 'Singapore 397629']} />
              <ContactRow icon={<IconMail />} label="Email" lines={['info@shuttlemasters.com', 'tickets@shuttlemasters.com']} />
              <ContactRow icon={<IconPhone />} label="Phone" lines={['+65 6123 4567', 'Mon-Fri: 9AM - 6PM SGT']} />
            </div>
            <div className="mt-8 flex gap-3">
              <SocialBtn ariaLabel="Twitter" icon={<IconTwitter />} />
              <SocialBtn ariaLabel="Instagram" icon={<IconInstagram />} />
              <SocialBtn ariaLabel="YouTube" icon={<IconYoutube />} />
              <SocialBtn ariaLabel="Facebook" icon={<IconFacebook />} />
            </div>
          </div>
          <div className="rounded-2xl border p-8 transition-smooth" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <h3 className="font-serif text-xl font-semibold text-white">Send a Message</h3>
            <form className="mt-6 space-y-4">
              <LabeledInput label="Full Name" placeholder="Your name" />
              <LabeledInput label="Email" placeholder="your@email.com" type="email" />
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Subject</label>
                <select className="h-12 w-full rounded-lg border bg-transparent px-4 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} defaultValue="General Inquiry">
                  <option className="bg-slate-900">General Inquiry</option>
                  <option className="bg-slate-900">Ticket Information</option>
                  <option className="bg-slate-900">Media &amp; Press</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Message</label>
                <textarea rows={4} className="w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} placeholder="How can we help?" />
              </div>
              <button type="button" className="btn-gold h-12 w-full rounded-lg font-semibold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, lines }) {
  return (
    <div className="flex gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: 'rgba(12,27,49,0.8)' }}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-white/85">{label}</p>
        <div className="mt-1 text-sm text-white/60">{lines.join(' · ')}</div>
      </div>
    </div>
  );
}

function SocialBtn({ ariaLabel, icon }) {
  return (
    <button type="button" aria-label={ariaLabel} className="grid h-10 w-10 place-items-center rounded-lg transition-smooth hover:opacity-80" style={{ backgroundColor: 'rgba(12,27,49,0.8)' }}>{icon}</button>
  );
}

function LabeledInput({ label, placeholder, type }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">{label}</label>
      <input type={type} className="h-12 w-full rounded-lg border bg-transparent px-4 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} placeholder={placeholder} />
    </div>
  );
}

function IconBase({ children }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

function IconPin() { return <IconBase><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></IconBase>; }
function IconMail() { return <IconBase><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></IconBase>; }
function IconPhone() { return <IconBase><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.3 12.3 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.3 12.3 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></IconBase>; }
function IconTwitter() { return <IconBase><path d="M18 2 2 18" /><path d="M2 2l16 16" /></IconBase>; }
function IconInstagram() { return <IconBase><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M16 11.37a4 4 0 1 1-2.94-2.94" /><path d="M17.5 6.5h.01" /></IconBase>; }
function IconYoutube() { return <IconBase><path d="M22 12s0-4-1-5-5-1-9-1-8 0-9 1-1 5-1 5 0 4 1 5 5 1 9 1 8 0 9-1 1-5 1-5Z" /><path d="M10 15V9l5 3-5 3Z" /></IconBase>; }
function IconFacebook() { return <IconBase><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" /></IconBase>; }

function PreFooterCTA({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="relative overflow-hidden bg-stripes py-20 lg:py-28">
      <div ref={ref} className={`relative z-10 text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
        <h2 className="text-3xl font-bold text-white lg:text-4xl">Join Our Club and Play With Us</h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/85">Shuttle Masters Championship 2025 — August 15-22 · Royal Badminton Arena, Singapore</p>
        <button type="button" onClick={() => onNav('tournament')} className="btn-gold mt-10 rounded-lg px-10 py-3.5 text-base font-semibold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>Get Started</button>
      </div>
    </div>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="section-light border-t border-slate-200">
      <div className="mx-auto max-w-[1320px] px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <button type="button" onClick={() => onNav('home')} className="flex items-center gap-2 text-left transition-smooth hover:opacity-90">
              <span className="text-2xl">🏸</span>
              <span className="text-lg font-bold tracking-tight text-slate-900">Shuttle Masters</span>
            </button>
            <p className="mt-4 text-sm text-slate-600">© 2025 Shuttle Masters. All rights reserved.</p>
            <div className="mt-4 flex gap-3 text-slate-500">
              <button type="button" aria-label="Facebook" className="transition-smooth hover:text-slate-700">f</button>
              <button type="button" aria-label="Instagram" className="transition-smooth hover:text-slate-700">ig</button>
              <button type="button" aria-label="Twitter" className="transition-smooth hover:text-slate-700">tw</button>
              <button type="button" aria-label="YouTube" className="transition-smooth hover:text-slate-700">yt</button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Menu</p>
            <div className="mt-3 flex flex-col gap-2">
              {NAV.map((item) => (
                <button key={item.id} type="button" onClick={() => onNav(item.id)} className="text-left text-sm text-slate-600 transition-smooth hover:text-slate-900">{item.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Find Us</p>
            <p className="mt-3 text-sm text-slate-600">Royal Badminton Arena<br />1 Stadium Drive<br />Singapore 397629</p>
            <p className="mt-2 text-sm text-slate-600">+65 6123 4567</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-6 px-6 py-4 text-xs text-slate-500 lg:px-8">
          <button type="button" className="hover:text-slate-700">Terms &amp; Support</button>
          <button type="button" className="hover:text-slate-700">Privacy Policy</button>
          <span className="ml-auto">Designed with Canva</span>
        </div>
      </div>
    </footer>
  );
}

export default App;
