// Work sections: Hero, itti split, Mercado Libre cards, IDB.

// ─── HERO ─────────────────────────────────────────────────────────────
function Hero({ t, lang, photoPos }) {
  const photoOrder = photoPos === "left" ? 0 : 2;
  const textOrder = 1;
  const isCenter = photoPos === "center";

  return (
    <section
      id="hero"
      data-screen-label="hero"
      style={{
        background: "var(--cream)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        paddingTop: 100,
        paddingBottom: 80,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Decorative grain */}
      <div className="hero-grain" />

      {/* Top-right floating meta — date + status */}
      <div style={{
        position: "absolute", top: 100, right: "clamp(24px, 4vw, 64px)",
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
        color: "var(--ink-3)", textTransform: "uppercase",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse-dot" />
          Open to leadership roles
        </div>
        <div>{t.hero.meta_loc} · {t.hero.meta_remote}</div>
      </div>

      <div style={{
        maxWidth: 1440, margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)",
        display: "grid",
        gridTemplateColumns: isCenter ? "1fr" : "1.05fr 0.95fr",
        gap: isCenter ? 0 : "clamp(24px, 4vw, 72px)",
        alignItems: "center",
        width: "100%",
        position: "relative",
      }}>
        {/* TEXT */}
        <div style={{ order: isCenter ? 1 : textOrder, position: "relative", zIndex: 2 }}>
          <Tag style={{ marginBottom: 28 }}>{t.hero.eyebrow}</Tag>

          <h1 style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(54px, 7.2vw, 116px)",
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            fontWeight: 400,
            margin: 0,
            color: "var(--ink)",
            textWrap: "balance",
          }}>
            {t.hero.title_pre}{" "}
            <em style={{
              fontStyle: "italic",
              color: "var(--accent)",
              fontFamily: "var(--serif)",
              fontWeight: 400,
            }}>
              {t.hero.title_em}
            </em>{" "}
            {t.hero.title_post}
          </h1>

          <p style={{
            marginTop: 32,
            fontSize: "clamp(17px, 1.35vw, 22px)",
            lineHeight: 1.55,
            color: "var(--ink-2)",
            maxWidth: 560,
            textWrap: "pretty",
          }}>
            {t.hero.subtitle}
          </p>

          <div style={{
            marginTop: 44,
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20,
          }}>
            <CTAButton size="lg" href="https://www.linkedin.com/in/gabriel-vargas/">
              {t.hero.cta}
            </CTAButton>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em",
              color: "var(--ink-3)", textTransform: "uppercase",
            }}>
              <Icon.Dot size={6} />
              {t.hero.meta_years}
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{
            marginTop: "clamp(48px, 6vw, 88px)",
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em",
            color: "var(--ink-3)", textTransform: "uppercase",
          }}>
            <span className="scroll-arrow">↓</span> {t.hero.scroll}
          </div>
        </div>

        {/* PHOTO */}
        <div style={{
          order: isCenter ? 0 : photoOrder,
          position: isCenter ? "absolute" : "relative",
          inset: isCenter ? 0 : undefined,
          display: "flex",
          justifyContent: isCenter ? "center" : photoPos === "left" ? "flex-start" : "flex-end",
          alignItems: "center",
          zIndex: isCenter ? 1 : "auto",
          opacity: isCenter ? 0.35 : 1,
          pointerEvents: isCenter ? "none" : "auto",
        }}>
          <div style={{ position: "relative", width: "min(100%, 560px)" }}>
            {/* Accent blob */}
            <div style={{
              position: "absolute", inset: "-8% -6%",
              background: "radial-gradient(60% 60% at 50% 55%, rgba(201,122,75,0.18), transparent 70%)",
              filter: "blur(20px)",
              zIndex: 0,
            }} />
            {/* Frame ticks */}
            <FrameCorners />
            <img
              src="assets/gabriel.png"
              alt="Gabriel Vargas"
              style={{
                position: "relative",
                width: "100%",
                height: "auto",
                display: "block",
                zIndex: 1,
                filter: "drop-shadow(0 24px 40px rgba(42,33,27,0.18))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FrameCorners() {
  const corner = (rot) => ({
    position: "absolute",
    width: 28, height: 28,
    borderTop: "1.5px solid var(--ink)",
    borderLeft: "1.5px solid var(--ink)",
    opacity: 0.55,
    transform: `rotate(${rot}deg)`,
  });
  return (
    <>
      <div style={{ ...corner(0), top: -14, left: -14 }} />
      <div style={{ ...corner(90), top: -14, right: -14 }} />
      <div style={{ ...corner(-90), bottom: -14, left: -14 }} />
      <div style={{ ...corner(180), bottom: -14, right: -14 }} />
    </>
  );
}

// ─── ITTI SPLIT SCREEN ────────────────────────────────────────────────
function IttiSplit({ t }) {
  return (
    <Section id="work" bg="cream" full dataLabel="itti-split">
      {/* Header above the split */}
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "clamp(80px, 9vw, 140px) clamp(24px, 4vw, 64px) clamp(56px, 6vw, 96px)",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end",
      }}>
        <div>
          <Tag style={{ marginBottom: 24 }}>{t.itti.tag}</Tag>
          <h2 style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(40px, 5.2vw, 80px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            fontWeight: 400,
            margin: 0,
            color: "var(--ink)",
            textWrap: "balance",
          }}>
            {t.itti.title}
          </h2>
        </div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
          color: "var(--ink-3)", textTransform: "uppercase",
        }}>
          Software Engineering Manager · itti
        </div>
      </div>

      {/* Split videos with brand logo medallion */}
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          minHeight: "min(78vh, 720px)",
        }}>
          {/* Left — Delivery (Monchis) */}
          <SplitPane
            side="left"
            palette="warm"
            label="Delivery · Monchis"
            tagLabel={t.itti.monchis.tag}
            name={t.itti.monchis.name}
            sub={t.itti.monchis.sub}
            body={t.itti.monchis.body}
          />
          {/* Right — Ride (muv) */}
          <SplitPane
            side="right"
            palette="night"
            label="Ride · muv"
            tagLabel={t.itti.muv.tag}
            name={t.itti.muv.name}
            sub={t.itti.muv.sub}
            body={t.itti.muv.body}
          />
        </div>

        {/* itti logo medallion in the center */}
        <ItttiMedallion />
      </div>

      {/* What I did — bullets */}
      <div style={{
        maxWidth: 1320, margin: "0 auto",
        padding: "clamp(64px, 7vw, 110px) clamp(24px, 4vw, 64px) clamp(40px, 5vw, 80px)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 320px) 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "start",
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
            color: "var(--ink-3)", textTransform: "uppercase",
            paddingTop: 6,
          }}>
            {/* small label */}
            ↳ What I did
          </div>
          <div>
            <p style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(22px, 2vw, 30px)",
              lineHeight: 1.35, fontWeight: 400, margin: 0,
              color: "var(--ink)",
              textWrap: "pretty",
              maxWidth: 760,
            }}>
              {t.itti.body}
            </p>
            <ul style={{
              listStyle: "none", padding: 0, margin: "40px 0 0",
              display: "grid", gap: 18,
            }}>
              {t.itti.bullets.map((b, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li style={{
                    display: "grid", gridTemplateColumns: "auto 1fr", gap: 16,
                    fontSize: 17, lineHeight: 1.55, color: "var(--ink-2)",
                    paddingTop: 16, borderTop: "1px solid rgba(42,33,27,0.10)",
                  }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 12,
                      color: "var(--accent)", paddingTop: 4,
                    }}>0{i + 1}</span>
                    <span>{b}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

function SplitPane({ side, palette, label, tagLabel, name, sub, body }) {
  const align = side === "left" ? "flex-start" : "flex-end";
  return (
    <div style={{ position: "relative", overflow: "hidden", color: "var(--cream)" }}>
      <VideoBackdrop palette={palette} label={label} scrim={0.55} blocks />
      <div style={{
        position: "relative", height: "100%", minHeight: "min(78vh, 720px)",
        padding: "clamp(40px, 5vw, 80px) clamp(28px, 4vw, 64px)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        alignItems: align,
        textAlign: side === "left" ? "left" : "right",
      }}>
        <Tag dark style={{ marginBottom: 18 }}>{tagLabel}</Tag>
        <h3 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(48px, 6.5vw, 92px)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          margin: 0,
          color: "var(--cream)",
        }}>
          {name}
        </h3>
        <div style={{
          marginTop: 12,
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.14em",
          color: "rgba(247,242,232,0.6)", textTransform: "uppercase",
        }}>
          {sub}
        </div>
        <p style={{
          marginTop: 24, maxWidth: 380,
          fontSize: 16, lineHeight: 1.55,
          color: "rgba(247,242,232,0.85)",
          textWrap: "pretty",
        }}>
          {body}
        </p>
      </div>
    </div>
  );
}

// itti logo medallion sitting between the two halves
function ItttiMedallion() {
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 3,
    }}>
      <div style={{
        width: "clamp(120px, 13vw, 170px)",
        height: "clamp(120px, 13vw, 170px)",
        borderRadius: "50%",
        background: "var(--cream)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(42,33,27,0.12)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em",
          color: "var(--ink-3)", textTransform: "uppercase",
          marginBottom: 4,
        }}>
          itti ecosystem
        </div>
        <div style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(36px, 4vw, 52px)",
          lineHeight: 1, fontWeight: 400,
          letterSpacing: "-0.04em",
          color: "var(--ink)",
        }}>
          itti
        </div>
        {/* rotating ring */}
        <svg
          style={{ position: "absolute", inset: -12, animation: "spin 28s linear infinite" }}
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <path id="ittiRing" d="M 100, 100 m -88, 0 a 88,88 0 1,1 176,0 a 88,88 0 1,1 -176,0" />
          </defs>
          <text fill="var(--cream)" fontFamily="var(--mono)" fontSize="10" letterSpacing="3" style={{ textTransform: "uppercase" }}>
            <textPath href="#ittiRing">
              · MONCHIS · DELIVERY · MUV · RIDE · MONCHIS · DELIVERY · MUV · RIDE
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─── MERCADO LIBRE — 4 cards on video bg ──────────────────────────────
function MeliCards({ t }) {
  return (
    <section
      id="meli"
      data-screen-label="meli"
      style={{ position: "relative", overflow: "hidden", color: "var(--cream)" }}
    >
      <VideoBackdrop palette="ember" label="Mercado Libre · 2022–2024" scrim={0.62} intensity={1.1} />
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "clamp(96px, 11vw, 160px) clamp(24px, 4vw, 64px)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end", marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <SectionHeader
            kicker={t.meli.tag}
            title={t.meli.title}
            lede={t.meli.subtitle}
            dark
          />
          <div style={{
            fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
            color: "rgba(247,242,232,0.55)", textTransform: "uppercase",
            display: "none",
          }}>
            Project Leader
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {t.meli.cards.map((c, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <MeliCard card={c} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeliCard({ card, i }) {
  const icons = [Icon.Stack, Icon.Graph, Icon.Code, Icon.Sparkle];
  const IconC = icons[i] || Icon.Sparkle;
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: "32px 28px 28px",
        background: hover ? "rgba(247,242,232,0.10)" : "rgba(247,242,232,0.06)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(247,242,232,0.16)",
        borderRadius: 18,
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all .4s cubic-bezier(.2,.8,.2,1)",
        minHeight: 280,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 28,
      }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em",
          color: "rgba(247,242,232,0.6)",
        }}>
          {card.tag}
        </span>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(247,242,232,0.10)",
          display: "grid", placeItems: "center",
          color: "var(--cream)",
        }}>
          <IconC size={22} />
        </div>
      </div>
      <div>
        <h4 style={{
          fontFamily: "var(--serif)",
          fontSize: 26, lineHeight: 1.15,
          letterSpacing: "-0.01em",
          fontWeight: 400,
          margin: "0 0 12px",
          color: "var(--cream)",
        }}>
          {card.title}
        </h4>
        <p style={{
          margin: 0, fontSize: 14.5, lineHeight: 1.55,
          color: "rgba(247,242,232,0.72)",
          textWrap: "pretty",
        }}>
          {card.body}
        </p>
      </div>
    </div>
  );
}

// ─── IDB — Bank section ───────────────────────────────────────────────
function IDBSection({ t }) {
  return (
    <Section id="idb" bg="cream2" dataLabel="idb">
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 380px) 1fr",
        gap: "clamp(40px, 6vw, 100px)",
        alignItems: "start",
      }}>
        <Reveal>
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 18,
              background: "var(--ink)", color: "var(--cream)",
              display: "grid", placeItems: "center",
              marginBottom: 28,
            }}>
              <Icon.Bank size={36} />
            </div>
            <Tag style={{ marginBottom: 16 }}>{t.idb.tag}</Tag>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.16em",
              color: "var(--ink-3)", textTransform: "uppercase",
            }}>
              {t.idb.title}
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(38px, 5vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0,
              color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.idb.org}
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p style={{
              marginTop: 28,
              fontSize: "clamp(18px, 1.4vw, 22px)",
              lineHeight: 1.55,
              color: "var(--ink-2)",
              maxWidth: 680,
              textWrap: "pretty",
            }}>
              {t.idb.lede}
            </p>
          </Reveal>

          <div style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 24,
            borderTop: "1px solid rgba(42,33,27,0.12)",
            paddingTop: 36,
          }}>
            {t.idb.stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div>
                  <div style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(44px, 4.5vw, 64px)",
                    lineHeight: 1, letterSpacing: "-0.03em",
                    fontWeight: 400,
                    color: "var(--accent)",
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    marginTop: 10, fontSize: 14, lineHeight: 1.5,
                    color: "var(--ink-2)",
                    maxWidth: 220,
                  }}>
                    {s.l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p style={{
              marginTop: 48,
              fontSize: 16, lineHeight: 1.65,
              color: "var(--ink-3)",
              maxWidth: 680,
              borderLeft: "2px solid var(--accent)",
              paddingLeft: 24,
              fontStyle: "italic",
              fontFamily: "var(--serif)",
            }}>
              {t.idb.body}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { Hero, IttiSplit, MeliCards, IDBSection });
