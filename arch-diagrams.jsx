/* global React, Icon */
const { useState, useEffect, useRef } = React;

/* ============================================================
   ARCHITECTURE DIAGRAMS — one per service
   Each is an interactive SVG with hoverable nodes.
   ============================================================ */
const Arch = ({ kind }) => {
  const [active, setActive] = useState(null);
  const map = ARCH_DATA[kind] || ARCH_DATA.ai;
  const node = active ? map.nodes.find(n => n.id === active) : null;
  return (
    <div className="archviz">
      <div className="archviz__grid"/>
      <div className="archviz__hint">SCHEMATIC // hover nodes</div>
      <svg viewBox="0 0 720 360" preserveAspectRatio="xMidYMid meet">
        {/* connections */}
        {map.edges.map((e, i) => {
          const a = map.nodes.find(n => n.id === e[0]);
          const b = map.nodes.find(n => n.id === e[1]);
          if (!a || !b) return null;
          const isActive = active && (active === e[0] || active === e[1]);
          return (
            <g key={i}>
              <path d={`M ${a.x+a.w/2} ${a.y+a.h/2} L ${b.x+b.w/2} ${b.y+b.h/2}`}
                    className="archviz__connection"
                    style={{ stroke: isActive ? "var(--accent)" : undefined, opacity: isActive ? 1 : 0.6 }}/>
              {isActive && (
                <circle r="3" className="archviz__flow">
                  <animateMotion dur="1.4s" repeatCount="indefinite"
                                 path={`M ${a.x+a.w/2} ${a.y+a.h/2} L ${b.x+b.w/2} ${b.y+b.h/2}`}/>
                </circle>
              )}
            </g>
          );
        })}
        {/* nodes */}
        {map.nodes.map(n => (
          <g key={n.id}
             className={`archviz__node ${active === n.id ? 'archviz__node--active' : ''}`}
             onMouseEnter={() => setActive(n.id)}
             onClick={() => setActive(n.id)}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="6"/>
            <text x={n.x + n.w/2} y={n.y + n.h/2 - 2} textAnchor="middle">{n.label}</text>
            <text x={n.x + n.w/2} y={n.y + n.h/2 + 12} textAnchor="middle" className="sub">{n.kind}</text>
          </g>
        ))}
      </svg>
      <div className="archviz__detail">
        {node ? <>
          <div className="name">{node.label}</div>
          <div className="desc">{node.detail}</div>
        </> : <>
          <div className="name" style={{color: "var(--ink-faint)"}}>—</div>
          <div className="desc" style={{color: "var(--ink-faint)"}}>Hover or tap a node to inspect controls and tooling.</div>
        </>}
      </div>
    </div>
  );
};

const ARCH_DATA = {
  ai: {
    nodes: [
      { id:"u",   label:"User",          kind:"INPUT",     x:20,  y:150, w:96, h:54, detail:"Untrusted prompt source. Apply rate limiting, identity binding, and per-tenant scope." },
      { id:"in",  label:"Input Filter",  kind:"GUARD",     x:148, y:150, w:120, h:54, detail:"Prompt-injection detection, jailbreak heuristics, classifier ensemble (Lakera, Llama Guard)." },
      { id:"llm", label:"LLM Core",      kind:"MODEL",     x:300, y:60,  w:120, h:54, detail:"System-prompt hardening, content policies, tool-use authorization, structured output enforcement." },
      { id:"rag", label:"RAG Store",     kind:"DATA",      x:300, y:240, w:120, h:54, detail:"Retrieval poisoning defense, source provenance, ACL enforcement on chunks before context injection." },
      { id:"agt", label:"Agent / Tools", kind:"EXECUTE",   x:452, y:60,  w:120, h:54, detail:"Tool gating, scope policies, sandboxed execution, write-action quorum, action receipts." },
      { id:"out", label:"Output Filter", kind:"GUARD",     x:452, y:240, w:120, h:54, detail:"PII / secrets redaction, copyright filter, hallucination grounding check, toxicity scoring." },
      { id:"obs", label:"Observability", kind:"TELEMETRY", x:600, y:150, w:100, h:54, detail:"HELM scenarios + METR autonomy benchmarks. Drift, jailbreak rate, refusal rate, cost-per-incident." }
    ],
    edges: [["u","in"],["in","llm"],["in","rag"],["llm","agt"],["llm","out"],["rag","llm"],["agt","obs"],["out","obs"]]
  },
  appsec: {
    nodes: [
      { id:"dev",  label:"Developer",    kind:"SOURCE",   x:20,  y:150, w:100, h:54, detail:"IDE plugins surface findings inline. Pre-commit secrets scan blocks at the door." },
      { id:"git",  label:"Git Repo",     kind:"SCM",      x:152, y:150, w:100, h:54, detail:"Branch protection, signed commits, CODEOWNERS gating, dependency review on PR." },
      { id:"sast", label:"SAST",         kind:"STATIC",   x:284, y:60,  w:100, h:54, detail:"Semgrep + CodeQL with custom rules. Findings posted as PR review comments." },
      { id:"sca",  label:"SCA + SBOM",   kind:"SUPPLY",   x:284, y:150, w:100, h:54, detail:"Snyk + Trivy. CycloneDX SBOM emitted per build. License + CVE policy enforced." },
      { id:"sec",  label:"Secrets",      kind:"SCAN",     x:284, y:240, w:100, h:54, detail:"Gitleaks + TruffleHog full history sweep, plus pre-commit + CI gates." },
      { id:"dast", label:"DAST",         kind:"DYNAMIC",  x:416, y:150, w:100, h:54, detail:"OWASP ZAP authenticated crawls. Burp Pro for crown-jewel deep dives." },
      { id:"asoc", label:"AppSec Orch.", kind:"AGGREGATE", x:548, y:150, w:120, h:54, detail:"DefectDojo. Dedupe, triage, SLA tracking. Risk-scored backlog into Jira." }
    ],
    edges: [["dev","git"],["git","sast"],["git","sca"],["git","sec"],["sast","asoc"],["sca","asoc"],["sec","asoc"],["dast","asoc"]]
  },
  devsecops: {
    nodes: [
      { id:"src",   label:"Source",       kind:"COMMIT",     x:20,  y:150, w:90, h:54, detail:"Pre-commit hooks: secrets, lint, signed commits via gitsign." },
      { id:"pr",    label:"PR Gate",      kind:"CHECK",      x:140, y:150, w:90, h:54, detail:"Required checks: SAST, SCA, license, IaC. Bot summarizes risk-delta on every diff." },
      { id:"build", label:"Build",        kind:"CI",         x:260, y:150, w:90, h:54, detail:"GitHub Actions / GitLab CI. Hermetic, reproducible. SLSA provenance attached." },
      { id:"sign",  label:"Sign + SBOM",  kind:"SUPPLY",     x:380, y:60,  w:110, h:54, detail:"Cosign keyless signing + CycloneDX SBOM. in-toto attestations stored alongside artifact." },
      { id:"reg",   label:"Registry",     kind:"ARTIFACT",   x:380, y:240, w:110, h:54, detail:"Signed images only. Policy controller blocks unsigned or out-of-policy pulls." },
      { id:"opa",   label:"Policy Engine", kind:"OPA",       x:520, y:150, w:110, h:54, detail:"OPA / Conftest. Policy-as-code enforced at admission. Decision logs to SIEM." },
      { id:"depl",  label:"Deploy",       kind:"GITOPS",     x:650, y:150, w:50, h:54, detail:"ArgoCD / Flux. Drift-detection. Production deploys behind change windows + on-call sign-off." }
    ],
    edges: [["src","pr"],["pr","build"],["build","sign"],["build","reg"],["sign","opa"],["reg","opa"],["opa","depl"]]
  },
  cloud: {
    nodes: [
      { id:"org",  label:"Organization", kind:"ROOT",     x:20,  y:150, w:110, h:54, detail:"AWS Organizations / Azure Mgmt Groups / GCP Org. SCP and policy guardrails set at the root." },
      { id:"id",   label:"Identity",     kind:"IAM",      x:160, y:60,  w:110, h:54, detail:"IdP federation, MFA enforced, just-in-time elevated access via PIM/AccessHub." },
      { id:"acct", label:"Accounts",     kind:"WORKLOAD", x:160, y:240, w:110, h:54, detail:"Per-team isolation. Landing-zone baseline, baseline guardrails inherited." },
      { id:"cspm", label:"CSPM",         kind:"AUDIT",    x:300, y:150, w:110, h:54, detail:"Continuous config audit. CIS benchmark drift. Findings routed by severity SLA." },
      { id:"iac",  label:"IaC Gate",     kind:"PRE-DEPLOY", x:440, y:60, w:110, h:54, detail:"Checkov + tfsec at PR. Block dangerous diffs (public buckets, 0.0.0.0/0, plaintext secrets)." },
      { id:"asm",  label:"Attack Surface", kind:"EXTERNAL", x:440, y:240, w:120, h:54, detail:"Continuous external-asset discovery. Public exposure heatmap. Cert + DNS hygiene." },
      { id:"siem", label:"SIEM",         kind:"DETECT",   x:590, y:150, w:110, h:54, detail:"CloudTrail / Defender / SCC events into central SIEM. Threat detection rules + IR playbooks." }
    ],
    edges: [["org","id"],["org","acct"],["id","cspm"],["acct","cspm"],["cspm","iac"],["cspm","asm"],["iac","siem"],["asm","siem"]]
  },
  container: {
    nodes: [
      { id:"src", label:"Dockerfile",     kind:"SOURCE",    x:20,  y:150, w:110, h:54, detail:"Distroless base, non-root, no secrets baked. Hadolint enforced in CI." },
      { id:"sc",  label:"Image Scan",     kind:"SCAN",      x:160, y:150, w:100, h:54, detail:"Trivy + Grype. CVE + license + misconfig. Block on Critical/High by default." },
      { id:"sgn", label:"Sign",           kind:"SUPPLY",    x:290, y:150, w:90, h:54, detail:"Cosign keyless. Verified at admission — unsigned = denied." },
      { id:"reg", label:"Registry",       kind:"STORE",     x:410, y:150, w:90, h:54, detail:"Signed images, SBOM attached, retention policy on stale tags." },
      { id:"adm", label:"Admission",      kind:"GATE",      x:530, y:60, w:110, h:54, detail:"Kyverno / OPA Gatekeeper. PodSecurity Standards. NetworkPolicy required." },
      { id:"rt",  label:"Runtime",        kind:"DEFEND",    x:530, y:240, w:110, h:54, detail:"Falco / Tetragon. eBPF kernel-level detection. Anomalous syscalls quarantined." },
      { id:"obs", label:"Telemetry",      kind:"OBSERVE",   x:670, y:150, w:30, h:54, detail:"Audit logs, runtime events, process trees → SIEM. SOAR playbooks for known TTPs." }
    ],
    edges: [["src","sc"],["sc","sgn"],["sgn","reg"],["reg","adm"],["reg","rt"],["adm","obs"],["rt","obs"]]
  },
  arch: {
    nodes: [
      { id:"u",   label:"User",          kind:"PRINCIPAL", x:20,  y:150, w:90, h:54, detail:"Identity bound to device posture. Continuous re-auth. No implicit trust by network position." },
      { id:"id",  label:"Identity",      kind:"IDP",       x:140, y:150, w:90, h:54, detail:"SSO + MFA, conditional access, risk-based step-up. JIT privilege via PAM." },
      { id:"pep", label:"PEP",           kind:"ENFORCE",   x:260, y:60,  w:110, h:54, detail:"Policy enforcement points: ZTNA gateway, service mesh, API gateway. Per-request decision." },
      { id:"pdp", label:"PDP",           kind:"DECIDE",    x:260, y:240, w:110, h:54, detail:"Policy decision point. OPA / Cedar evaluating identity, device, intent, sensitivity." },
      { id:"app", label:"Workload",      kind:"RESOURCE",  x:400, y:150, w:110, h:54, detail:"Microsegmented. Mutual TLS. Secrets via Vault. No standing creds." },
      { id:"crypto", label:"Crypto Svc", kind:"KMS",       x:540, y:60,  w:120, h:54, detail:"Centralized KMS. Key rotation. PQC-ready algorithms staged. HSM-backed roots." },
      { id:"audit", label:"Audit",       kind:"OBSERVE",   x:540, y:240, w:120, h:54, detail:"Every decision logged. Immutable audit trail. Real-time anomaly detection." }
    ],
    edges: [["u","id"],["id","pep"],["id","pdp"],["pep","app"],["pdp","pep"],["app","crypto"],["app","audit"]]
  },
  grc: {
    nodes: [
      { id:"reg", label:"Regulations",  kind:"INPUT",   x:20,  y:60,  w:110, h:54, detail:"SOC 2, ISO 27001, PCI-DSS, HIPAA. Mapped against unified control set." },
      { id:"risk", label:"Risk Register", kind:"REGISTER", x:20, y:240, w:110, h:54, detail:"Threats × assets × likelihood. Scored, owned, treated. Reviewed quarterly." },
      { id:"ctrl", label:"Control Set", kind:"CATALOG", x:170, y:150, w:110, h:54, detail:"Unified controls. One implementation, many frameworks satisfied." },
      { id:"pol",  label:"Policy",      kind:"DOCUMENT", x:310, y:60, w:110, h:54, detail:"Authored, versioned, reviewed. Signed by owner. Acknowledgement tracked." },
      { id:"evid", label:"Evidence",    kind:"COLLECT",  x:310, y:240, w:110, h:54, detail:"Continuous collection from cloud, IdP, CI. Auditor portal, no spreadsheet hunts." },
      { id:"audit", label:"Audit",      kind:"REVIEW",   x:460, y:150, w:110, h:54, detail:"Internal pre-audit + external attestation. Findings tracked to remediation." },
      { id:"vrm", label:"Vendor Risk",  kind:"THIRDPARTY", x:600, y:150, w:100, h:54, detail:"Vendor inventory, security questionnaires, SOC 2 review cadence, breach watch." }
    ],
    edges: [["reg","ctrl"],["risk","ctrl"],["ctrl","pol"],["ctrl","evid"],["pol","audit"],["evid","audit"],["audit","vrm"]]
  }
};

window.Arch = Arch;
