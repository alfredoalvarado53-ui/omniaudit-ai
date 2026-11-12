# OmniAudit AI — Enterprise Hybrid Contract & Compliance Studio

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Google BuildHybridAI 2026](https://img.shields.io/badge/Google-BuildHybridAI_2026-4285F4.svg?logo=google)](https://firebasehybridaihackathon.devpost.com/)
[![Built for Chrome Built-in AI](https://img.shields.io/badge/Chrome_Built--in_AI-Gemini_Nano-34A853.svg?logo=googlechrome)](https://developer.chrome.com/docs/ai/built-in)
[![Firebase AI Logic](https://img.shields.io/badge/Firebase_AI_Logic-Hybrid_Inference-FFCA28.svg?logo=firebase)](https://firebase.google.com/docs/ai-logic)

> **Live Demo:** [https://alfredoalvarado53-ui.github.io/omniaudit-ai/](https://alfredoalvarado53-ui.github.io/omniaudit-ai/)

OmniAudit AI is an enterprise-grade legal & compliance workstation inspired by **Ironclad AI Assist**, **Robin AI**, and **LegalOn**. Designed for the **#BuildHybridAI 2026 Hackathon**, it combines local on-device privacy (via Chrome Built-in AI / Gemini Nano) with cloud synthesis (via Firebase AI Logic / Gemini 1.5 Flash).

---

## 🚀 Key Features

* **Auto-Sensing Hybrid Topology:** Automatically listens to 
avigator.onLine and network telemetry. When offline or processing sensitive/PII data, execution shifts automatically to on-device Gemini Nano with 0 bytes transmitted over the wire.
* **Corporate Playbooks Library:** Audit against SaaS Vendor Agreements, GDPR/DPA Data Protection, Enterprise NDAs, or SOC2 Compliance standards.
* **Interactive Risk Matrix & Health Scoring:** Real-time 0–100 compliance health meter with dynamic color ramps and categorical risk breakdown (Critical, High, Medium, Low).
* **Smart Redline Comparison Studio:** Side-by-side clause revision displaying counterparty drafts vs. attorney-approved revisions with inline strike-throughs and amendment insertions.
* **Client-Side PII Redaction Table:** Transparently highlights redacted emails, bank accounts, and corporate identifiers before any processing occurs.

---

## 🏛 Architecture

`mermaid
flowchart TD
    A[Contract Ingestion: Text or Drag-and-Drop] --> B[Client-Side Privacy Engine]
    B --> C[PII Redaction: Emails, Cards, Identifiers]
    C --> D{Network Telemetry & Connectivity}
    D -- Offline or Sensitive Mode --> E[On-Device Gemini Nano: Chrome Built-in AI]
    D -- Online Standard Mode --> F[Firebase AI Logic: Gemini 1.5 Flash]
    E --> G[Standardized Audit Synthesis]
    F --> G
    G --> H[Risk Matrix & Score]
    G --> I[Ironclad-Style Redline Engine]
    G --> J[Executive Audit Report & Export]
`

---

## 🛠 Getting Started

1. Visit the live platform: [https://alfredoalvarado53-ui.github.io/omniaudit-ai/](https://alfredoalvarado53-ui.github.io/omniaudit-ai/)
2. To test Chrome Built-in AI locally:
   * Open chrome://flags in Chrome Canary/Dev.
   * Enable #prompt-api-for-gemini-nano and #optimization-guide-on-device-model.
   * Relaunch Chrome.
3. Select a corporate playbook or sample contract, and click **Ejecutar Auditoría Híbrida**.

---

## 📄 License
Licensed under the [Apache License, Version 2.0](LICENSE).
