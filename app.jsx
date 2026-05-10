/* global React, ReactDOM, Icon, LogoMark, HeroNetwork, HeroViz, SERVICES, ServiceModal, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle */
const { useState, useEffect, useRef } = React;

const APPROACH = [
  { num: "01", title: "Discover",  body: "Crown-jewel mapping, threat-model workshops, current-state assessment against the relevant control set.", deliv: ["Asset & data-flow inventory", "Threat-model artifacts", "Gap analysis"] },
  { num: "02", title: "Design",    body: "Reference architectures and policy-as-code that fits your stack. No 100-page Word docs nobody reads.", deliv: ["Target architecture", "Policy-as-code repo", "Roadmap & RACI"] },
  { num: "03", title: "Implement", body: "We embed with your engineers — pipelines, scanners, runtime defense, evidence collection wired in.", deliv: ["Hardened pipelines", "Scanner integrations", "Audit-ready evidence"] },
  { num: "04", title: "Operate",   body: "Triage cadence, on-call enablement, drift detection. Hand-over plan written from day one.", deliv: ["Runbooks", "On-call training", "Quarterly reviews"] }
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
            <LogoMark height={60}/>
          </a>
          <div className="nav__links">
            <NavDropdown num="01" label="Services" wide onItemClick={() => {}}>
              {SERVICES.map(s => (
                <DDItem key={s.id} icon={s.icon} name={s.title} sub={s.sub.split(".")[0] + "."}
                        onClick={() => { setActive(s); }}/>
              ))}
              <div className="nav__dd-foot">
                <span>7 practice areas</span>
                <a href="#services" style={{color: "var(--accent)"}}>View all →</a>
              </div>
            </NavDropdown>
            <NavDropdown num="02" label="Approach">
              {APPROACH.map(a => (
                <DDItem key={a.num} num={a.num} name={a.title} sub={a.body.slice(0, 70) + "…"}
                        href={"#approach"}/>
              ))}
            </NavDropdown>
            <NavDropdown num="03" label="About">
              <DDItem icon="ai" name="Arvin Monie" sub="Founder & Principal Security Architect" href="#about"/>
              <DDItem icon="arch" name="The Team" sub="Senior practitioners across AI, AppSec, Cloud" href="#about"/>
              <DDItem icon="linkedin" name="LinkedIn" sub="Connect with Arvin" href="https://www.linkedin.com/in/arvin-monie-495a1644/"/>
            </NavDropdown>
            <NavDropdown num="04" label="Contact">
              <DDItem icon="mail" name="support@monsec.ca" sub="Direct line — replies same business day" href="mailto:support@monsec.ca"/>
              <DDItem icon="linkedin" name="LinkedIn DM" sub="Reach Arvin on LinkedIn" href="https://www.linkedin.com/in/arvin-monie-495a1644/"/>
            </NavDropdown>
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
                <span className="dot"/>v.2026.05 — accepting new engagements
              </span>
              <h1 className="hero__title">
                Security for the <em>AI-native</em><br/>
                <span className="underline">stack you actually ship.</span>
              </h1>
              <p className="hero__lede">
                MonSec is a specialist consultancy for AI &amp; LLM security, application security,
                DevSecOps, and cloud. We embed with your engineers, harden the systems
                that matter, and leave your team running the controls — not us.
              </p>
              <div className="hero__ctas">
                <a href="#services" className="btn-primary">Explore services <Icon name="arrow"/></a>
                <a href="#contact" className="btn-ghost">Talk to a security engineer</a>
              </div>
              <div className="hero__meta">
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
                Each area opens an interactive workspace — architecture diagram, live demos,
                tooling stack, control mappings. Same view your engineers will work from.
              </p>
            </div>
          </div>

          <div className="services-grid">
            {SERVICES.map(s => (
              <button key={s.id} className="service-card" data-span={s.span} onClick={() => setActive(s)}>
                <div className="service-card__num">{s.num} / {s.tags.join(" · ")}</div>
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
                Domain experts, <em>matched to engagement.</em>
              </h2>
              <p className="section__lede">
                MonSec is a senior practitioner team with deep expertise across each
                of our seven practice areas. Engagements are staffed against client
                requirements, scope, and regulatory context.
              </p>
            </div>
          </div>
          <div className="about">
            <div className="about__profile">
              <div className="about__photo">
                <img src="assets/arvin.jpeg" alt="Arvin Monie"/>
              </div>
              <h3 className="about__name">Arvin Monie</h3>
              <div className="about__role">Founder · Principal Security Architect</div>
              <p className="about__bio">
                Twenty-plus years across application security, cloud, and AI. I've led security
                programs at enterprises and high-velocity engineering orgs — embedding scanners
                in pipelines, hardening AWS/Azure/GCP estates, and most recently building
                guardrails for LLM and agentic systems.
              </p>
              <p className="about__bio" style={{marginTop: 12}}>
                MonSec exists because the gap between "secure SDLC slides" and "actually
                shipping safe AI" is wider than ever — and bridging it needs engineers
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
              <div className="team-summary__eyebrow">Practice expertise</div>
              <p className="team-summary__lede">
                Our consultants are credentialed senior engineers and architects, each
                specialised in their domain. Every engagement is led by a practice owner
                accountable for scope, delivery, and outcomes.
              </p>
              <div className="team-summary__grid">
                {[
                  { name: "AI & LLM Security",      ref: "Practice / 01" },
                  { name: "Application Security",   ref: "Practice / 02" },
                  { name: "DevSecOps & SDLC",       ref: "Practice / 03" },
                  { name: "Cloud Security",         ref: "Practice / 04" },
                  { name: "Container & Kubernetes", ref: "Practice / 05" },
                  { name: "Security Architecture",  ref: "Practice / 06" },
                  { name: "GRC & Compliance",       ref: "Practice / 07" }
                ].map(p => (
                  <div key={p.name} className="team-summary__cell">
                    <div className="team-summary__ref">{p.ref}</div>
                    <div className="team-summary__name">{p.name}</div>
                  </div>
                ))}
              </div>
              <div className="team-summary__note">
                <span className="team-summary__note-tag">// ENGAGEMENT MODEL</span>
                MonSec assembles a tailored team for each client based on technical
                scope, industry, and compliance posture. Sub-contracted specialists
                may be engaged under MonSec's confidentiality and quality controls
                where deep niche expertise is required.
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
            Free 30-minute scoping call. We'll tell you whether we're the right fit, and what we'd actually do — not a generic statement of work.
          </p>
          <div className="cta__row">
            <a href="mailto:support@monsec.ca" className="btn-primary">
              <Icon name="mail"/> support@monsec.ca
            </a>
            <a href="https://www.linkedin.com/in/arvin-monie-495a1644/" target="_blank" rel="noreferrer" className="btn-ghost">
              <Icon name="linkedin"/> Reach out on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a className="nav__logo">
                <LogoMark height={52}/>
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
                <a href="mailto:support@monsec.ca">support@monsec.ca</a>
                <a href="https://www.linkedin.com/in/arvin-monie-495a1644/" target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 MonSec. All rights reserved.</span>
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
