import { HybridAuditEngine } from "./engine.js";

// DOM Elements
const docText = document.getElementById("docText");
const scanLaser = document.getElementById("scanLaser");
const charCount = document.getElementById("charCount");
const dropZone = document.getElementById("dropZone");
const fileUpload = document.getElementById("fileUpload");
const btnRunAudit = document.getElementById("btnRunAudit");
const btnRunDemo = document.getElementById("btnRunDemo");
const playbookSelect = document.getElementById("playbookSelect");

const netStatusBadge = document.getElementById("netStatusBadge");
const netStatusText = document.getElementById("netStatusText");
const engineStatusBadge = document.getElementById("engineStatusBadge");
const engineBadgeText = document.getElementById("engineBadgeText");

const scoreNumber = document.getElementById("scoreNumber");
const scoreBar = document.getElementById("scoreBar");
const riskVerdictBadge = document.getElementById("riskVerdictBadge");
const telemetryEngine = document.getElementById("telemetryEngine");
const telemetryLatency = document.getElementById("telemetryLatency");
const telemetryPrivacy = document.getElementById("telemetryPrivacy");

const findingsContainer = document.getElementById("findingsContainer");
const findingCountBadge = document.getElementById("findingCountBadge");

const tabReport = document.getElementById("tabReport");
const tabRedline = document.getElementById("tabRedline");
const viewReport = document.getElementById("viewReport");
const viewRedline = document.getElementById("viewRedline");
const btnExportMarkdown = document.getElementById("btnExportMarkdown");
const btnCopyReport = document.getElementById("btnCopyReport");

const btnTplNDA = document.getElementById("btnTplNDA");
const btnTplSaaS = document.getElementById("btnTplSaaS");
const btnTplEmployment = document.getElementById("btnTplEmployment");

// Modal Elements
const configModal = document.getElementById("configModal");
const btnOpenConfigModal = document.getElementById("btnOpenConfigModal");
const btnCloseConfigModal = document.getElementById("btnCloseConfigModal");
const customFirebaseConfigInput = document.getElementById("customFirebaseConfigInput");
const customRecaptchaKeyInput = document.getElementById("customRecaptchaKeyInput");
const btnSaveConfig = document.getElementById("btnSaveConfig");
const btnClearConfig = document.getElementById("btnClearConfig");
const configModalActiveStatus = document.getElementById("configModalActiveStatus");
const configModalActiveStatusText = document.getElementById("configModalActiveStatusText");
const configModalError = document.getElementById("configModalError");

// Engine Instance
const engine = new HybridAuditEngine({ mode: "prefer_on_device" });
let latestAuditResult = null;

// Initialize Lucide Icons safely
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}
refreshIcons();

// Safe DOM Sanitizer Helper
function safeHtml(raw) {
  if (window.DOMPurify && typeof window.DOMPurify.sanitize === "function") {
    return window.DOMPurify.sanitize(raw);
  }
  return raw;
}

// Network Telemetry
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  if (!isOnline) {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-950/70 text-amber-300 border border-amber-600/70 shadow-sm animate-pulse";
    netStatusBadge.innerHTML = safeHtml(`<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Offline · Air-Gapped Local</span>`);
    telemetryPrivacy.textContent = "100% Local";
    telemetryPrivacy.className = "text-xs font-bold text-amber-400";
  } else {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 shadow-sm";
    netStatusBadge.innerHTML = safeHtml(`<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Online · Hybrid Ready</span>`);
    telemetryPrivacy.textContent = "Hybrid Protected";
    telemetryPrivacy.className = "text-xs font-bold text-emerald-400";
  }
}
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();

// Detect Local Browser AI or Firebase AI Logic Status
async function initCapabilities() {
  await engine._initPromise;
  const caps = await engine.checkCapabilities();
  
  if (caps.available) {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25";
    engineStatusBadge.innerHTML = safeHtml(`<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Gemini Nano · local</span>`);
    telemetryEngine.textContent = "Gemini Nano · local";
    telemetryPrivacy.textContent = "100% On-Device (Zero-Cloud)";
  } else if (engine.isFirebaseReady) {
    const projLabel = engine.activeProjectId ? `Firebase AI Logic · ${engine.activeProjectId}` : "Firebase AI Logic";
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25";
    engineStatusBadge.innerHTML = safeHtml(`<span class="w-2 h-2 rounded-full bg-cyan-400"></span><span>${projLabel}</span>`);
    telemetryEngine.textContent = projLabel;
    
    if (engine.appCheckStatus === "verified") {
      telemetryPrivacy.textContent = "App Check Verificado · PII Sanitized";
    } else {
      telemetryPrivacy.textContent = "App Check Configurado (Pendiente)";
    }
  } else {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-900 text-zinc-400 border border-white/[0.08]";
    engineStatusBadge.innerHTML = safeHtml(`<span class="w-2 h-2 rounded-full bg-zinc-500"></span><span>Demo local · sin IA</span>`);
    telemetryEngine.textContent = "Demo local · sin IA";
    telemetryPrivacy.textContent = "Sin Conexión AI";
  }
  refreshIcons();
}
initCapabilities();

// Character count
docText.addEventListener("input", () => {
  charCount.textContent = `${docText.value.length} characters`;
});

// File Upload Drag & Drop
dropZone.addEventListener("click", () => fileUpload.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("border-cyan-400", "bg-cyan-950/30");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("border-cyan-400", "bg-cyan-950/30");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("border-cyan-400", "bg-cyan-950/30");
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    readFile(e.dataTransfer.files[0]);
  }
});
fileUpload.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0]) {
    readFile(e.target.files[0]);
  }
});

async function readFile(file) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      charCount.textContent = "Extracting text from PDF...";
      if (!window.pdfjsLib) {
        alert("PDF parser is still loading. Please try again in a few moments.");
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items.map((item) => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageStr}\n\n`;
      }

      const trimmed = fullText.trim();
      if (!trimmed || trimmed.length === 0) {
        docText.value = "";
        charCount.textContent = "0 characters";
        alert("El archivo PDF cargado no contiene texto digital legible (parece ser un escaneo o imagen que requiere OCR). Por favor copia el texto o usa un PDF con texto seleccionable.");
        return;
      }

      docText.value = trimmed;
      charCount.textContent = `${trimmed.length} characters (${pdf.numPages} PDF pages extracted)`;
      return;
    } catch (err) {
      console.error("PDF extraction error:", err);
      alert("Failed to parse PDF document: " + err.message);
      return;
    }
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    docText.value = e.target.result;
    charCount.textContent = `${docText.value.length} characters`;
  };
  reader.readAsText(file);
}

// Tab Switching (Executive Report vs Smart Redline)
tabReport.addEventListener("click", () => {
  tabReport.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.1] text-white transition-all cursor-pointer shadow-sm";
  tabRedline.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer";
  viewReport.classList.remove("hidden");
  viewRedline.classList.add("hidden");
});

tabRedline.addEventListener("click", () => {
  tabRedline.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.1] text-white transition-all cursor-pointer shadow-sm";
  tabReport.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer";
  viewRedline.classList.remove("hidden");
  viewReport.classList.add("hidden");
});

// Template loaders
btnTplNDA.addEventListener("click", () => {
  playbookSelect.value = "standard_nda";
  docText.value = `MUTUAL NON-DISCLOSURE & LIABILITY AGREEMENT
Date: November 12, 2026
Party A: OmniTech Ventures LLC, represented by Jonathan Crane (SSN: 045-89-1234, email: jcrane@omnitech.io, Tel: +1-555-839-2041).
Party B: Integraciones TRC S.A. de C.V., represented by Alfredo Alvarado (RFC: ALVA890412-TR1, email: alfredo@example.com).

1. CONFIDENTIAL ASSETS & FINANCIAL AUDIT
All customer credit card numbers (e.g. 4532-8921-9943-1284) and architectural secrets shared between parties are strictly private.

2. UNLIMITED LIABILITY & PENAL CLAUSE
In the event of any breach or inadvertent leak, Receiving Party shall assume UNLIMITED, UNRESTRICTED LIABILITY for all direct, consequential, special, and punitive damages, plus a mandatory liquidated penalty of $500,000 USD payable within five (5) calendar days without need of prior judicial declaration.

3. IMMEDIATE UNILATERAL TERMINATION
OmniTech Ventures LLC reserves the exclusive right to terminate this agreement immediately with 0 days prior notice for convenience.

4. GOVERNING LAW & JURISDICTION
Any dispute shall be litigated exclusively in the state courts of Dover, Delaware, waiving all rights to arbitration or jury trial.`;
  charCount.textContent = `${docText.value.length} characters`;
});

btnTplSaaS.addEventListener("click", () => {
  playbookSelect.value = "enterprise_saas";
  docText.value = `MASTER SERVICES AGREEMENT (ENTERPRISE SAAS)
Provider: CloudScale Apex Inc. (support@cloudscale.io)
Customer: Enterprise Global Logistics Group

1. SERVICE LEVEL AGREEMENT & DOWNTIME
Provider will target a 99.0% service availability. Provider shall have zero financial or legal liability for any unscheduled service outages lasting under 48 consecutive hours.

2. INDEMNITY & LIABILITY CEILING
Customer agrees to defend and hold Provider harmless against all third-party lawsuits. Provider's total maximum aggregate liability arising out of or related to this Agreement shall be strictly capped at the lesser of $50 USD or one month's fee.

3. DATA USAGE & TELEMETRY
Provider retains unrestricted rights to aggregate and monetize customer end-user contact lists (support phone: +1-800-555-0199) for algorithmic retraining.`;
  charCount.textContent = `${docText.value.length} characters`;
});

btnTplEmployment.addEventListener("click", () => {
  playbookSelect.value = "employment_contract";
  docText.value = `EXECUTIVE EMPLOYMENT & INVENTIONS ASSIGNMENT AGREEMENT
Employer: Apex Robotics Corp.
Employee: Senior AI Engineer

1. PERPETUAL NON-COMPETE
Employee agrees that for a period of two (2) full years following departure from Apex Robotics Corp, Employee shall not engage in, consult for, advise, or invest in any business worldwide that develops AI software or robotics.

2. MORAL RIGHTS & INVENTIONS ASSIGNMENT
Employee assigns all inventions, patents, code, and side-projects created during the employment term—including projects developed entirely on personal time and personal computers—to Employer in perpetuity.

3. SEVERANCE FORFEITURE
Any claim for constructive dismissal or unpaid bonuses is waived upon execution of this agreement.`;
  charCount.textContent = `${docText.value.length} characters`;
});

// Run Autonomous Audit Execution (AI Route)
btnRunAudit.addEventListener("click", async () => {
  const text = docText.value.trim();
  if (!text) {
    alert("Please enter or paste a document to audit.");
    return;
  }

  // Set mode based on connection
  engine.mode = navigator.onLine ? "prefer_on_device" : "only_on_device";

  btnRunAudit.disabled = true;
  btnRunAudit.classList.add("opacity-60", "cursor-not-allowed");
  if (scanLaser) scanLaser.classList.remove("hidden");

  viewReport.innerHTML = safeHtml(`
    <div class="h-64 flex flex-col items-center justify-center text-slate-400">
      <div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="font-mono text-xs animate-pulse">Running autonomous compliance & PII redlining...</p>
    </div>
  `);

  try {
    const result = await engine.auditDocument(text, { playbook: playbookSelect.value });
    latestAuditResult = result;

    // Render Markdown Report with DOMPurify sanitization
    const rawHtml = marked.parse(result.content);
    viewReport.innerHTML = safeHtml(rawHtml);

    // Update Telemetry with precise verified engine status
    telemetryEngine.textContent = result.model;
    telemetryLatency.textContent = `${result.latencyMs} ms`;
    
    if (result.isPrivateZeroCloud) {
      telemetryPrivacy.textContent = "100% On-Device (Zero-Cloud)";
    } else if (result.appCheckStatus === "verified") {
      telemetryPrivacy.textContent = "App Check Verificado · PII Sanitized";
    } else {
      telemetryPrivacy.textContent = "Client-Side Sanitized";
    }

    // Render Structured Findings & Risk Matrix derived directly from AI Model Output
    renderStructuredFindings(result.structuredData);

  } catch (err) {
    console.error("Audit Execution Error:", err);
    const sanitizedErrorText = safeHtml(err.message);
    viewReport.innerHTML = safeHtml(`
      <div class="p-4 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-100 font-sans space-y-3">
        <div class="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <i data-lucide="alert-triangle" class="w-4 h-4"></i>
          <span>Error en la Ruta de IA</span>
        </div>
        <p class="text-xs text-rose-200/90 leading-relaxed">${sanitizedErrorText}</p>
        <div class="pt-2 border-t border-rose-500/20 text-[11px] text-zinc-400 space-y-1">
          <p><strong>Pasos para resolver este error:</strong></p>
          <ul class="list-disc list-inside space-y-0.5 text-zinc-400">
            <li>Haz clic en el engranaje <strong class="text-cyan-300">⚙️ Configuración / Proyecto Firebase</strong> para ingresar tu JSON de Firebase Web y tu Clave de Sitio reCAPTCHA v3.</li>
            <li>Verifica que el dominio <code class="text-cyan-300">${window.location.hostname}</code> esté autorizado en Google reCAPTCHA y en Firebase App Check.</li>
            <li>O bien, haz clic abajo en <strong>"Probar Demo Local (Reglas Estáticas · Sin IA)"</strong> para ejecutar la auditoría de referencia local inmediata.</li>
          </ul>
        </div>
      </div>
    `);
  } finally {
    if (scanLaser) scanLaser.classList.add("hidden");
    btnRunAudit.disabled = false;
    btnRunAudit.classList.remove("opacity-60", "cursor-not-allowed");
    if (window.innerWidth < 1024) { setMobileView("score"); }
    refreshIcons();
  }
});

// Explicit Static Benchmark Demo (Clearly separated from AI route)
if (btnRunDemo) {
  btnRunDemo.addEventListener("click", async () => {
    const text = docText.value.trim();
    if (!text) {
      alert("Por favor introduce o selecciona una plantilla para probar la demo estática.");
      return;
    }

    btnRunDemo.disabled = true;
    btnRunAudit.disabled = true;

    try {
      const result = await engine.auditDocument(text, { playbook: playbookSelect.value, isStaticDemo: true });
      latestAuditResult = result;

      // Render Markdown Report with DOMPurify sanitization
      const rawDemoHtml = marked.parse(result.content);
      viewReport.innerHTML = safeHtml(rawDemoHtml);

      // Update Telemetry
      telemetryEngine.textContent = result.model;
      telemetryLatency.textContent = `${result.latencyMs} ms`;
      telemetryPrivacy.textContent = "Demo local · sin IA";

      // Render Structured Findings
      renderStructuredFindings(result.structuredData);

    } catch (err) {
      viewReport.innerHTML = safeHtml(`<div class="p-4 bg-red-950/60 border border-red-800 rounded-xl text-red-200">Error en demo: ${safeHtml(err.message)}</div>`);
    } finally {
      btnRunDemo.disabled = false;
      btnRunAudit.disabled = false;
      if (window.innerWidth < 1024) { setMobileView("score"); }
      refreshIcons();
    }
  });
}

// AI Model-Driven Structured Risk Findings & Redlines Renderer
function renderStructuredFindings(data) {
  if (!data) return;

  // Strict handling: If structured JSON is missing or invalid, do NOT invent score or findings!
  if (data.healthScore === null || data.healthScore === undefined || !data.hasStructuredOutput) {
    scoreNumber.textContent = "--";
    scoreBar.style.width = "0%";
    riskVerdictBadge.textContent = safeHtml(data.riskVerdict || "No estructurado");
    riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700";
    findingCountBadge.textContent = "0 findings";

    const note = safeHtml(data.parsingNote || "El modelo completó el reporte en Markdown pero omitió el bloque JSON estructurado. No se inventaron puntuaciones artificiales.");
    findingsContainer.innerHTML = safeHtml(`
      <div class="h-48 flex flex-col items-center justify-center text-amber-300 text-xs text-center p-4 animate-card-in">
        <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
          <i data-lucide="info" class="w-5 h-5 text-amber-400"></i>
        </div>
        <span class="font-medium text-amber-300">Reporte no estructurado</span>
        <span class="text-[11px] text-zinc-400 mt-1 max-w-[240px] leading-relaxed">
          ${note}
        </span>
      </div>
    `);
    renderSmartRedline([]);
    refreshIcons();
    return;
  }

  const score = data.healthScore;
  const findings = Array.isArray(data.findings) ? data.findings : [];
  const redlines = Array.isArray(data.redlines) ? data.redlines : [];

  // Animated Score Counter (Framer Odometer Effect)
  animateScoreCounter(score);
  scoreBar.style.width = `${score}%`;

  if (score >= 80) {
    scoreBar.className = "h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25";
    riskVerdictBadge.textContent = data.riskVerdict || "Low Risk (Favorable)";
  } else if (score >= 50) {
    scoreBar.className = "h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25";
    riskVerdictBadge.textContent = data.riskVerdict || "Moderate Risk (Amendments Recommended)";
  } else {
    scoreBar.className = "h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(244,63,94,0.5)]";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25";
    riskVerdictBadge.textContent = data.riskVerdict || "High Risk (Hostile Terms)";
  }

  // Render Findings Cards safely with DOMPurify
  findingCountBadge.textContent = `${findings.length} findings`;
  if (findings.length === 0) {
    findingsContainer.innerHTML = safeHtml(`
      <div class="h-48 flex flex-col items-center justify-center text-emerald-400 text-xs text-center p-4 animate-card-in">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
          <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
        </div>
        <span class="font-medium">Clean contract structure</span>
        <span class="text-[11px] text-zinc-500 mt-1">No high-severity risks flagged under active playbook.</span>
      </div>
    `);
  } else {
    const cardsHtml = findings
      .map((f, idx) => {
        const safeSeverity = safeHtml(f.severity || "MEDIUM");
        const safeTitle = safeHtml(f.title || "Finding");
        const safeDesc = safeHtml(f.desc || "");
        const safeClause = safeHtml(f.clause || "");
        const safeFix = safeHtml(f.fix || "");
        const isHigh = safeSeverity === "HIGH";

        return `
          <div class="animate-card-in p-3.5 rounded-xl border ${
            isHigh
              ? "border-rose-500/25 bg-rose-500/[0.04] text-rose-100 hover:border-rose-500/40 hover:bg-rose-500/[0.07]"
              : "border-amber-500/25 bg-amber-500/[0.04] text-amber-100 hover:border-amber-500/40 hover:bg-amber-500/[0.07]"
          } transition-all" style="animation-delay: ${idx * 90}ms;">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-xs flex items-center gap-1.5 text-zinc-100">
                <i data-lucide="${isHigh ? "alert-circle" : "alert-triangle"}" class="w-3.5 h-3.5 ${isHigh ? "text-rose-400" : "text-amber-400"}"></i>
                ${safeTitle}
              </span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isHigh ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              }">${safeSeverity}</span>
            </div>
            <p class="text-[11px] text-zinc-300 mb-2 leading-relaxed">${safeDesc}</p>
            <div class="bg-black/50 p-2 rounded-lg border border-white/[0.06] font-mono text-[10px] text-zinc-400 mb-1.5 shadow-inner">
              <span class="text-rose-400 font-bold block mb-0.5 uppercase tracking-wider text-[9px]">Original Clause Flag:</span>
              "${safeClause}"
            </div>
            <div class="bg-emerald-500/[0.06] p-2 rounded-lg border border-emerald-500/20 font-mono text-[10px] text-emerald-300">
              <span class="text-emerald-400 font-bold block mb-0.5 uppercase tracking-wider text-[9px]">Recommended Playbook Fix:</span>
              ${safeFix}
            </div>
          </div>
        `;
      })
      .join("");

    findingsContainer.innerHTML = safeHtml(cardsHtml);
  }

  // Populate Smart Redline View directly from model output
  renderSmartRedline(redlines);
  refreshIcons();
}

// Number Counter Easing Animation
function animateScoreCounter(targetScore) {
  if (typeof targetScore !== "number" || isNaN(targetScore)) return;
  const duration = 850;
  const start = parseInt(scoreNumber.textContent) || 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (targetScore - start) * ease);
    scoreNumber.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      scoreNumber.textContent = targetScore;
    }
  }
  requestAnimationFrame(update);
}

// Generate Redline View safely with DOMPurify
function renderSmartRedline(redlines) {
  let redlinedHtml = `
    <div class="animate-card-in p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-3 text-xs text-zinc-400 flex items-start gap-2">
      <i data-lucide="git-commit" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
      <div>
        <strong class="text-zinc-200">Automated Smart Redline (Ironclad / Robin AI Standard):</strong> Hostile and uncalibrated clauses have been marked for deletion with calibrated fallback amendments suggested.
      </div>
    </div>
  `;

  (redlines || []).forEach((f, idx) => {
    const safeTitle = safeHtml(f.title || `Amendment #${idx + 1}`);
    const safeClause = safeHtml(f.clause || f.original || "");
    const safeFix = safeHtml(f.fix || f.proposed || "");

    redlinedHtml += `
      <div class="animate-card-in p-4 rounded-xl border border-white/[0.08] bg-zinc-950/80 font-mono text-xs space-y-2.5 shadow-sm" style="animation-delay: ${idx * 110}ms;">
        <div class="text-zinc-300 font-bold flex items-center justify-between">
          <span class="text-zinc-200">${safeTitle}</span>
          <span class="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/25">Ready to Apply</span>
        </div>
        <div class="p-2.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/25 text-rose-300 line-through">
          ${safeClause}
        </div>
        <div class="p-2.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-300 font-medium">
          + ${safeFix}
        </div>
      </div>
    `;
  });

  viewRedline.innerHTML = safeHtml(redlinedHtml);
  refreshIcons();
}

// Export and Copy Handlers
btnExportMarkdown.addEventListener("click", () => {
  if (!latestAuditResult) {
    alert("Please run an audit first.");
    return;
  }
  const blob = new Blob([latestAuditResult.content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `OmniAudit-Report-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
});

btnCopyReport.addEventListener("click", () => {
  if (!latestAuditResult) {
    alert("Please run an audit first.");
    return;
  }
  navigator.clipboard.writeText(latestAuditResult.content);
  alert("Report copied to clipboard!");
});

// --- Mobile View Switching Logic ---
const mobileTabEditor = document.getElementById("mobileTabEditor");
const mobileTabScore = document.getElementById("mobileTabScore");
const mobileTabResults = document.getElementById("mobileTabResults");

const colEditor = document.getElementById("colEditor");
const colScore = document.getElementById("colScore");
const colResults = document.getElementById("colResults");

function setMobileView(activeTab) {
  if (window.innerWidth >= 1024) return;

  colEditor.classList.add("hidden");
  colScore.classList.add("hidden");
  colResults.classList.add("hidden");

  [mobileTabEditor, mobileTabScore, mobileTabResults].forEach((btn) => {
    if (btn) {
      btn.className = "py-2 text-xs font-semibold rounded-xl text-center transition-all text-zinc-400 hover:text-white flex items-center justify-center gap-1.5";
    }
  });

  const activeClass = "py-2 text-xs font-semibold rounded-xl text-center transition-all bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center gap-1.5 shadow-sm";

  if (activeTab === "editor") {
    colEditor.classList.remove("hidden");
    if (mobileTabEditor) mobileTabEditor.className = activeClass;
  } else if (activeTab === "score") {
    colScore.classList.remove("hidden");
    if (mobileTabScore) mobileTabScore.className = activeClass;
  } else if (activeTab === "results") {
    colResults.classList.remove("hidden");
    if (mobileTabResults) mobileTabResults.className = activeClass;
  }
}

if (mobileTabEditor) mobileTabEditor.addEventListener("click", () => setMobileView("editor"));
if (mobileTabScore) mobileTabScore.addEventListener("click", () => setMobileView("score"));
if (mobileTabResults) mobileTabResults.addEventListener("click", () => setMobileView("results"));

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    colEditor.classList.remove("hidden");
    colScore.classList.remove("hidden");
    colResults.classList.remove("hidden");
  } else {
    setMobileView("editor");
  }
});

// --- Firebase Session Settings Modal (Safe JSON Only, App Check Enforcement) ---
if (btnOpenConfigModal && configModal) {
  btnOpenConfigModal.addEventListener("click", () => {
    if (configModalError) {
      configModalError.classList.add("hidden");
      configModalError.textContent = "";
    }

    // Load any currently stored session configuration
    try {
      const saved = sessionStorage.getItem("OMNIAUDIT_FIREBASE_CONFIG");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.firebaseConfig) {
          customFirebaseConfigInput.value = JSON.stringify(parsed.firebaseConfig, null, 2);
        }
        if (parsed.appCheckConfig && parsed.appCheckConfig.recaptchaSiteKey) {
          customRecaptchaKeyInput.value = parsed.appCheckConfig.recaptchaSiteKey;
        }

        if (configModalActiveStatus && configModalActiveStatusText && parsed.firebaseConfig.projectId) {
          configModalActiveStatus.classList.remove("hidden");
          const verifiedLabel = engine.appCheckStatus === "verified" ? " (App Check Verificado)" : " (App Check Configurado · Pendiente)";
          configModalActiveStatusText.textContent = `Proyecto en sesión activo: ${parsed.firebaseConfig.projectId}${verifiedLabel}`;
        }
      } else {
        if (configModalActiveStatus) configModalActiveStatus.classList.add("hidden");
      }
    } catch {
      // ignore
    }
    configModal.classList.remove("hidden");
    refreshIcons();
  });

  if (btnCloseConfigModal) {
    btnCloseConfigModal.addEventListener("click", () => {
      configModal.classList.add("hidden");
    });
  }

  if (btnSaveConfig) {
    btnSaveConfig.addEventListener("click", async () => {
      if (configModalError) {
        configModalError.classList.add("hidden");
        configModalError.textContent = "";
      }

      const rawJson = customFirebaseConfigInput.value.trim();
      if (!rawJson) {
        configModalError.textContent = "Por favor introduce un objeto de configuración de Firebase Web en formato JSON.";
        configModalError.classList.remove("hidden");
        return;
      }

      let parsed;
      try {
        // STRICT JSON ONLY - NO new Function or dynamic eval
        parsed = JSON.parse(rawJson);
      } catch (parseErr) {
        configModalError.textContent = "Error de sintaxis JSON: El texto ingresado no es un JSON válido. Asegúrate de incluir comillas dobles en las propiedades (ej: {\"apiKey\": \"...\", \"projectId\": \"...\"}). No se permite código ejecutable.";
        configModalError.classList.remove("hidden");
        return;
      }

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        configModalError.textContent = "El JSON debe representar un objeto con las propiedades públicas de Firebase Web.";
        configModalError.classList.remove("hidden");
        return;
      }

      // Validate required fields
      if (!parsed.apiKey || !parsed.projectId || !parsed.appId) {
        configModalError.textContent = "Faltan campos obligatorios en el objeto: 'apiKey', 'projectId' y 'appId' son indispensables.";
        configModalError.classList.remove("hidden");
        return;
      }

      // Prevent placeholders
      if (
        parsed.apiKey.startsWith("YOUR_") ||
        parsed.projectId.startsWith("YOUR_") ||
        parsed.apiKey.includes("<YOUR_")
      ) {
        configModalError.textContent = "Por favor ingresa las credenciales reales de tu proyecto de Firebase, no los textos de ejemplo.";
        configModalError.classList.remove("hidden");
        return;
      }

      // Mandatory App Check on Public Web
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".local");

      const siteKey = customRecaptchaKeyInput ? customRecaptchaKeyInput.value.trim() : "";
      if (!isLocalhost && (!siteKey || siteKey.length < 10 || siteKey.startsWith("YOUR_"))) {
        configModalError.textContent = `En la web pública (${window.location.hostname}), la Clave de Sitio (Site Key) de reCAPTCHA v3/Enterprise es obligatoria para inicializar App Check. Regístrala en la consola de Firebase y pégala aquí.`;
        configModalError.classList.remove("hidden");
        return;
      }

      const sessionPayload = {
        firebaseConfig: parsed,
        appCheckConfig: {
          recaptchaSiteKey: siteKey,
          isLocalDebug: isLocalhost,
        },
      };

      try {
        sessionStorage.setItem("OMNIAUDIT_FIREBASE_CONFIG", JSON.stringify(sessionPayload));
      } catch (e) {
        configModalError.textContent = "No se pudo guardar en sessionStorage: " + e.message;
        configModalError.classList.remove("hidden");
        return;
      }

      // Reset previous results on screen cleanly
      scoreNumber.textContent = "--";
      scoreBar.style.width = "0%";
      riskVerdictBadge.textContent = "Awaiting Audit";
      riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]";
      findingsContainer.innerHTML = safeHtml(`
        <div class="h-48 flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4">
          <div class="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
            <i data-lucide="check-circle" class="w-5 h-5 text-zinc-600"></i>
          </div>
          <span class="font-medium text-zinc-400">Configuración guardada en sesión</span>
          <span class="text-[11px] text-zinc-600 mt-1 max-w-[220px]">Recargando la app con el nuevo proyecto...</span>
        </div>
      `);
      viewReport.innerHTML = safeHtml(`
        <div class="h-64 flex flex-col items-center justify-center text-zinc-500 text-center p-4">
          <p class="font-semibold text-zinc-400">Awaiting Analysis</p>
          <p class="text-[11px] text-zinc-600 max-w-xs mt-1">Nuevo proyecto activo: ${parsed.projectId}</p>
        </div>
      `);
      viewRedline.innerHTML = "";
      latestAuditResult = null;

      // Reload cleanly to instantiate fresh engine with new session config
      window.location.reload();
    });
  }

  if (btnClearConfig) {
    btnClearConfig.addEventListener("click", async () => {
      sessionStorage.removeItem("OMNIAUDIT_FIREBASE_CONFIG");
      customFirebaseConfigInput.value = "";
      if (customRecaptchaKeyInput) customRecaptchaKeyInput.value = "";
      if (configModalActiveStatus) configModalActiveStatus.classList.add("hidden");
      if (configModalError) configModalError.classList.add("hidden");

      // Clean all results from UI
      scoreNumber.textContent = "--";
      scoreBar.style.width = "0%";
      riskVerdictBadge.textContent = "Awaiting Audit";
      riskVerdictBadge.className = "text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.08]";
      findingsContainer.innerHTML = safeHtml(`
        <div class="h-48 flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4">
          <div class="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
            <i data-lucide="check-circle" class="w-5 h-5 text-zinc-600"></i>
          </div>
          <span class="font-medium text-zinc-400">Sesión restablecida</span>
          <span class="text-[11px] text-zinc-600 mt-1 max-w-[220px]">Se eliminó la configuración de Firebase de la memoria de sesión.</span>
        </div>
      `);
      viewReport.innerHTML = safeHtml(`
        <div class="h-64 flex flex-col items-center justify-center text-zinc-500 text-center p-4">
          <p class="font-semibold text-zinc-400">Awaiting Analysis</p>
          <p class="text-[11px] text-zinc-600 max-w-xs mt-1">Configuración eliminada. Ejecuta la demo local o configura un nuevo proyecto.</p>
        </div>
      `);
      viewRedline.innerHTML = "";
      latestAuditResult = null;

      // Cleanly destroy Firebase app instance
      await engine.resetFirebase();
      await initCapabilities();
      refreshIcons();
      configModal.classList.add("hidden");
    });
  }
}
