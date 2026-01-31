import { useEffect, useRef, useState } from 'react';

// Midnight Gold Championship Palette
const GOLD = '#E6C35A';           // Championship Gold (Primary)
const GOLD_LIGHT = '#F2D46B';     // Championship Gold (Light)
const BORDER = '#1E3A5F';         // Border color
const BG_DARK = '#08162A';        // Midnight Navy (Primary)
const BG_SECONDARY = '#0B1C33';   // Midnight Navy (Secondary)
const BG_CARD = 'rgba(11, 28, 51, 0.75)';

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onNav = (id) => {
    setActive(id);
    setMobileMenuOpen(false);
    window.history.replaceState(null, '', `#${id}`);
    scrollToSection(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-rings opacity-50" />
        <header className="sticky top-0 z-50 border-b transition-smooth" style={{ backgroundColor: BG_DARK, borderColor: BORDER }}>
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <button type="button" onClick={() => onNav('home')} className="flex shrink-0 items-center gap-2 sm:gap-3 text-left transition-smooth hover:opacity-90">
              <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full border-2 text-xs sm:text-sm font-bold" style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}>
                SM
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold tracking-wide" style={{ color: GOLD_LIGHT }}>Shuttle Masters</div>
                <div className="-mt-0.5 text-[9px] sm:text-[11px] font-medium tracking-[0.25em] text-white/90">CHAMPIONSHIP 2025</div>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-smooth"
              style={{ borderColor: BORDER }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className={`w-5 h-5 text-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
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

          {/* Mobile Navigation */}
          <nav
            className={`lg:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
              }`}
            style={{ borderColor: mobileMenuOpen ? BORDER : 'transparent', backgroundColor: BG_DARK }}
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNav(item.id)}
                  className={`py-3 px-4 text-left text-sm font-medium rounded-lg transition-all duration-300 ${active === item.id ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                  style={{
                    ...(active === item.id ? { backgroundColor: 'rgba(230, 195, 90, 0.15)', color: GOLD_LIGHT } : {}),
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: mobileMenuOpen ? 1 : 0
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
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
    <div
      className="relative flex min-h-[100vh] sm:min-h-[90vh] flex-col items-center justify-center bg-cover bg-center px-4 sm:px-6 py-16 sm:py-20 lg:py-28"
      style={{
        backgroundImage: `url(${BADMINTON_IMAGES.shuttle8Verticle})`
      }}
    >
      {/* Desktop background - only visible on sm+ screens */}
      <div className="hidden sm:block absolute inset-0 bg-hero bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-950/70 sm:bg-slate-950/50" />
      <div className="absolute inset-0 bg-rings opacity-35" />
      <div className="pointer-events-none absolute left-0 top-24 hidden lg:block" style={{ zIndex: 0 }}>
        <div className="animate-float-slow h-32 w-32 rounded-full border-2 opacity-25" style={{ borderColor: GOLD_LIGHT }} />
      </div>
      <div className="pointer-events-none absolute right-0 top-40 hidden lg:block" style={{ zIndex: 0 }}>
        <div className="animate-float-slow h-40 w-40 rounded-full border-2 opacity-20" style={{ borderColor: GOLD_LIGHT }} />
      </div>
      <div ref={ref} className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className={`hero-stagger inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white ${revealed ? 'hero-reveal' : ''}`} style={{ backgroundColor: GOLD, ...stagger(0) }}>
          World&apos;s Premier Badminton Event
        </div>
        <div className={`hero-stagger mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center sm:items-baseline justify-center gap-x-2 gap-y-1 sm:gap-y-0 ${revealed ? 'hero-reveal' : ''}`} style={stagger(1)}>
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight hero-glow drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style={{ color: GOLD_LIGHT }}>
            Shuttle Masters
          </h1>
          <span className="hidden sm:inline text-4xl font-bold sm:text-5xl lg:text-6xl" style={{ color: GOLD_LIGHT }}>·</span>
          <h2 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Championship
          </h2>
        </div>
        <p className={`hero-stagger mt-4 text-lg text-white/90 ${revealed ? 'hero-reveal' : ''}`} style={stagger(2)}>August 15-22, 2025</p>
        <p className={`hero-stagger mt-2 flex items-center justify-center gap-2 text-base text-white/90 ${revealed ? 'hero-reveal' : ''}`} style={stagger(2)}>
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
          <span className="animate-bounce-soft inline-block text-3xl sm:text-4xl lg:text-5xl text-white/80" aria-hidden>↓</span>
        </div>
      </div>
    </div>
  );
}

const BADMINTON_IMAGES = {
  players: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  court: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  shuttlecock: 'https://images.unsplash.com/photo-1587280501635-68a0afa82c67?w=600&q=80',
  match: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80',
  arena: 'https://images.unsplash.com/photo-1519500528352-2d1460418d41?w=600&q=80',
  groundCourt1: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80',
  groundCourt2: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  groundCourt3: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=600&q=80',
  shuttlerTower: 'https://images.unsplash.com/photo-1614058585909-031fc6e4f0bb?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle2: 'https://images.unsplash.com/photo-1623998021722-b934f73081df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle3: 'https://images.unsplash.com/photo-1721760886638-01553f3d8aa9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle4: 'https://images.unsplash.com/photo-1564226803380-91139fdcb4d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle5: 'https://images.unsplash.com/photo-1625480859582-03ea1d0e88fe?q=80&w=1261&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle6Verticle: 'https://images.unsplash.com/photo-1722003183126-35f4f31ab5b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle7BG: 'https://images.unsplash.com/photo-1598019465428-5228050eaf7b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  shuttle8Verticle: 'https://images.unsplash.com/photo-1748323850985-80e5cd0a1b4e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  playerBlur: 'https://images.unsplash.com/photo-1761286753856-2f39b4413c1c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  player2Blur: 'https://images.unsplash.com/photo-1761286753703-570ed91dd90e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  player3: 'https://plus.unsplash.com/premium_photo-1664304753883-923c28de6b85?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  playersGroup: 'https://images.unsplash.com/photo-1723534862765-5760900d68d8?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  roundeImg: 'https://images.unsplash.com/photo-1723633236252-eb7badabb34c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  player4: 'https://images.unsplash.com/photo-1720515226352-b0b1dec6813b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  community: 'https://images.unsplash.com/photo-1757937603164-6ea2539075c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};
const USER_IMAGES = [
  'https://images.unsplash.com/photo-1626721105368-a69248e93b32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1721760886982-3c643f05813d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1687597778602-624a9438fe0b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1595220427358-8cf2ce3d7f89?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1722003184145-a68a3b1d845c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];
const WHY_CARDS = [
  { icon: 'check', title: 'World-Class Athletes', body: 'Watch the top 64 ranked players compete for glory and the championship title.', img: BADMINTON_IMAGES.players },
  { icon: 'vip', title: 'Premium Experience', body: 'VIP lounges, meet & greet sessions, and exclusive behind-the-scenes access.', img: BADMINTON_IMAGES.playersGroup },
  { icon: 'heritage', title: 'Rich Heritage', body: 'Celebrating 25 years of excellence in international badminton competition.', img: BADMINTON_IMAGES.shuttlerTower },
];

function PlaceToGrowSection({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="excellence-bg relative min-h-screen flex items-center py-12 sm:py-16 lg:py-20">
      <div className="excellence-backdrop absolute inset-0" />
      <div className="relative mx-auto max-w-[1800px] w-full px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`excellence-content text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="font-inter text-xs sm:text-sm font-medium uppercase tracking-widest text-white/60">Why Attend</p>
          <h2 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold text-white">Experience Excellence</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/85">Shuttle Masters Championship 2025 — August 15-22, Singapore</p>
        </div>
        <div className={`mt-8 sm:mt-12 grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-3 stagger-children ${revealed ? 'revealed' : ''}`}>
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
      <img src={img} alt="" className="excellence-card-img absolute inset-0 h-full w-full object-cover object-bottom brightness-[0.75]" />
      <div className="excellence-card-overlay absolute inset-0 bg-gradient-to-t from-slate-950/98 via-slate-950/75 to-slate-900/50" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
        <div className="excellence-card-icon z-10 mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-400/40" style={{ backgroundColor: GOLD_LIGHT, color: '#0f172a' }}>
          {icons[iconType] || icons.check}
        </div>
        <h3 className="excellence-card-title text-lg sm:text-xl font-bold text-white">{title}</h3>
        <p className="excellence-card-desc mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-white/90">{body}</p>
      </div>
    </div>
  );
}

const TOURNAMENT_ROUNDS = [
  { code: 'R1', title: 'Round of 64', date: 'Aug 15-16', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Opening rounds featuring all 64 players across 8 courts', img: BADMINTON_IMAGES.roundeImg },
  { code: 'R2', title: 'Round of 32', date: 'Aug 17-18', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Intense matches as the competition heats up', img: USER_IMAGES[1] },
  { code: 'QF', title: 'Quarter Finals', date: 'Aug 19-20', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Top 8 players battle for semi-final spots', img: USER_IMAGES[0] },
  { code: 'SF', title: 'Semi Finals', date: 'Aug 21', time: 'All Day', location: 'Royal Badminton Arena', desc: 'Four elite players compete for the finals', img: USER_IMAGES[3] },
];

function TournamentAgendaSection({ onNav }) {
  const [ref, revealed] = useReveal();
  return (
    <div className="section-dark py-12 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="font-inter text-xs sm:text-sm font-medium uppercase tracking-widest text-white/50">Tournament Details</p>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white">The Competition</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/70">Shuttle Masters Championship — August 15-22, 2025</p>
        </div>
        <div className={`mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {TOURNAMENT_ROUNDS.map((ev) => (
            <div key={ev.code} className="agenda-card card-hover shimmer-hover flex flex-col overflow-hidden rounded-2xl border md:flex-row md:h-[380px]" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
              <div className="agenda-card-content flex flex-1 flex-col justify-between p-5 sm:p-8 md:p-10">
                <div>
                  <span className="inline-block rounded-md sm:rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold" style={{ backgroundColor: GOLD_LIGHT, color: BG_DARK }}>{ev.code}</span>
                  <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-white">{ev.title}</h3>
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-white/70">{ev.desc}</p>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-white/80">{ev.date} · {ev.time}</p>
                  <p className="text-xs sm:text-sm text-white/60">{ev.location}</p>
                </div>
                <button type="button" onClick={() => onNav('tournament')} className="btn-outline-gold mt-4 sm:mt-6 w-fit rounded-md sm:rounded-lg border-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shimmer-hover" style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}>View Schedule</button>
              </div>
              <div className="agenda-card-img relative h-48 sm:h-64 w-full overflow-hidden md:h-auto md:w-[45%]">
                <img src={ev.img} alt="" className="img-zoom h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
        <div className={`relative mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-lg ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <div className="relative min-h-[320px] bg-slate-900 md:min-h-[400px]">
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
              <h3 className="mt-6 text-3xl font-bold text-white md:text-4xl">Championship Finals</h3>
              <p className="mt-3 text-lg font-semibold" style={{ color: GOLD_LIGHT }}>August 22, 2025 · 7:00 PM SGT</p>
            </div>
          </div>
        </div>

        {/* Prize Distribution Section */}
        <div className={`relative mt-16 overflow-hidden rounded-3xl ${revealed ? 'reveal revealed' : 'reveal'}`}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1721760886982-3c643f05813d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10, 22, 40, 0.85) 0%, rgba(10, 22, 40, 0.92) 100%)' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 p-10 lg:p-16">
            <h3 className="text-center text-3xl font-bold text-white lg:text-5xl">Prize Distribution</h3>
            <p className="mt-3 text-center text-lg text-white/70">Compete for glory and incredible rewards</p>

            <div className="mt-14 flex flex-col items-end justify-center gap-8 md:flex-row md:items-end pb-8">
              {/* 2nd Place - Runner-up (Left) */}
              <div className="w-full md:w-1/3">
                <div className="h-[320px] rounded-2xl border border-slate-400/30 bg-gradient-to-b from-slate-500/20 to-slate-600/30 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-slate-300/50 flex flex-col items-center justify-center">
                  {/* Silver Medal Icon */}
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg shadow-slate-400/30">
                    <svg className="h-14 w-14 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 14l-3 8h3l3-4 3 4h3l-3-8H9z" />
                    </svg>
                  </div>
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-400/50 text-xl font-bold text-white">2</div>
                  <p className="mt-4 text-xl font-semibold text-white">Runner-up</p>
                  <p className="mt-3 text-4xl font-bold text-slate-200">$400,000</p>
                </div>
              </div>

              {/* 1st Place - Champion (Center, Elevated) */}
              <div className="w-full md:w-1/3">
                <div className="h-[420px] rounded-2xl border-2 bg-gradient-to-b from-amber-500/30 to-yellow-600/20 p-10 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center" style={{ borderColor: GOLD_LIGHT }}>
                  {/* Gold Trophy Icon */}
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full shadow-lg shadow-amber-400/40" style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, #B8860B 100%)` }}>
                    <svg className="h-16 w-16 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                    </svg>
                  </div>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-slate-900" style={{ backgroundColor: GOLD_LIGHT }}>1</div>
                  <p className="mt-4 text-2xl font-bold" style={{ color: GOLD_LIGHT }}>Champion</p>
                  <p className="mt-3 text-5xl font-bold" style={{ color: GOLD_LIGHT }}>$800,000</p>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="w-full md:w-1/3">
                <div className="h-[320px] rounded-2xl border border-amber-700/30 bg-gradient-to-b from-amber-800/20 to-amber-900/30 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-amber-600/50 flex flex-col items-center justify-center">
                  {/* Bronze Medal Icon */}
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg shadow-amber-700/30">
                    <svg className="h-14 w-14 text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M9 14l-3 8h3l3-4 3 4h3l-3-8H9z" />
                    </svg>
                  </div>
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-700/50 text-xl font-bold text-white">3</div>
                  <p className="mt-4 text-xl font-semibold text-white">Third Place</p>
                  <p className="mt-3 text-4xl font-bold" style={{ color: '#CD7F32' }}>$200,000</p>
                </div>
              </div>
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
    <div className="relative overflow-hidden bg-stripes min-h-screen flex items-center py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid items-center gap-8 sm:gap-10 lg:gap-16 lg:grid-cols-2">
          <div className={`${revealed ? 'reveal-left revealed' : 'reveal-left'}`}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white">
              Join our badminton community and grow together with players and have fun on court every week
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/80">Shuttle Masters Championship — August 15-22, 2025 · Royal Badminton Arena, Singapore</p>
            <button type="button" onClick={() => onNav('tournament')} className="btn-gold shimmer-hover mt-6 sm:mt-8 rounded-lg px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-950" style={{ backgroundColor: GOLD_LIGHT }}>View Tournament</button>
          </div>
          <div className={`relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl ${revealed ? 'reveal-right revealed' : 'reveal-right'}`}>
            <img src={BADMINTON_IMAGES.community} alt="" className="img-zoom h-full w-full object-cover" />
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
    img: BADMINTON_IMAGES.player4,
    overlay: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(15, 23, 42, 0.4) 100%)',
  },
  {
    titleLine1: 'Advanced',
    titleLine2: 'Training',
    days: 'Saturday & Sunday',
    time: '08.00 PM - 11.00 PM',
    venue: 'Royal Badminton Arena, Singapore',
    img: BADMINTON_IMAGES.playerBlur,
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
      className="relative min-h-screen flex items-center py-12 sm:py-20 lg:py-28"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: `url(${USER_IMAGES[4]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/85" />
      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-left ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <p className="font-inter text-xs sm:text-sm font-medium uppercase tracking-widest text-white/55">Weekly Schedule</p>
          <h2 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold text-white">Pick Your Perfect Time</h2>
        </div>
        <div className={`mt-8 sm:mt-12 grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {SCHEDULE_CARDS.map((card) => (
            <div
              key={card.titleLine1 + card.titleLine2}
              className="schedule-card card-hover group flex flex-col overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 md:flex-row md:min-h-[400px] lg:min-h-[450px]"
              style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
            >
              <div
                className="flex flex-1 flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10"
                style={{ backgroundColor: '#0f172a' }}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white">
                    <span className="block">{card.titleLine1}</span>
                    <span className="block">{card.titleLine2}</span>
                  </h3>
                  <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium text-white/95">
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
              <div className="relative h-64 w-full overflow-hidden md:h-auto md:min-h-[450px] md:w-[48%]">
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
    { title: 'World-Class Athletes', body: 'Top 64 ranked players compete for the championship title.', img: BADMINTON_IMAGES.player3 },
    { title: 'Premium Experience', body: 'VIP lounges, meet & greet sessions, and exclusive access.', img: USER_IMAGES[1] },
    { title: 'Rich Heritage', body: 'Celebrating 25 years of international badminton excellence.', img: USER_IMAGES[2] },
  ];
  const ImproveCard = ({ item, isCta }) => (
    <div
      className={`improve-card group relative flex min-h-[380px] sm:min-h-[420px] lg:min-h-[480px] flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg transition-all duration-500 hover:shadow-2xl ${isCta ? 'cursor-pointer' : ''}`}
      onClick={isCta ? () => onNav('players') : undefined}
      onKeyDown={isCta ? (e) => e.key === 'Enter' && onNav('players') : undefined}
      role={isCta ? 'button' : undefined}
      tabIndex={isCta ? 0 : undefined}
    >
      <img src={item.img} alt="" className="improve-card-bg absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="improve-card-overlay absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/30 transition-all duration-500" />
      <div className="relative mt-auto p-5 sm:p-6 lg:p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-white">{item.title}</h3>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-white/90">{item.body}</p>
        {isCta && <span className="mt-3 sm:mt-4 inline-block text-sm sm:text-base font-semibold transition-all duration-300 group-hover:translate-x-2" style={{ color: GOLD_LIGHT }}>View Details →</span>}
      </div>
    </div>
  );
  return (
    <div className="section-dark min-h-screen flex items-center py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`w-full ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">Built to Help You Improve</h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-center text-sm sm:text-base lg:text-lg text-white/70">Experience excellence at Shuttle Masters Championship 2025</p>
        </div>
        <div className={`mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${revealed ? 'revealed' : ''}`}>
          {features.map((f) => (
            <ImproveCard key={f.title} item={f} isCta={false} />
          ))}
          <ImproveCard item={{ title: 'Meet The Players', body: 'Elite athletes from 32 countries', img: USER_IMAGES[3] }} isCta />
        </div>
      </div>
    </div>
  );
}

function FeaturedPlayersSection() {
  const [ref, revealed] = useReveal();
  const players = [
    { seed: '#1 SEED', name: 'Viktor Axelsen', country: 'Denmark', flag: '🇩🇰', rank: '1', points: '124,358', img: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { seed: '#2 SEED', name: 'Kunlavut Vitidsarn', country: 'Thailand', flag: '🇹🇭', rank: '2', points: '108,290', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { seed: '#3 SEED', name: 'Anders Antonsen', country: 'Denmark', flag: '🇩🇰', rank: '3', points: '96,570', img: 'https://images.unsplash.com/photo-1595220427358-8cf2ce3d7f89?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { seed: '#4 SEED', name: 'Shi Yu Qi', country: 'China', flag: '🇨🇳', rank: '4', points: '89,440', img: 'https://images.unsplash.com/photo-1626225015999-2e53f6aaa008?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];
  return (
    <div className="section-dark min-h-screen flex items-center py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center w-full ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">Featured Players</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/70">Elite athletes competing at Shuttle Masters Championship 2025</p>
        </div>
        <div className={`mt-8 sm:mt-12 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4 stagger-children ${revealed ? 'revealed' : ''}`}>
          {players.map((p) => (
            <div key={p.name} className="player-card group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-[250px] sm:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden">
                <img src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-900/20" />
                <span className="absolute left-2 sm:left-4 top-2 sm:top-4 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-slate-950 backdrop-blur-sm" style={{ backgroundColor: GOLD_LIGHT }}>{p.seed}</span>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 backdrop-blur-md bg-slate-950/30">
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-white">{p.name}</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/90">{p.country}</p>
                  <p className="font-inter mt-1.5 sm:mt-3 text-[10px] sm:text-xs text-white/70">Rank {p.rank} · {p.points} pts</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-34 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
          <h3 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Participating Nations</h3>
          <div className="marquee-container relative">
            <div className="marquee flex">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="marquee-content flex shrink-0">
                  {[['Denmark', 'DK'], ['China', 'CN'], ['Japan', 'JP'], ['Indonesia', 'ID'], ['Malaysia', 'MY'], ['Thailand', 'TH'], ['India', 'IN'], ['South Korea', 'KR']].map(([name, code]) => (
                    <span key={`${setIndex}-${name}`} className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-200/20 bg-white/10 backdrop-blur-sm px-3 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-medium text-white shadow-md mx-1 sm:mx-2">
                      <span className="text-lg sm:text-xl lg:text-2xl">{String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)))}</span>
                      <span className="hidden sm:inline">{name}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Second row - Different nations, reverse direction */}
          <div className="marquee-container relative mt-3 sm:mt-6">
            <div className="marquee-reverse flex">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="marquee-content flex shrink-0">
                  {[['Taiwan', 'TW'], ['Vietnam', 'VN'], ['Singapore', 'SG'], ['Hong Kong', 'HK'], ['Philippines', 'PH'], ['England', 'GB'], ['Spain', 'ES'], ['Germany', 'DE']].map(([name, code]) => (
                    <span key={`${setIndex}-${name}`} className="flex shrink-0 items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-slate-200/20 bg-white/10 backdrop-blur-sm px-3 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-medium text-white shadow-md mx-1 sm:mx-2">
                      <span className="text-lg sm:text-xl lg:text-2xl">{String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)))}</span>
                      <span className="hidden sm:inline">{name}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCornerSection() {
  const [ref, revealed] = useReveal();
  const articles = [
    { title: 'Fastest Racket Sport', body: 'Shuttlecocks can travel over 400 km/h (249 mph), making badminton the fastest racket sport in the world.', img: BADMINTON_IMAGES.playersGroup },
    { title: 'Feathered Shuttles', body: 'Professional shuttlecocks use 16 goose feathers and can be destroyed after just one rally.', img: BADMINTON_IMAGES.shuttle5 },
  ];
  return (
    <div className="section-dark min-h-screen flex items-center py-12 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-4 lg:px-6">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-4xl font-bold text-white lg:text-5xl">Did You Know?</h2>
          <p className="mt-4 text-lg text-white/70">A journey through badminton excellence</p>
        </div>
        <div className={`mt-12 grid gap-8 sm:grid-cols-2 stagger-children ${revealed ? 'revealed' : ''}`}>
          {articles.map((a) => (
            <div key={a.title} className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative aspect-[3/4] sm:aspect-video overflow-hidden">
                <img src={a.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/30" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-slate-950/40">
                <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-white/85">{a.body}</p>
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
  const sectionRef = useRef(null);
  const [lineProgress, setLineProgress] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewMid = window.innerHeight * 0.5;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      if (sectionTop + sectionHeight < viewMid) {
        setLineProgress(1);
        return;
      }
      if (sectionTop > viewMid) {
        setLineProgress(0);
        return;
      }
      const p = (viewMid - sectionTop) / sectionHeight;
      setLineProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  const items = [
    { year: 'Ancient Origins', title: 'The Beginning', body: "Battledore and shuttlecock, badminton's ancestor, was played in ancient Greece, China, Japan, and India for over 2,000 years.", img: USER_IMAGES[0] },
    { year: '1870s', title: 'Birth of Modern Badminton', body: 'British army officers in India developed the modern rules. The game was named after Badminton House in Gloucestershire, England.', img: USER_IMAGES[1] },
    { year: '1992', title: 'Olympic Debut', body: 'Badminton became an official Olympic sport at the Barcelona Games.', img: BADMINTON_IMAGES.roundeImg },
    { year: 'Today', title: 'Global Phenomenon', body: 'Over 220 million players worldwide, dominated by Asian nations in professional competition.', img: USER_IMAGES[3] },
  ];
  const TimelineCard = ({ item, side, index }) => {
    // Calculate card visibility based on line progress
    const cardThreshold = (index + 0.5) / items.length;
    const isVisible = lineProgress >= cardThreshold * 0.9;
    return (
      <div
        className={`timeline-card relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl shadow-2xl ${side === 'left' ? 'text-right' : 'text-left'} ${isVisible ? 'timeline-card-visible' : 'timeline-card-hidden'}`}
      >
        <img src={item.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/97 via-slate-950/70 to-slate-900/40" />
        <div className="relative z-10 mt-auto p-8">
          <p className="text-sm font-semibold" style={{ color: GOLD_LIGHT }}>{item.year}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{item.title}</p>
          <p className="mt-3 text-base leading-relaxed text-white/90">{item.body}</p>
        </div>
      </div>
    );
  };
  return (
    <div ref={sectionRef} className="section-dark min-h-screen py-12 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">History of Badminton</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/70">A journey through centuries of racket sport excellence</p>
          </div>
          <div className="relative mt-16">
            <div className="hidden sm:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div
              className="hidden sm:block timeline-progress absolute left-1/2 top-0 w-px -translate-x-1/2 transition-[height] duration-150 ease-out"
              style={{ height: `${lineProgress * 100}%`, backgroundColor: GOLD_LIGHT }}
              aria-hidden
            />
            {/* Mobile yellow line - positioned on left */}
            <div
              className="sm:hidden absolute left-4 top-0 w-px transition-[height] duration-150 ease-out"
              style={{ height: `${lineProgress * 100}%`, backgroundColor: GOLD_LIGHT }}
              aria-hidden
            />
            <div className="space-y-8 sm:space-y-16">
              {items.map((item, i) => (
                <div key={item.year} className="grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr] items-stretch gap-4 sm:gap-8">
                  <div className={i % 2 === 0 ? 'text-right' : ''}>
                    {i % 2 === 0 ? <TimelineCard item={item} side="left" index={i} /> : null}
                  </div>
                  {/* Timeline dot - hidden on mobile */}
                  <div className="hidden sm:flex relative z-10 w-4 items-center justify-center">
                    <span
                      className="h-5 w-5 rounded-full border-2 bg-white shadow-lg transition-all duration-500"
                      style={{
                        borderColor: lineProgress >= (i + 0.5) / items.length ? GOLD : '#cbd5e1',
                        transform: lineProgress >= (i + 0.5) / items.length ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: lineProgress >= (i + 0.5) / items.length ? '0 0 20px rgba(212, 175, 55, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                  <div className={i % 2 === 1 ? 'text-left' : ''}>
                    {i % 2 === 1 ? <TimelineCard item={item} side="right" index={i} /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const [ref, revealed] = useReveal();
  return (
    <div className="section-dark py-12 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center ${revealed ? 'reveal revealed' : 'reveal'}`}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">Contact Us</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/70">Get in touch with the Shuttle Masters Championship team</p>
        </div>
        <div className="mt-8 sm:mt-12 lg:mt-14 grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-2">
          {/* Tournament Office */}
          <div className="rounded-2xl border p-6 sm:p-10 lg:p-12 transition-smooth h-full flex flex-col" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Tournament Office</h3>
            <div className="mt-6 sm:mt-10 space-y-6 sm:space-y-8 flex-1">
              <ContactRow icon={<IconPin />} label="Venue" lines={['Royal Badminton Arena', '1 Stadium Drive', 'Singapore 397629']} />
              <ContactRow icon={<IconMail />} label="Email" lines={['info@shuttlemasters.com', 'tickets@shuttlemasters.com']} />
              <ContactRow icon={<IconPhone />} label="Phone" lines={['+65 6123 4567', 'Mon-Fri: 9AM - 6PM SGT']} />
            </div>
            <div className="mt-12 flex flex-wrap gap-5">
              <SocialBtn ariaLabel="Twitter" icon={<IconTwitter />} />
              <SocialBtn ariaLabel="Instagram" icon={<IconInstagram />} />
              <SocialBtn ariaLabel="YouTube" icon={<IconYoutube />} />
              <SocialBtn ariaLabel="Facebook" icon={<IconFacebook />} />
            </div>
          </div>

          {/* Send a Message Form */}
          <div className="rounded-2xl border p-6 sm:p-10 lg:p-12 transition-smooth h-full flex flex-col" style={{ borderColor: BORDER, backgroundColor: BG_CARD }}>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Send a Message</h3>
            <form className="mt-6 sm:mt-10 space-y-5 sm:space-y-6 flex-1 flex flex-col">
              <LabeledInput label="Full Name" placeholder="Your name" />
              <LabeledInput label="Email" placeholder="your@email.com" type="email" />
              <div>
                <label className="form-label mb-2 block text-white/70">Subject</label>
                <select className="form-input h-12 w-full rounded-lg border bg-transparent px-4 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} defaultValue="General Inquiry">
                  <option className="bg-slate-900">General Inquiry</option>
                  <option className="bg-slate-900">Ticket Information</option>
                  <option className="bg-slate-900">Media &amp; Press</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="form-label mb-2 block text-white/70">Message</label>
                <textarea rows={5} className="form-input w-full h-full min-h-[120px] resize-none rounded-lg border bg-transparent px-4 py-3 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} placeholder="How can we help?" />
              </div>
              <button type="button" className="btn-gold h-14 w-full rounded-lg font-semibold text-lg text-slate-950 mt-auto" style={{ backgroundColor: GOLD_LIGHT }}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, lines }) {
  return (
    <div className="flex gap-6">
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: 'rgba(12,27,49,0.9)' }}>
        <span className="scale-[1.75]">{icon}</span>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-xl font-semibold text-white">{label}</p>
        <div className="mt-2 text-base text-white/70 leading-relaxed">{lines.map((line, i) => <span key={i} className="block">{line}</span>)}</div>
      </div>
    </div>
  );
}

function SocialBtn({ ariaLabel, icon }) {
  return (
    <button type="button" aria-label={ariaLabel} className="grid h-14 w-14 place-items-center rounded-xl transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'rgba(12,27,49,0.9)' }}>
      <span className="scale-125">{icon}</span>
    </button>
  );
}

function LabeledInput({ label, placeholder, type }) {
  return (
    <div>
      <label className="form-label mb-2 block text-white/70">{label}</label>
      <input type={type} className="form-input h-12 w-full rounded-lg border bg-transparent px-4 text-white/90 outline-none transition-smooth" style={{ borderColor: BORDER }} placeholder={placeholder} />
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

function Footer({ onNav }) {
  return (
    <footer className="section-dark border-t" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1320px] px-6 py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Left - Logo */}
          <button type="button" onClick={() => onNav('home')} className="flex items-center gap-3 text-left transition-smooth hover:opacity-90">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold" style={{ borderColor: GOLD_LIGHT, color: GOLD_LIGHT }}>
              SM
            </div>
            <div>
              <div className="text-lg font-bold tracking-wide" style={{ color: GOLD_LIGHT }}>Shuttle Masters</div>
              <div className="-mt-0.5 text-[11px] font-medium tracking-[0.25em] text-white/70">CHAMPIONSHIP 2025</div>
            </div>
          </button>

          {/* Center - Navigation */}
          <nav className="flex flex-wrap items-center gap-6 md:gap-8">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.id)}
                className="text-sm font-medium text-white/80 transition-smooth hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right - Copyright */}
          <p className="font-inter text-sm text-white/60">© 2025 Shuttle Masters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
