/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   SERVICE DATA — full catalog
   ============================================================ */
const SERVICES = [
  {
    id: "ai",
    num: "01",
    icon: "ai",
    span: 6,
    title: "AI & LLM Security",
    sub: "OWASP LLM Top 10, prompt-injection defense, METR & HELM evaluation, agentic guardrails.",
    tags: ["OWASP LLM", "HELM", "METR", "Guardrails"],
    blurb: "Threat modeling, red-teaming, and runtime defense for foundation models, RAG pipelines, and autonomous agents — mapped to OWASP LLM Top 10 and aligned with frontier evaluation methodologies.",
    offerings: [
      "OWASP LLM Top 10 assessment & remediation",
      "Prompt-injection & jailbreak red-team campaigns",
      "Model evaluation: METR autonomy + HELM holistic scoring",
      "Agent guardrails: tool gating, scope policies, sandboxing",
      "RAG pipeline: data lineage, retrieval poisoning defense",
      "Output filters: PII, secrets, copyright, toxicity"
    ],
    stack: ["Garak", "PyRIT", "Promptfoo", "Lakera", "Rebuff", "Guardrails AI", "NeMo", "Llama Guard"],
    compliance: ["NIST AI RMF", "ISO/IEC 42001", "EU AI Act", "OWASP LLM Top 10"],
    arch: "ai"
  },
  {
    id: "appsec",
    num: "02",
    icon: "appsec",
    span: 6,
    title: "Application Security",
    sub: "SAST, DAST, SCA, secrets, IaC. Find injection, deserialization, auth bypass — before they ship.",
    tags: ["SAST", "DAST", "SCA", "Threat Modeling"],
    blurb: "Code-level and runtime testing across the SDLC. We hunt injection, broken auth, deserialization, IDOR, and supply-chain risk — and stand up the tooling so your team can keep finding them.",
    offerings: [
      "Static analysis (SAST) on every PR with custom rules",
      "Dynamic application testing (DAST) against staging",
      "Software composition analysis & SBOM generation",
      "Secrets scanning across history & runtime",
      "Threat modeling — STRIDE/PASTA workshops",
      "Manual code review for crown-jewel paths"
    ],
    stack: ["Semgrep", "CodeQL", "Snyk", "OWASP ZAP", "Burp Suite", "Trivy", "Gitleaks", "Checkmarx"],
    compliance: ["OWASP ASVS", "OWASP Top 10", "PCI-DSS", "SOC 2"],
    arch: "appsec"
  },
  {
    id: "devsecops",
    num: "03",
    icon: "devsecops",
    span: 6,
    title: "DevSecOps & Secure SDLC",
    sub: "Shift-left security in GitHub Actions, Jenkins, GitLab CI. Policy-as-code, signed builds, supply chain.",
    tags: ["CI/CD", "Shift-Left", "SLSA", "Policy-as-Code"],
    blurb: "Embed security gates into your pipelines without slowing delivery. SLSA-aligned build provenance, signed artifacts, policy-as-code, and developer-friendly feedback that scales.",
    offerings: [
      "Pipeline hardening — GitHub Actions, Jenkins, GitLab",
      "Policy-as-code with OPA/Conftest, Kyverno",
      "Signed artifacts: Sigstore cosign, SLSA L3 provenance",
      "Pre-commit hooks & developer-feedback loops",
      "Vulnerability triage automation & SLA dashboards",
      "Secure SDLC training for engineering teams"
    ],
    stack: ["GitHub Actions", "GitLab CI", "Jenkins", "OPA", "Cosign", "in-toto", "Tekton", "ArgoCD"],
    compliance: ["SLSA L3", "NIST SSDF", "SOC 2 CC7"],
    arch: "devsecops"
  },
  {
    id: "cloud",
    num: "04",
    icon: "cloud",
    span: 6,
    title: "Cloud Security",
    sub: "AWS, Azure, GCP. CSPM, IAM rationalization, IaC scanning, attack-surface reduction.",
    tags: ["AWS", "Azure", "GCP", "CSPM"],
    blurb: "From landing zones to runtime — we harden cloud accounts against misconfiguration, privilege creep, and external exposure. CSPM, CIEM, and IaC scanning with humans behind the alerts.",
    offerings: [
      "CSPM continuous configuration audit",
      "IAM rationalization & least-privilege reviews",
      "Landing zone & SCP/Org policy design",
      "IaC scanning — Terraform, CloudFormation, Bicep",
      "Attack-surface mapping & exposure reduction",
      "Cloud incident-response readiness"
    ],
    stack: ["AWS Security Hub", "Azure Defender", "GCP SCC", "Prowler", "ScoutSuite", "Checkov", "tfsec", "Wiz"],
    compliance: ["CIS Benchmarks", "AWS Well-Architected", "FedRAMP", "ISO 27017"],
    arch: "cloud"
  },
  {
    id: "container",
    num: "05",
    icon: "container",
    span: 4,
    title: "Container & K8s",
    sub: "AKS, EKS, OpenShift. Image scanning, runtime security, admission control.",
    tags: ["Kubernetes", "OpenShift", "Runtime"],
    blurb: "Hardened clusters from registry to runtime. Image signing, admission policies, network segmentation, and eBPF-based runtime detection.",
    offerings: [
      "Image scanning + signing pipelines",
      "Admission control with OPA Gatekeeper / Kyverno",
      "Network policies & service-mesh segmentation",
      "Runtime detection — Falco, Tetragon",
      "Secret management — Vault, External Secrets",
      "CIS Kubernetes Benchmark hardening"
    ],
    stack: ["Falco", "Kyverno", "Gatekeeper", "Trivy", "Tetragon", "Cilium", "Vault", "OpenShift"],
    compliance: ["CIS Kubernetes", "NSA/CISA Hardening", "PCI-DSS"],
    arch: "container"
  },
  {
    id: "arch",
    num: "06",
    icon: "arch",
    span: 4,
    title: "Security Architecture",
    sub: "Zero Trust, identity, network segmentation, crypto agility, reference patterns.",
    tags: ["Zero Trust", "Identity", "Crypto"],
    blurb: "Long-horizon design work: target-state architectures, transition roadmaps, and reference patterns your engineers can build against.",
    offerings: [
      "Zero Trust architecture & roadmap",
      "Identity & access architecture",
      "Network segmentation strategy",
      "Crypto-agility & PQC readiness",
      "Reference patterns library",
      "Architecture review board enablement"
    ],
    stack: ["Okta", "Entra ID", "Tailscale", "Cloudflare ZT", "HashiCorp Vault"],
    compliance: ["NIST 800-207", "SABSA", "TOGAF"],
    arch: "arch"
  },
  {
    id: "grc",
    num: "07",
    icon: "grc",
    span: 4,
    title: "GRC & Compliance",
    sub: "SOC 2, ISO 27001, PCI-DSS readiness. Risk register, policy authoring, audit support.",
    tags: ["SOC 2", "ISO 27001", "PCI-DSS"],
    blurb: "Pragmatic governance — controls that map to real engineering practice, not paperwork theater. Audit-ready evidence collection without drowning your team.",
    offerings: [
      "Readiness assessments — SOC 2, ISO 27001, PCI",
      "Policy & control authoring",
      "Risk register & treatment plans",
      "Continuous compliance monitoring",
      "Audit liaison & evidence collection",
      "Vendor risk management programs"
    ],
    stack: ["Drata", "Vanta", "OneTrust", "ServiceNow IRM"],
    compliance: ["SOC 2", "ISO 27001", "PCI-DSS", "HIPAA", "NIST CSF"],
    arch: "grc"
  }
];

window.SERVICES = SERVICES;
