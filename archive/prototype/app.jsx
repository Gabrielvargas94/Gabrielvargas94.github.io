// Navbar with language switcher + section nav, and the App orchestrator.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "photoPos": "right",
  "lang": "en",
  "accent": "#c97a4b"
}/*EDITMODE-END*/;

function Nav({ t, lang, setLang, scrolled }) {
  const [open, setOpen] = React.useState(null); // 'ai' | 'hobbies' | null
  const [langOpen, setLangOpen] = React.useState(false);
  const navRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (!navRef.current?.contains(e.target)) {
        setOpen(null);
        setLangOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(null);
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "16px clamp(24px, 4vw, 64px)",
        background: scrolled ? "rgba(247,242,232,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(42,33,27,0.08)" : "1px solid transparent",
        transition: "background .25s, border-color .25s",
      }}
    >
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        {/* Logo / name */}
        <a href="#hero" onClick={go("hero")} style={{
          display: "flex", alignItems: "center", gap: 12,
          textDecoration: "none", color: "var(--ink)",
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--ink)", color: "var(--cream)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic",
            letterSpacing: "-0.02em",
          }}>g</span>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400,
              letterSpacing: "-0.01em",
            }}>
              Gabriel Vargas
            </div>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em",
              color: "var(--ink-3)", textTransform: "uppercase",
              marginTop: 4,
            }}>
              Head of Engineering
            </div>
          </div>
        </a>

        {/* Center nav */}
        <div className="nav-links" style={{
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <NavItem onClick={go("work")} label={t.nav.work} />

          <NavDropdown
            label={t.nav.ai}
            open={open === "ai"}
            onToggle={() => setOpen(open === "ai" ? null : "ai")}
            items={[
              { label: lang === "en" ? "Lectures" : lang === "es" ? "Charlas" : "Palestras", id: "lectures" },
              { label: lang === "en" ? "Claude Code rollout" : lang === "es" ? "Rollout de Claude Code" : "Rollout de Claude Code", id: "itti-ai" },
              { label: lang === "en" ? "Side Project" : "Side Project", id: "side-project" },
              { label: lang === "en" ? "Certifications" : lang === "es" ? "Certificaciones" : "Certificações", id: "certs" },
            ]}
            onSelect={go}
          />

          <NavDropdown
            label={t.nav.hobbies}
            open={open === "hobbies"}
            onToggle={() => setOpen(open === "hobbies" ? null : "hobbies")}
            items={[
              { label: "Dungeons & Dragons", id: "dnd" },
              { label: lang === "en" ? "Spirituality" : lang === "es" ? "Espiritualidad" : "Espiritualidade", id: "spirit" },
            ]}
            onSelect={go}
          />
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LangSwitcher lang={lang} setLang={setLang} open={langOpen} setOpen={setLangOpen} t={t} />
          <a
            href="https://www.linkedin.com/in/gabriel-vargas/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 18px",
              background: "var(--ink)",
              color: "var(--cream)",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 13.5, fontWeight: 500, letterSpacing: "-0.005em",
            }}
          >
            <Icon.Linkedin size={14} />
            <span className="nav-cta-text">{t.nav.cta}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ onClick, label }) {
  return (
    <a
      href="#"
      onClick={onClick}
      className="nav-item"
      style={{
        padding: "8px 14px",
        color: "var(--ink-2)",
        textDecoration: "none",
        fontSize: 14, fontWeight: 500,
        borderRadius: 999,
      }}
    >
      {label}
    </a>
  );
}

function NavDropdown({ label, open, onToggle, items, onSelect }) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="nav-item nav-item-btn"
        style={{
          padding: "8px 14px",
          background: "transparent",
          border: "none",
          color: "var(--ink-2)",
          fontSize: 14, fontWeight: 500,
          borderRadius: 999, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
          fontFamily: "inherit",
        }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform .2s",
        }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          minWidth: 240,
          background: "var(--cream)",
          border: "1px solid rgba(42,33,27,0.10)",
          borderRadius: 14,
          padding: 6,
          boxShadow: "0 16px 48px rgba(42,33,27,0.16)",
          animation: "drop-in .2s ease",
        }}>
          {items.map((it, i) => (
            <a
              key={i}
              href={`#${it.id}`}
              onClick={onSelect(it.id)}
              style={{
                display: "block", padding: "10px 14px",
                color: "var(--ink-2)", textDecoration: "none",
                fontSize: 14, borderRadius: 8,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(42,33,27,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function LangSwitcher({ lang, setLang, open, setOpen, t }) {
  const langs = [
    { code: "en", label: "EN", full: "English" },
    { code: "es", label: "ES", full: "Español" },
    { code: "pt", label: "PT", full: "Português" },
  ];
  const current = langs.find((l) => l.code === lang);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "9px 14px",
          background: "transparent",
          border: "1px solid rgba(42,33,27,0.16)",
          borderRadius: 999,
          color: "var(--ink-2)",
          fontSize: 13, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <Icon.Globe size={14} />
        {current.label}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          minWidth: 160,
          background: "var(--cream)",
          border: "1px solid rgba(42,33,27,0.10)",
          borderRadius: 14,
          padding: 6,
          boxShadow: "0 16px 48px rgba(42,33,27,0.16)",
          animation: "drop-in .2s ease",
        }}>
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                background: l.code === lang ? "rgba(42,33,27,0.06)" : "transparent",
                border: "none",
                color: "var(--ink-2)",
                fontSize: 14, borderRadius: 8,
                cursor: "pointer", fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { if (l.code !== lang) e.currentTarget.style.background = "rgba(42,33,27,0.04)"; }}
              onMouseLeave={(e) => { if (l.code !== lang) e.currentTarget.style.background = "transparent"; }}
            >
              <span>{l.full}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-3)" }}>
                {l.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const t = window.TRANSLATIONS[tweaks.lang] || window.TRANSLATIONS.en;
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply accent live as CSS var
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    // Derived light accent
    document.documentElement.style.setProperty("--accent-light", tweaks.accent + "cc");
  }, [tweaks.accent]);

  const setLang = (code) => setTweak("lang", code);

  return (
    <>
      <Nav
        t={t}
        lang={tweaks.lang}
        setLang={setLang}
        scrolled={scrolled}
      />
      <main>
        <Hero t={t} lang={tweaks.lang} photoPos={tweaks.photoPos} />
        <IttiSplit t={t} />
        <MeliCards t={t} />
        <IDBSection t={t} />

        <AIIntro t={t} />
        <Lectures t={t} />
        <IttiAI t={t} />
        <SideProject t={t} />
        <Certifications t={t} />

        <HobbiesIntro t={t} />
        <DnD t={t} />
        <Spirituality t={t} />

        <Contact t={t} />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero photo position">
          <TweakRadio
            value={tweaks.photoPos}
            onChange={(v) => setTweak("photoPos", v)}
            options={[
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "center", label: "Center" },
            ]}
          />
        </TweakSection>
        <TweakSection title="Accent color">
          <TweakColor
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#c97a4b", "#b58853", "#7a3d1c", "#3a6b4e", "#5a3370"]}
          />
        </TweakSection>
        <TweakSection title="Language">
          <TweakRadio
            value={tweaks.lang}
            onChange={(v) => setTweak("lang", v)}
            options={[
              { value: "en", label: "EN" },
              { value: "es", label: "ES" },
              { value: "pt", label: "PT" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
