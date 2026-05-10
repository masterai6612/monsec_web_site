/* global React, ReactDOM, Icon, LogoMark, HeroNetwork, HeroViz, SERVICES, ServiceModal, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle */
const { useState, useEffect, useRef } = React;

const APPROACH = [
  { num: "01", title: "Discover",  body: "Crown-jewel mapping, threat-model workshops, current-state assessment against the relevant control set.", deliv: ["Asset & data-flow inventory", "Threat-model artifacts", "Gap analysis"] },
  { num: "02", title: "Design",    body: "Reference architectures and policy-as-code that fits your stack. No 100-page Word docs nobody reads.", deliv: ["Target architecture", "Policy-as-code repo", "Roadmap & RACI"] },
  { num: "03", title: "Implement", body: "We embed with your engineers â pipelines, scanners, runtime defense, evidence collection wired in.", deliv: ["Hardened pipelines", "Scanner integrations", "Audit-ready evidence"] },
  { num: "04", title: "Operate",   body: "Triage cadence, on-call enablement, drift detection. Hand-over plan written from day one.", deliv: ["Runbooks", "On-call training", "Quarterly reviews"] }
];

const TEAM = [
  { initials: "AM", name: "Arvin Monie",     role: "Founder Â· Principal Security Architect", focus: "AI Security, Cloud, AppSec â 20+ yrs across enterprise & finance" },
  { initials: "RP", name: "Cloud Sec Lead",  role: "Cloud & Container",                       focus: "AWS, Azure, GCP, EKS/AKS/OpenShift specialist" },
  { initials: "SK", name: "AppSec Lead",     role: "Application Security",                    focus: "SAST/DAST programs, secure code review, OSCP" },
  { initials: "DV", name: "DevSecOps Lead",  role: "Pipelines & Supply Chain",                focus: "GitHub Actions, GitLab, Jenkins, SLSA L3" }
];

/* ============================================================
   NAV DROPDOWN
   ============================================================ */
const NavDropdown = ({ num, label, children, wide, onItemClick }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="nav__item" ref={ref}
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}>
      <button className="nav__link" data-num={num}
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}>
        {label}
        <span className="nav__chev"/>
      </button>
      {open && (
        <div className={`nav__dd ${wide ? "nav__dd--wide" : ""}`}
             onClick={() => { setOpen(false); onItemClick && onItemClick(); }}>
          <div className="nav__dd-inner">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DDItem = ({ num, icon, name, sub, onClick, href }) => {
  const Inner = (
    <>
      <div className="nav__dd-icon">{icon ? <Icon name={icon} width="16" height="16"/> : <span className="nav__dd-num">{num}</span>}</div>
      <div className="nav__dd-name">{name}<small>{sub}</small></div>
      <div className="nav__dd-go"><Icon name="arrowUR" width="14" height="14"/></div>
    </>
  );
  if (href) {
    const isExternal = href.startsWith("http");
    const handleClick = (e) => {
      if (isExternal) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_blank", "noopener,noreferrer");
      }
      onClick && onClick(e);
    };
    return <a href={href} className="nav__dd-item" onClick={handleClick} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>{Inner}</a>;
  }
  return <button className="nav__dd-item" onClick={onClick}>{Inner}</button>;
};

const App = () => {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "theme": "Green",
    "showHeroNetwork": true
  }/*EDITMODE-END*/);

  const [active, setActive] = useState(null);

  // apply theme
  useEffect(() => {
    const map = { "Green": "default", "Ice": "ice", "Violet": "violet", "Amber": "amber" };
    document.body.dataset.theme = map[t.theme] || "default";
  }, [t.theme]);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="container nav__inner">
          <a href="#" className="nav__logo">
            <LogoMark height={48}/>
          </a>
          <div className="nav__links">
            <NavDropdown num="01" label="Services" wide onItemClick={() => {}}>
              {SERVICES.map(s => (
                <DDItem key={s.id} icon={s.icon} name={s.title} sub={s.sub.split(".")[0] + "."}
                        onClick={() => { setActive(s); }}/>
              ))}
              <div className="nav__dd-foot">
                <span>7 practice areas</span>
                <a href="#services" style={{color: "var(--accent)"}}>View all â</a>
              </div>
            </NavDropdown>
            <NavDropdown num="02" label="Approach">
              {APPROACH.map(a => (
                <DDItem key={a.num} num={a.num} name={a.title} sub={a.body.slice(0, 70) + "â¦"}
                        href={"#approach"}/>
              ))}
            </NavDropdown>
            <NavDropdown num="03" label="About">
              <DDItem icon="ai" name="Arvin Monie" sub="Founder & Principal Security Architect" href="#about"/>
              <DDItem icon="arch" name="The Team" sub="Senior practitioners across AI, AppSec, Cloud" href="#about"/>
              <DDItem icon="linkedin" name="LinkedIn" sub="Connect with Arvin" href="https://www.linkedin.com/in/arvin-monie-495a1644/"/>
            </NavDropdown>
            <NavDropdown num="04" label="Contact">
              <DDItem icon="mail" name="info@monsec.ca" sub="Direct line â replies same business day" href="mailto:info@monsec.ca"/>
              <DDItem icon="linkedin" name="LinkedIn DM" sub="Reach Arvin on LinkedIn" href="https://www.linkedin.com/in/arvin-monie-495a1644/"/>
              <DDItem icon="play" name="Book a scoping call" sub="30-min free, no SOW required" href="#" onClick={(e) => { e.preventDefault(); if (window.ReapdatWidget) window.ReapdatWidget.open(); }}/>
            </NavDropdown>
            <a href="#" className="nav__cta" onClick={(e) => { e.preventDefault(); if (window.ReapdatWidget) window.ReapdatWidget.open(); }}>Book a session</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="bg-grid"/>
        {t.showHeroNetwork && <HeroNetwork/>}
        <div className="container">
          <div className="hero__grid">
            <div>
              <span className="hero__status">
                <span className="dot"/>v.2026.05 â accepting new engagements
              </span>
              <h1 className="hero__title">
                Security for the <em>AI-native</em><br/>
                <span className="underline">stack you actually ship.</span>
              </h1>
              <p className="hero__lede">
                MonSec is a specialist consultancy for AI &amp; LLM security, application security,
                DevSecOps, and cloud. We embed with your engineers, harden the systems
                that matter, and leave your team running the controls â not us.
              </p>
              <div className="hero__ctas">
                <a href="#services" className="btn-primary">Explore services <Icon name="arrow"/></a>
                <a href="#contact" className="btn-ghost">Talk to a security engineer</a>
              </div>
              <div className="hero__meta">
                <div className="hero__meta-item">
                  <div className="num">150<span>+</span></div>
                  <div className="lbl">Engagements delivered</div>
                </div>
                <div className="hero__meta-item">
                  <div className="num">7</div>
                  <div className="lbl">Practice areas</div>
                </div>
                <div className="hero__meta-item">
                  <div className="num">24<span>/7</span></div>
                  <div className="lbl">IR availability on retainer</div>
                </div>
              </div>
            </div>
            <div className="hero__viz">
              <HeroViz/>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Services / 01</span>
            <div>
              <h2 className="section__title">
                Seven practice areas. <em>Click any to drop into the deep-dive.</em>
              </h2>
              <p className="section__lede">
                Each area opens an interactive workspace â architecture diagram, live demos,
                tooling stack, control mappings. Same view your engineers will work from.
              </p>
            </div>
          </div>

          <div className="services-grid">
            {SERVICES.map(s => (
              <button key={s.id} className="service-card" data-span={s.span} onClick={() => setActive(s)}>
                <div className="service-card__num">{s.num} / {s.tags.join(" Â· ")}</div>
                <div className="service-card__icon"><Icon name={s.icon}/></div>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__sub">{s.sub}</p>
                <div className="service-card__tags">
                  {s.tags.map(tg => <span key={tg} className="service-card__tag">{tg}</span>)}
                </div>
                <div className="service-card__arrow"><Icon name="arrowUR" width="20" height="20"/></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="section" id="approach">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Approach / 02</span>
            <div>
              <h2 className="section__title">
                We're operators, not auditors. <em>Four phases. No hand-waving.</em>
              </h2>
              <p className="section__lede">
                Predictable engagement model. You get architects who write code, not slide decks
                with vague recommendations.
              </p>
            </div>
          </div>
          <div className="approach">
            {APPROACH.map(a => (
              <div key={a.num} className="approach__step">
                <div className="num">PHASE / {a.num}</div>
                <div className="title">{a.title}</div>
                <p className="body">{a.body}</p>
                <div className="deliverables">
                  {a.deliv.map(d => <span key={d}>{d}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Team / 03</span>
            <div>
              <h2 className="section__title">
                Hands-on practitioners, <em>not consultants.</em>
              </h2>
              <p className="section__lede">
                A small team of senior security engineers led by Arvin Monie â focused on
                AI security, AppSec, and cloud. We pick up the keyboard.
              </p>
            </div>
          </div>
          <div className="about">
            <div className="about__profile">
              <div className="about__photo">
                <img src="assets/arvin.jpeg" alt="Arvin Monie"/>
              </div>
              <h3 className="about__name">Arvin Monie</h3>
              <div className="about__role">Founder Â· Principal Security Architect</div>
              <p className="about__bio">
                Twenty-plus years across application security, cloud, and AI. I've led security
                programs at enterprises and high-velocity engineering orgs â embedding scanners
                in pipelines, hardening AWS/Azure/GCP estates, and most recently building
                guardrails for LLM and agentic systems.
              </p>
              <p className="about__bio" style={{marginTop: 12}}>
                MonSec exists because the gap between "secure SDLC slides" and "actually
                shipping safe AI" is wider than ever â and bridging it needs engineers
                who can read your codebase, not just your control framework.
              </p>
              <div className="about__creds">
                <span className="about__cred">CISSP</span>
                <span className="about__cred">OSCP</span>
                <span className="about__cred">AWS Sec</span>
                <span className="about__cred">Azure Sec</span>
                <span className="about__cred">GCP Sec</span>
                <span className="about__cred">CKS</span>
                <span className="about__cred">SABSA</span>
              </div>
              <a href="https://www.linkedin.com/in/arvin-monie-495a1644/" target="_blank" rel="noreferrer" className="about__linkedin">
                <Icon name="linkedin" width="16" height="16"/>
                Connect on LinkedIn
              </a>
            </div>
            <div>
              <div style={{fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 16}}>
                The team â like-minded security professionals
              </div>
              <div className="team">
                {TEAM.map(m => (
                  <div key={m.name} className="team__member">
                    <div className="team__avatar">{m.initials}</div>
                    <div className="team__name">{m.name}</div>
                    <div className="team__role">{m.role}</div>
                    <div className="team__focus">{m.focus}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 24, padding: 20, border: "1px dashed var(--line-2)", borderRadius: 10, color: "var(--ink-dim)", fontSize: 13, lineHeight: 1.6}}>
                <span style={{color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em"}}>// HIRING</span><br/>
                Senior practitioners across AI Sec, AppSec, and Cloud â get in touch if you'd like to work with us.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="contact">
        <div className="container">
          <span className="eyebrow">Contact / 04</span>
          <h2 className="cta__title">
            Bring us your <em>hardest</em> security problem.
          </h2>
          <p className="cta__lede">
            Free 30-minute scoping call. We'll tell you whether we're the right fit, and what we'd actually do â not a generic statement of work.
          </p>
          <div className="cta__row">
            <a href="mailto:info@monsec.ca" className="btn-primary">
              <Icon name="mail"/> info@monsec.ca
            </a>
            <a href="https://www.linkedin.com/in/arvin-monie-495a1644/" target="_blank" rel="noreferrer" className="btn-ghost">
              <Icon name="linkedin"/> Reach out on LinkedIn
            </a>
          </div>
          <div style={{marginTop: 40, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em"}}>
            <span className="kbd">âµ</span> Toronto, Canada Â· Remote engagements worldwide
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a className="nav__logo">
                <LogoMark height={40}/>
              </a>
              <p className="footer__tagline">
                Tailored cybersecurity services. AI security, application security, DevSecOps,
                cloud, container, GRC.
              </p>
            </div>
            <div>
              <h4 className="footer__h">Services</h4>
              <div className="footer__links">
                <a href="#services">AI &amp; LLM Security</a>
                <a href="#services">Application Security</a>
                <a href="#services">DevSecOps</a>
                <a href="#services">Cloud Security</a>
                <a href="#services">Container &amp; K8s</a>
              </div>
            </div>
            <div>
              <h4 className="footer__h">Company</h4>
              <div className="footer__links">
                <a href="#approach">Approach</a>
                <a href="#about">Team</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="footer__h">Reach</h4>
              <div className="footer__links">
                <a href="mailto:info@monsec.ca">info@monsec.ca</a>
                <a href="https://www.linkedin.com/in/arvin-monie-495a1644/" target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>Â© 2026 MonSec. All rights reserved.</span>
            <span>// Tailored cybersecurity services for your business needs.</span>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {active && <ServiceModal service={active} onClose={() => setActive(null)}/>}

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Palette"
            value={t.theme}
            onChange={(v) => setTweak("theme", v)}
            options={["Green", "Ice", "Violet", "Amber"]}/>
        </TweakSection>
        <TweakSection label="Hero">
          <TweakToggle
            label="Animated network bg"
            value={t.showHeroNetwork}
            onChange={(v) => setTweak("showHeroNetwork", v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
