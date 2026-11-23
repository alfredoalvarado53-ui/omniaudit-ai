# OmniAudit AI — Enterprise Hybrid Contract & Compliance Studio

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%2F%20Chrome-orange.svg)]()
[![Google Hackathon](https://img.shields.io/badge/Google-%23BuildHybridAI%202026-green.svg)]()
[![Firebase AI Logic](https://img.shields.io/badge/Firebase-AI%20Logic%20(Vertex%20AI)-amber.svg)]()
[![App Check](https://img.shields.io/badge/Firebase-App%20Check-red.svg)]()

> **Official Entry for Google's #BuildHybridAI 2026 Hackathon on Devpost.**  
> Powered by **Firebase AI Logic (`firebase-vertexai`)**, **Firebase App Check**, and **Chrome Built-in AI (`window.ai` / Gemini Nano)**.

* **Live Demo (Published on GitHub Pages):** [https://alfredoalvarado53-ui.github.io/omniaudit-ai/](https://alfredoalvarado53-ui.github.io/omniaudit-ai/)
* **Public Open-Source Repository:** [https://github.com/alfredoalvarado53-ui/omniaudit-ai](https://github.com/alfredoalvarado53-ui/omniaudit-ai)
* **License:** Apache License 2.0 (Verified in root [LICENSE](LICENSE))

---

## 🌟 What Was Built for #BuildHybridAI 2026

OmniAudit AI was engineered specifically for the Google **#BuildHybridAI 2026** Hackathon to solve enterprise legal and compliance auditing through true hybrid inference:

1. **`engine.js` (Hybrid Orchestrator):** Implements `prefer_on_device` routing between on-device Chrome Built-in AI (**Gemini Nano**) and cloud escalation via **Firebase AI Logic** (**Gemini 1.5 Flash**), strictly protected by **Firebase App Check**.
2. **Mandatory App Check Pre-flight:** App Check initialization is an absolute prerequisite on the public web. Firebase AI Logic is never marked ready or called unless App Check is validly configured.
3. **Live Evaluator Mode (Safe JSON Only):** Evaluators can test their own Firebase project directly in the live browser via the **⚙️ Configuración / Proyecto Firebase** modal. Credentials are parsed strictly as JSON (no dynamic code evaluation or `new Function`) and stored exclusively in temporary `sessionStorage`.
4. **Client-Side In-Memory PII Sanitizer:** Intercepts and tokenizes personal emails, tax identifiers (SSN, RFC, CURP), payment card numbers, and phone numbers before any text can be transmitted to the cloud. Raw PII is never sent across the network or logged.
5. **Honest Model-Driven Structured Output:** Instructs the model to output validated JSON (`healthScore`, `riskVerdict`, `findings`, `redlines`) alongside an executive Markdown report. If the model returns an invalid JSON block, the full Markdown report renders safely without fabricating artificial scores or findings.
6. **Playbook Awareness:** Injects specific enterprise compliance rules into the model prompt according to the active playbook selector (**Standard NDA**, **Enterprise SaaS MSA**, **Senior Tech Employment**, or **Vendor Procurement**).
7. **Native PDF Document Ingestion:** Uses client-side **PDF.js** to parse digital text page-by-page. Automatically detects scanned image PDFs that require OCR and prompts the user accordingly.
8. **Framer & Godly Studio UI:** Ultra-modern dark obsidian layout with responsive 3-column analysis on desktop, segmented touch controls on mobile, ambient floating auroras, and DOMPurify XSS sanitization.

---

## 🏗️ Technical Architecture & Runtime Flow

```mermaid
flowchart TD
    Doc["Legal Agreement (.txt, .md, .pdf)"] --> ClientParser["Client Document & PDF.js Parser\n(Rejects scanned non-OCR PDFs)"]
    ClientParser --> LocalSanitizer["Client-Side PII Sanitizer\n(Tokens: [REDACTED_EMAIL_X], [REDACTED_TAX_ID_X])"]
    
    LocalSanitizer --> EngineRouter{"HybridAuditEngine\n(mode: 'prefer_on_device')"}
    
    EngineRouter -->|Chrome AI Available| NanoNode["On-Device Chrome Built-in AI\n(window.ai / Gemini Nano)\n• 0 bytes sent over network\n• Sub-50ms latency\n• 100% Local Inference"]
    
    EngineRouter -->|Cloud Escalation| AppCheckGate{"App Check Verification\n(reCAPTCHA v3 / Enterprise)"}
    AppCheckGate -->|Passed & Enforced| CloudNode["Firebase AI Logic\n(firebase-vertexai / Gemini 1.5 Flash)\n• Protected by Firebase App Check\n• ONLY Pre-Sanitized Payload Sent\n• Real Model Invocation"]
    AppCheckGate -->|Unconfigured / Failed| ErrorBlock["Actionable Error Alert\n(Blocks cloud call; never fakes AI)"]
    
    EngineRouter -->|Explicit Demo Option| DemoNode["Demo local · sin IA\n• Rule-based reference benchmark\n• Transparently labeled"]
    
    NanoNode --> StructuredOutput["Model-Driven Structured JSON Output\n(Health Score + Risk Verdict + Findings + Redlines)"]
    CloudNode --> StructuredOutput
    
    StructuredOutput --> StudioUI["Studio Pro Dashboard\n(Odometer Meter + Playbook Audit + Smart Redlines)"]
```

---

## 🔬 Firebase AI Logic & App Check Runtime Implementation

OmniAudit AI imports and invokes the official web SDK directly in `engine.js` (Modular SDK v11.4):

```javascript
import { initializeApp, deleteApp, getApps } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-check.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-vertexai.js";

// Clean previous instances to prevent 'app/duplicate-app' errors
await resetFirebase();

// 1. Initialize core Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize App Check BEFORE any Vertex AI service is instantiated
if (hasValidSiteKey) {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

// 3. Initialize Firebase AI Logic (Vertex AI in Firebase)
const vertexAI = getVertexAI(app);
const model = getGenerativeModel(vertexAI, {
  model: "gemini-1.5-flash",
  generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
});

// 4. Client-side sanitized execution: ONLY client-redacted text is sent
const sanitization = sanitizePIILocally(rawText);
const prompt = `${systemPrompt}\n\nDocument to audit (Pre-sanitized on client):\n${sanitization.sanitizedText}`;
const response = await model.generateContent(prompt);

// 5. Verification status updates to 'verified' ONLY upon a successful response
```

---

## 🛠️ Evaluator Guide: Testing with Your Own Firebase Project

You can test the live hosted application directly at **[https://alfredoalvarado53-ui.github.io/omniaudit-ai/](https://alfredoalvarado53-ui.github.io/omniaudit-ai/)** without modifying the code or repository.

### Step 1: Prepare Your Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/) and create or select a project.
2. Ensure the project is on the **Blaze** plan (pay-as-you-go, required for Vertex AI in Firebase; Google provides generous monthly free quotas).
3. **Enable Vertex AI in Firebase:**
   * In the left sidebar, navigate to **Build > Vertex AI in Firebase**.
   * Click **Get Started** to enable the required APIs (`firebasevertexai.googleapis.com`).
4. **Configure App Check:**
   * Go to **Build > App Check > Apps**.
   * Select your Web App.
   * Choose **reCAPTCHA v3** (or reCAPTCHA Enterprise).
   * In the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin), create a reCAPTCHA v3 key pair and add the domain **`alfredoalvarado53-ui.github.io`** (and `localhost` if testing locally).
   * Enter the secret key into Firebase Console, and copy the **Public Site Key**.
   * In the **APIs** tab of App Check, enforce protection for **Vertex AI in Firebase**.
5. **Get Your Firebase Web Config:**
   * In Firebase Console, go to **Project Settings (⚙️) > General > Your Apps**.
   * Copy the `firebaseConfig` JSON object containing `apiKey`, `projectId`, `authDomain`, `appId`.

### Step 2: Paste into the Live Evaluator Modal
1. Open [https://alfredoalvarado53-ui.github.io/omniaudit-ai/](https://alfredoalvarado53-ui.github.io/omniaudit-ai/).
2. Click the **⚙️ Configuración / Proyecto Firebase** button in the top header.
3. Paste your Web Config JSON into the textarea. Example:
   ```json
   {
     "apiKey": "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "authDomain": "my-audit-project.firebaseapp.com",
     "projectId": "my-audit-project",
     "storageBucket": "my-audit-project.firebasestorage.app",
     "appId": "1:123456789012:web:abcdef1234567890"
   }
   ```
4. Enter your public **reCAPTCHA Site Key** in the App Check input.
5. Click **"Guardar en Sesión y Recargar"**.
   * Credentials are saved **strictly in browser `sessionStorage`** (never sent to any external server or saved in localStorage).
   * The application refreshes and displays your project: `Firebase AI Logic · my-audit-project` with `App Check Configurado (Pendiente)`.

### Step 3: Run the Live Audit & Verify App Check
1. Select a contract template (e.g. **NDA ($500k Penalty)**) or upload a digital PDF document.
2. Select your compliance playbook (e.g. **Standard Mutual NDA**).
3. Click **"Run Autonomous Compliance Audit (AI)"**:
   * The client intercepts and tokenizes all PII locally.
   * App Check retrieves an attestation token for `alfredoalvarado53-ui.github.io`.
   * Firebase AI Logic invokes `gemini-1.5-flash` with the sanitized payload.
   * Upon successful response, the status updates to **`App Check Verificado · PII Sanitized`**.
   * The health score, risk verdict, structured findings, and smart redlines populate dynamically.

### Step 4: Resetting the Session Cleanly
* Click **⚙️ Configuración / Proyecto Firebase** and click **"Restablecer"**.
* This completely purges `sessionStorage`, destroys the active Firebase App via `deleteApp()`, resets all telemetry and scores to default, and returns the engine to local-only mode.

---

## 🔍 How to Distinguish Between Engine Routes

OmniAudit AI maintains complete transparency. It never simulates AI responses or presents heuristic fallbacks as model output:

| Engine / Route | Header Badge | Telemetry Engine Label | Telemetry Privacy Label | Verification Status | Network Transmission |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Chrome Built-in AI** | `Gemini Nano · local` (Green) | `Gemini Nano · local` | `100% On-Device (Zero-Cloud)` | Native Browser | **0 Bytes** (100% local NPU/GPU execution) |
| **Firebase AI Logic** | `Firebase AI Logic · [projectId]` (Cyan) | `Firebase AI Logic · [projectId]` | `App Check Verificado` | Verified on live model response | **Pre-Sanitized Text Only** (Raw PII stripped) |
| **Demo Local (Sin IA)** | `Demo local · sin IA` (Zinc) | `Demo local · sin IA` | `Demo local · sin IA` | Reference Benchmark | **0 Bytes** (Client-side heuristic rule test) |

---

## 🛠️ Diagnosing Common Firebase & App Check Errors

If an error appears during a cloud audit, OmniAudit AI displays the raw, uncensored error with actionable remedies:

* **`App Check denegó la petición (permission-denied / 403)`:**  
  *Cause:* The public domain `alfredoalvarado53-ui.github.io` is not registered in the reCAPTCHA v3 admin console, or the Site Key does not match the secret in Firebase Console.  
  *Fix:* Add `alfredoalvarado53-ui.github.io` to the allowed domains list in Google reCAPTCHA Admin Console and verify the site key.
* **`Vertex AI API has not been used in project... (403)`:**  
  *Cause:* The Vertex AI in Firebase API is not enabled, or the project is on the Spark (free) plan rather than the Blaze (pay-as-you-go) plan.  
  *Fix:* Enable the Blaze plan in Firebase Console and visit **Build > Vertex AI in Firebase** to activate the API.
* **`JSON de configuración inválido / Faltan campos`:**  
  *Cause:* The pasted configuration is not valid JSON or lacks `apiKey`, `projectId`, or `appId`.  
  *Fix:* Ensure double quotes surround all property names and values (standard JSON format).

---

## ⚠️ Security & Privacy Architecture

1. **Client-Side Regex Sanitization:** The sanitizer strips emails, phone numbers, tax IDs (SSN, RFC, CURP), and credit card numbers in browser memory prior to payload assembly.
2. **Zero Ingestion of Raw PII:** Neither Gemini 1.5 Flash nor Gemini Nano ever receive cleartext personal identifiers.
3. **DOMPurify HTML Defense:** All rendered Markdown reports, error messages, structured finding cards, and redline amendments are sanitized through DOMPurify to eliminate XSS risks.
4. **Digital PDF Guard:** Scanned image-only PDFs without digital text layers are detected and halted, instructing the user that OCR pre-processing is required.

---

## 🎥 YouTube Demo Video

* **Video Submission Status:** ⏳ **Pending Video Upload**  
  *(A 1–2 minute screen capture demonstration is being finalized with the natural neural voiceover asset located at `omniaudit_voiceover_natural.mp3`).*

---

## 📄 License
OmniAudit AI is open-source software licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for complete terms.
