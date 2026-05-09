/* global React, Icon, Arch, PromptInjectionDemo, OwaspLLMChecklist, HelmDashboard, CodeFindings, PipelineDemo, CspmDashboard, RuntimeDemo, ZTPostureDemo, ComplianceMatrix */
const { useState, useEffect } = React;

/* ============================================================
   Per-service tab definitions
   ============================================================ */
const TABS = {
  ai: [
    { id: "arch",  label: "Architecture",   render: () => <Arch kind="ai"/> },
    { id: "demo",  label: "Prompt-Injection Demo", render: () => <PromptInjectionDemo/> },
    { id: "owasp", label: "OWASP LLM Top 10", render: () => <OwaspLLMChecklist/> },
    { id: "eval",  label: "HELM + METR",     render: () => <HelmDashboard/> }
  ],
  appsec: [
    { id: "arch", label: "Architecture", render: () => <Arch kind="appsec"/> },
    { id: "code", label: "Code Findings", render: () => <CodeFindings/> },
    { id: "owasp", label: "OWASP LLM Top 10", render: () => <OwaspLLMChecklist/> }
  ],
  devsecops: [
    { id: "arch",  label: "Architecture", render: () => <Arch kind="devsecops"/> },
    { id: "pipe",  label: "Pipeline Run", render: () => <PipelineDemo/> },
    { id: "code",  label: "PR Gate Findings", render: () => <CodeFindings/> }
  ],
  cloud: [
    { id: "arch", label: "Architecture", render: () => <Arch kind="cloud"/> },
    { id: "cspm", label: "CSPM Dashboard", render: () => <CspmDashboard/> }
  ],
  container: [
    { id: "arch", label: "Architecture", render: () => <Arch kind="container"/> },
    { id: "runtime", label: "Runtime Detection", render: () => <RuntimeDemo/> }
  ],
  arch: [
    { id: "arch", label: "Architecture", render: () => <Arch kind="arch"/> },
    { id: "post", label: "Zero Trust Posture", render: () => <ZTPostureDemo/> }
  ],
  grc: [
    { id: "arch", label: "Architecture", render: () => <Arch kind="grc"/> },
    { id: "matrix", label: "Compliance Matrix", render: () => <ComplianceMatrix/> }
  ]
};

window.TABS = TABS;

/* ============================================================
   MODAL — service deep-dive
   ============================================================ */
const ServiceModal = ({ service, onClose }) => {
  const tabs = TABS[service.id] || TABS.ai;
  const [tab, setTab] = useState(tabs[0].id);

  // close on Esc, prevent body scroll
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const active = tabs.find(t => t.id === tab) || tabs[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close"><Icon name="close" width="16" height="16"/></button>
        <div className="modal__head">
          <div className="icon"><Icon name={service.icon}/></div>
          <div>
            <div className="num">SERVICE / {service.num} — {service.id.toUpperCase()}</div>
            <h2>{service.title}</h2>
            <p>{service.blurb}</p>
          </div>
        </div>
        <div className="modal__body">
          <div className="modal__main">
            <div className="tabs">
              {tabs.map((t, i) => (
                <button key={t.id} className={`tab ${tab === t.id ? 'tab--active' : ''}`} onClick={() => setTab(t.id)}>
                  <span className="tab__num">0{i+1}</span>{t.label}
                </button>
              ))}
            </div>
            <div className="demo-panel">
              {active.render()}
            </div>
          </div>
          <aside className="modal__side">
            <div className="side__h">What we deliver</div>
            <div className="side__list">
              {service.offerings.map((o, i) => (
                <div key={i} className="item">
                  <span className="check"><Icon name="check" width="14" height="14"/></span>
                  <span>{o}</span>
                </div>
              ))}
            </div>
            <div className="side__h">Tooling</div>
            <div className="side__chips">
              {service.stack.map(s => <span key={s} className="side__chip">{s}</span>)}
            </div>
            <div className="side__h">Frameworks & standards</div>
            <div className="side__compliance">
              {service.compliance.map(c => (
                <div key={c} className="row"><span className="dot"/>{c}</div>
              ))}
            </div>
            <div style={{marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)"}}>
              <a href="#contact" onClick={onClose} className="btn-primary" style={{width: "100%", justifyContent: "center"}}>
                Engage MonSec <Icon name="arrowUR"/>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

window.ServiceModal = ServiceModal;
