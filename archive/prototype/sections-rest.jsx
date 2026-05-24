// AI sections + Hobbies + Contact.

// ─── AI INTRO BANNER ──────────────────────────────────────────────────
function AIIntro({ t }) {
  return (
    <Section id="ai" bg="ink" dataLabel="ai-intro">
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end",
      }}>
        <SectionHeader
          kicker={t.aiIntro.kicker}
          title={t.aiIntro.title}
          lede={t.aiIntro.body}
          dark
          maxWidth={920}
        />
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          color: "rgba(247,242,232,0.5)",
        }}>
          <Icon.Sparkle size={26} />
          <div style={{
            fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            Claude · Cursor · MCP
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── LECTURES ─────────────────────────────────────────────────────────
function Lectures({ t }) {
  return (
    <Section id="lectures" bg="cream" dataLabel="lectures">
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 420px) 1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "start",
      }}>
        <Reveal>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "8px 14px",
              border: "1px solid rgba(42,33,27,0.16)",
              borderRadius: 999,
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
              color: "var(--ink-2)", textTransform: "uppercase",
              marginBottom: 28,
            }}>
              <Icon.Mic size={14} />
              {t.lectures.tag}
            </div>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(38px, 4.8vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0, color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.lectures.title}
            </h2>
            <p style={{
              marginTop: 24, fontSize: 17, lineHeight: 1.6,
              color: "var(--ink-2)", textWrap: "pretty",
            }}>
              {t.lectures.body}
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: 18 }}>
          {t.lectures.talks.map((talk, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <TalkCard talk={talk} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TalkCard({ talk }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: "36px 36px",
        background: hover ? "var(--paper)" : "var(--cream-2)",
        border: "1px solid rgba(42,33,27,0.10)",
        borderRadius: 20,
        transition: "all .4s cubic-bezier(.2,.8,.2,1)",
        transform: hover ? "translateX(6px)" : "translateX(0)",
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "start",
      }}
    >
      <div style={{
        fontFamily: "var(--serif)", fontSize: 44, lineHeight: 1,
        color: "var(--accent)", fontStyle: "italic",
        minWidth: 60,
      }}>
        {talk.n}
      </div>
      <div>
        <h3 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(22px, 2vw, 30px)",
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          fontWeight: 400,
          margin: 0, color: "var(--ink)",
        }}>
          {talk.title}
        </h3>
        <p style={{
          marginTop: 12, fontSize: 16, lineHeight: 1.55,
          color: "var(--ink-2)", textWrap: "pretty",
        }}>
          {talk.body}
        </p>
      </div>
      <div style={{
        display: "flex", alignItems: "center",
        color: "var(--ink-3)",
        transform: hover ? "translateX(4px)" : "translateX(0)",
        transition: "transform .3s",
        paddingTop: 6,
      }}>
        <Icon.Play size={18} />
      </div>
    </div>
  );
}

// ─── ITTI AI — Claude Code rollout ────────────────────────────────────
function IttiAI({ t }) {
  return (
    <Section id="itti-ai" bg="cream2" dataLabel="itti-ai">
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "start",
      }}>
        <div>
          <Reveal>
            <Tag style={{ marginBottom: 24 }}>{t.ittiAi.tag}</Tag>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0, color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.ittiAi.title}
            </h2>
            <p style={{
              marginTop: 28, fontSize: 18, lineHeight: 1.55,
              color: "var(--ink-2)", textWrap: "pretty",
              maxWidth: 540,
            }}>
              {t.ittiAi.body}
            </p>
          </Reveal>

          {/* terminal-ish card */}
          <Reveal delay={0.15}>
            <div style={{
              marginTop: 44,
              background: "var(--ink)",
              borderRadius: 16,
              padding: "24px 24px 28px",
              color: "var(--cream)",
              fontFamily: "var(--mono)",
              fontSize: 13.5,
              lineHeight: 1.6,
              boxShadow: "0 24px 48px rgba(42,33,27,0.18)",
              maxWidth: 520,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3624b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3b04b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7aa97f" }} />
                <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.5, letterSpacing: "0.1em" }}>~/itti/rollout</span>
              </div>
              <div style={{ opacity: 0.55 }}>$ claude-code init --org itti</div>
              <div><span style={{ color: "#c97a4b" }}>→</span> bootstrapping engineering org</div>
              <div><span style={{ color: "#c97a4b" }}>→</span> aligning code review for AI-generated PRs</div>
              <div><span style={{ color: "#c97a4b" }}>→</span> incident playbooks · secrets · harness</div>
              <div style={{ marginTop: 8, color: "#7aa97f" }}>✓ ready for production</div>
              <div style={{ opacity: 0.4, marginTop: 8 }}><span className="cursor-blink">▍</span></div>
            </div>
          </Reveal>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {t.ittiAi.points.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div style={{
                display: "grid", gridTemplateColumns: "auto 1fr", gap: 18,
                padding: "20px 24px",
                background: "var(--paper)",
                borderRadius: 14,
                border: "1px solid rgba(42,33,27,0.08)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "var(--accent)",
                  color: "var(--cream)",
                  display: "grid", placeItems: "center",
                  fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.55, color: "var(--ink-2)", paddingTop: 6, textWrap: "pretty" }}>
                  {p}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── SIDE PROJECT — cards over video bg ───────────────────────────────
function SideProject({ t }) {
  return (
    <section
      id="side-project"
      data-screen-label="side-project"
      style={{ position: "relative", overflow: "hidden", color: "var(--cream)" }}
    >
      <VideoBackdrop palette="plum" label="Side Project · D&D Companion" scrim={0.66} intensity={1.05} blocks />
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto",
        padding: "clamp(96px, 11vw, 160px) clamp(24px, 4vw, 64px)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.05fr 0.95fr",
          gap: "clamp(32px, 5vw, 80px)", alignItems: "end",
          marginBottom: "clamp(48px, 6vw, 80px)",
        }}>
          <SectionHeader
            kicker={t.side.tag}
            title={t.side.title}
            dark
            maxWidth={620}
          />
          <p style={{
            margin: 0,
            fontSize: "clamp(16px, 1.2vw, 19px)",
            lineHeight: 1.6,
            color: "rgba(247,242,232,0.8)",
            textWrap: "pretty",
            maxWidth: 560,
          }}>
            {t.side.lede}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
        }}>
          {t.side.cards.map((c, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <SideCard card={c} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SideCard({ card, i }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: "28px 26px 26px",
        background: hover ? "rgba(247,242,232,0.10)" : "rgba(247,242,232,0.05)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(247,242,232,0.14)",
        borderRadius: 16,
        transition: "all .35s cubic-bezier(.2,.8,.2,1)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        minHeight: 220,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.22em",
        color: "rgba(247,242,232,0.55)",
        textTransform: "uppercase",
        marginBottom: 14,
      }}>
        {String(i + 1).padStart(2, "0")} · {card.tag}
      </div>
      <h4 style={{
        fontFamily: "var(--serif)",
        fontSize: 22, lineHeight: 1.2,
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
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────
function Certifications({ t }) {
  return (
    <Section id="certs" bg="cream" dataLabel="certs">
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 380px) 1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "start",
      }}>
        <Reveal>
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: "var(--ink)", color: "var(--accent-light)",
              display: "grid", placeItems: "center",
              marginBottom: 24,
            }}>
              <Icon.Cert size={32} />
            </div>
            <Tag style={{ marginBottom: 20 }}>{t.certs.tag}</Tag>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(34px, 4.2vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0, color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.certs.title}
            </h2>
            <p style={{
              marginTop: 20, fontSize: 16, lineHeight: 1.6,
              color: "var(--ink-2)",
            }}>
              {t.certs.body}
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: 0 }}>
          {t.certs.items.map((it, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <CertRow item={it} t={t} last={i === t.certs.items.length - 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function CertRow({ item, t, last }) {
  const isDone = item.status === "done";
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 24, alignItems: "center",
        padding: "22px 4px",
        borderBottom: last ? "none" : "1px solid rgba(42,33,27,0.10)",
        background: hover ? "rgba(42,33,27,0.02)" : "transparent",
        transition: "background .2s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: isDone ? "var(--accent)" : "rgba(42,33,27,0.06)",
        color: isDone ? "var(--cream)" : "var(--ink-3)",
        display: "grid", placeItems: "center",
      }}>
        {isDone ? <Icon.Check size={16} /> : <Icon.Loop size={16} />}
      </div>
      <div style={{
        fontFamily: "var(--serif)",
        fontSize: "clamp(18px, 1.5vw, 22px)",
        lineHeight: 1.25, color: "var(--ink)",
        letterSpacing: "-0.01em",
      }}>
        {item.name}
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
        color: isDone ? "var(--accent)" : "var(--ink-3)",
        textTransform: "uppercase",
      }}>
        {isDone ? t.certs.done : t.certs.progress}
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12,
        color: "var(--ink-3)",
        minWidth: 110, textAlign: "right",
      }}>
        {item.date}
      </div>
    </div>
  );
}

// ─── HOBBIES INTRO ────────────────────────────────────────────────────
function HobbiesIntro({ t }) {
  return (
    <Section id="hobbies" bg="paper" dataLabel="hobbies-intro" style={{ paddingTop: "clamp(96px, 11vw, 160px)", paddingBottom: "clamp(40px, 4vw, 60px)" }}>
      <SectionHeader
        kicker={t.hobbiesIntro.kicker}
        title={t.hobbiesIntro.title}
        maxWidth={920}
      />
    </Section>
  );
}

// ─── D&D ──────────────────────────────────────────────────────────────
function DnD({ t }) {
  return (
    <Section id="dnd" bg="paper" dataLabel="dnd" style={{ paddingTop: "clamp(40px, 4vw, 60px)" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "center",
      }}>
        {/* Decorative d20 + texture */}
        <Reveal>
          <div style={{
            position: "relative",
            aspectRatio: "1 / 1",
            maxWidth: 520,
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(135deg, #2a211b 0%, #4a3326 60%, #6b4a35 100%)",
            display: "grid", placeItems: "center",
            boxShadow: "0 24px 60px rgba(42,33,27,0.25)",
          }}>
            <D20 />
            {/* corner timecode like a still */}
            <div style={{
              position: "absolute", top: 18, left: 22,
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
              color: "rgba(247,242,232,0.6)", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span className="rec-dot" /> Table · Session 47
            </div>
            <div style={{
              position: "absolute", bottom: 18, right: 22,
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.12em",
              color: "rgba(247,242,232,0.5)",
            }}>
              roll · for · initiative
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Tag style={{ marginBottom: 24 }}>
              <Icon.Dice size={14} /> {t.dnd.tag}
            </Tag>
            <h3 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(34px, 4.2vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0, color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.dnd.title}
            </h3>
            <p style={{
              marginTop: 24, fontSize: 18, lineHeight: 1.55,
              color: "var(--ink-2)", maxWidth: 520, textWrap: "pretty",
            }}>
              {t.dnd.body}
            </p>
          </Reveal>

          <div style={{
            marginTop: 40,
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
          }}>
            {t.dnd.pulls.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div style={{
                  padding: "18px 16px",
                  borderTop: "1px solid var(--ink)",
                }}>
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
                    color: "var(--accent)", textTransform: "uppercase",
                    marginBottom: 10,
                  }}>
                    {p.k}
                  </div>
                  <div style={{
                    fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.35,
                    color: "var(--ink)",
                  }}>
                    {p.v}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function D20() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "60%", height: "60%", animation: "rotate-d20 24s linear infinite" }} aria-hidden="true">
      <defs>
        <linearGradient id="d20g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3a76b" />
          <stop offset="100%" stopColor="#7a3d1c" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#d20g)" strokeWidth="1.2" strokeLinejoin="round">
        <polygon points="100,20 175,65 175,135 100,180 25,135 25,65" />
        <polygon points="100,20 175,65 100,100" />
        <polygon points="100,20 25,65 100,100" />
        <polygon points="175,65 175,135 100,100" />
        <polygon points="25,65 25,135 100,100" />
        <polygon points="100,180 175,135 100,100" />
        <polygon points="100,180 25,135 100,100" />
      </g>
      <text x="100" y="110" textAnchor="middle" fontFamily="var(--serif)" fontSize="42" fill="#e3a76b" fontStyle="italic">20</text>
    </svg>
  );
}

// ─── SPIRITUALITY ─────────────────────────────────────────────────────
function Spirituality({ t }) {
  return (
    <Section id="spirit" bg="cream" dataLabel="spirit">
      <div style={{
        display: "grid", gridTemplateColumns: "0.9fr 1.1fr",
        gap: "clamp(40px, 6vw, 96px)",
        alignItems: "center",
      }}>
        <div>
          <Reveal>
            <Tag style={{ marginBottom: 24 }}>
              <Icon.Lotus size={14} /> {t.spirit.tag}
            </Tag>
            <h3 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(34px, 4.2vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              margin: 0, color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.spirit.title}
            </h3>
            <p style={{
              marginTop: 24, fontSize: 18, lineHeight: 1.6,
              color: "var(--ink-2)", maxWidth: 520, textWrap: "pretty",
            }}>
              {t.spirit.body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div style={{
            position: "relative",
            padding: "clamp(40px, 5vw, 72px)",
            background: "var(--cream-2)",
            border: "1px solid rgba(42,33,27,0.1)",
            borderRadius: 20,
            textAlign: "center",
          }}>
            <ConcentricRings />
            <blockquote style={{
              position: "relative",
              margin: 0,
              fontFamily: "var(--serif)",
              fontSize: "clamp(26px, 2.6vw, 38px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "var(--ink)",
              fontStyle: "italic",
              letterSpacing: "-0.015em",
            }}>
              "{t.spirit.pull}"
            </blockquote>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function ConcentricRings() {
  return (
    <svg viewBox="0 0 400 400" style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      opacity: 0.16, pointerEvents: "none",
    }} aria-hidden="true">
      <g fill="none" stroke="var(--ink)" strokeWidth="0.7">
        {[40, 80, 120, 160, 200, 240].map((r, i) => (
          <circle key={i} cx="200" cy="200" r={r} />
        ))}
      </g>
    </svg>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────
function Contact({ t }) {
  return (
    <section
      id="contact"
      data-screen-label="contact"
      style={{
        background: "var(--ink)",
        color: "var(--cream)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(120px, 14vw, 200px) clamp(24px, 4vw, 64px)",
      }}
    >
      {/* Faint accent halo */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(60% 60% at 50% 50%, rgba(201,122,75,0.22), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1100, margin: "0 auto", textAlign: "center",
      }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(247,242,232,0.55)",
          marginBottom: 28,
          display: "inline-flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ width: 24, height: 1, background: "rgba(247,242,232,0.5)" }} />
          {t.contact.kicker}
          <span style={{ width: 24, height: 1, background: "rgba(247,242,232,0.5)" }} />
        </div>

        <h2 style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(56px, 8.5vw, 140px)",
          lineHeight: 0.95,
          letterSpacing: "-0.035em",
          fontWeight: 400,
          margin: 0, color: "var(--cream)",
          textWrap: "balance",
        }}>
          {t.contact.title_pre}{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent-light)" }}>
            {t.contact.title_em}
          </em>
        </h2>

        <p style={{
          marginTop: 28,
          fontSize: "clamp(17px, 1.3vw, 21px)",
          lineHeight: 1.55,
          color: "rgba(247,242,232,0.7)",
          maxWidth: 520, marginInline: "auto",
        }}>
          {t.contact.body}
        </p>

        <div style={{ marginTop: 56, display: "flex", justifyContent: "center" }}>
          <CTAButton size="xl" invert href="https://www.linkedin.com/in/gabriel-vargas/">
            {t.contact.cta}
          </CTAButton>
        </div>

        <div style={{
          marginTop: 96,
          paddingTop: 32,
          borderTop: "1px solid rgba(247,242,232,0.12)",
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center",
          gap: 16,
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(247,242,232,0.45)",
        }}>
          <div>© 2026 — Gabriel Vargas</div>
          <div>{t.contact.foot}</div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  AIIntro, Lectures, IttiAI, SideProject, Certifications,
  HobbiesIntro, DnD, Spirituality, Contact,
});
