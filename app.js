import { HybridAuditEngine } from "./engine.js";

// DOM Elements
const docText = document.getElementById("docText");
const charCount = document.getElementById("charCount");
const dropZone = document.getElementById("dropZone");
const fileUpload = document.getElementById("fileUpload");
const btnRunAudit = document.getElementById("btnRunAudit");
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

// Engine Instance
const engine = new HybridAuditEngine({ mode: "prefer_on_device" });
let latestAuditResult = null;

// Initialize Lucide Icons
function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
refreshIcons();

// Network Telemetry
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  if (!isOnline) {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-950/70 text-amber-300 border border-amber-600/70 shadow-sm animate-pulse";
    netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Offline · Air-Gapped Local</span>`;
    telemetryPrivacy.textContent = "100% Local";
    telemetryPrivacy.className = "text-xs font-bold text-amber-400";
  } else {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 shadow-sm";
    netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Online · Hybrid Ready</span>`;
    telemetryPrivacy.textContent = "Hybrid Protected";
    telemetryPrivacy.className = "text-xs font-bold text-emerald-400";
  }
}
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();

// Detect Local Browser AI
async function initCapabilities() {
  const caps = await engine.checkCapabilities();
  if (caps.available) {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/60";
    engineStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Gemini Nano Ready (Chrome)</span>`;
    telemetryEngine.textContent = "Gemini Nano";
  } else {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-700/60";
    engineStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400"></span><span>Cloud Fallback (Firebase)</span>`;
    telemetryEngine.textContent = "Gemini Flash";
  }
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

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    docText.value = e.target.result;
    charCount.textContent = `${docText.value.length} characters`;
  };
  reader.readAsText(file);
}

// Tab Switching (Executive Report vs Smart Redline)
tabReport.addEventListener("click", () => {
  tabReport.className = "px-3 py-1 rounded-md text-xs font-medium bg-slate-800 text-white transition";
  tabRedline.className = "px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition";
  viewReport.classList.remove("hidden");
  viewRedline.classList.add("hidden");
});

tabRedline.addEventListener("click", () => {
  tabRedline.className = "px-3 py-1 rounded-md text-xs font-medium bg-slate-800 text-white transition";
  tabReport.className = "px-3 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition";
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

// Run Autonomous Audit Execution
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

  viewReport.innerHTML = `
    <div class="h-64 flex flex-col items-center justify-center text-slate-400">
      <div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="font-mono text-xs animate-pulse">Running autonomous compliance & PII redlining...</p>
    </div>
  `;

  try {
    const result = await engine.auditDocument(text);
    latestAuditResult = result;

    // Render Markdown Report
    viewReport.innerHTML = marked.parse(result.content);

    // Update Telemetry
    telemetryEngine.textContent = result.model;
    telemetryLatency.textContent = `${result.latencyMs} ms`;
    telemetryPrivacy.textContent = result.isPrivateZeroCloud ? "100% On-Device" : "Hybrid Cloud";

    // Analyze Risk & Extract Findings
    parseAndRenderFindings(text, result.content);

  } catch (err) {
    console.error(err);
    viewReport.innerHTML = `<div class="p-4 bg-red-950/60 border border-red-800 rounded-xl text-red-200">Error executing audit: ${err.message}</div>`;
  } finally {
    btnRunAudit.disabled = false;
    btnRunAudit.classList.remove("opacity-60", "cursor-not-allowed");
    refreshIcons();
  }
});

// Dynamic Risk Scorer and Redline Generator
function parseAndRenderFindings(doc, report) {
  const findings = [];
  let score = 95;

  // 1. Penalty clauses
  if (/500,000|\$500k|unlimited liability/i.test(doc)) {
    score -= 35;
    findings.push({
      severity: "HIGH",
      title: "Extreme Liquidated Damages & Unlimited Liability",
      desc: "Contract forces immediate $500,000 USD penalty and unlimited damages without requiring proof of actual harm.",
      clause: "Receiving Party shall assume UNLIMITED, UNRESTRICTED LIABILITY...",
      fix: "Cap total liability to 12 months of fees actually paid; strike liquidated damages.",
    });
  }

  // 2. Unilateral Termination
  if (/0 days notice|immediately at its sole discretion/i.test(doc)) {
    score -= 20;
    findings.push({
      severity: "HIGH",
      title: "Zero-Notice Unilateral Termination",
      desc: "One party can kill the agreement instantly with zero cure period.",
      clause: "Reserves the right to terminate immediately with 0 days prior notice...",
      fix: "Require minimum 30 days written notice with 15-day opportunity to cure breaches.",
    });
  }

  // 3. PII Detection
  const piiMatches = doc.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\d{3}-\d{2}-\d{4})|([A-Z]{4}\d{6}-[A-Z0-9]{3})/g);
  if (piiMatches && piiMatches.length > 0) {
    score -= 15;
    findings.push({
      severity: "MEDIUM",
      title: `Cleartext PII Detected (${piiMatches.length} items)`,
      desc: `Contains unredacted personal identifiers: ${piiMatches.slice(0, 3).join(", ")}.`,
      clause: "Party personal emails and tax/SSN identifiers.",
      fix: "Enforce automated local sanitization before document distribution.",
    });
  }

  // 4. Low SLA or extreme caps
  if (/48 consecutive hours|under \$100|lesser of \$50/i.test(doc)) {
    score -= 25;
    findings.push({
      severity: "HIGH",
      title: "Disproportionate Liability Ceiling ($50 USD)",
      desc: "Provider disclaims all liability for outages under 48 hours and caps damages to an absurd $50.",
      clause: "Provider's total maximum aggregate liability... capped at $50 USD...",
      fix: "Standard enterprise floor should be at least total annual contract value.",
    });
  }

  // 5. Non-compete
  if (/two \(2\) full years|worldwide/i.test(doc)) {
    score -= 25;
    findings.push({
      severity: "HIGH",
      title: "Overly Broad Worldwide Non-Compete",
      desc: "Two-year global restriction is legally unenforceable in multiple jurisdictions and severely harms engineer mobility.",
      clause: "For a period of two (2) full years worldwide...",
      fix: "Restrict scope to direct competitors within 50 miles, or limit duration to 6 months.",
    });
  }

  // Cap score bounds
  score = Math.max(15, Math.min(score, 98));

  // Update UI score
  scoreNumber.textContent = score;
  scoreBar.style.width = `${score}%`;

  if (score >= 80) {
    scoreBar.className = "h-full bg-emerald-500 transition-all duration-700";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700";
    riskVerdictBadge.textContent = "Low Risk (Favorable)";
  } else if (score >= 50) {
    scoreBar.className = "h-full bg-amber-500 transition-all duration-700";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-700";
    riskVerdictBadge.textContent = "Moderate Risk (Amendments Recommended)";
  } else {
    scoreBar.className = "h-full bg-rose-500 transition-all duration-700";
    riskVerdictBadge.className = "text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-700";
    riskVerdictBadge.textContent = "High Risk (Hostile Terms)";
  }

  // Render Findings Cards
  findingCountBadge.textContent = `${findings.length} findings`;
  if (findings.length === 0) {
    findingsContainer.innerHTML = `
      <div class="h-44 flex flex-col items-center justify-center text-emerald-400 text-xs text-center p-4">
        <i data-lucide="shield-check" class="w-8 h-8 mb-2"></i>
        <span>Clean contract structure. No high-severity risks flagged under active playbook.</span>
      </div>
    `;
  } else {
    findingsContainer.innerHTML = findings
      .map(
        (f) => `
        <div class="p-3 rounded-xl border ${
          f.severity === "HIGH"
            ? "border-rose-800/80 bg-rose-950/30 text-rose-100"
            : "border-amber-800/80 bg-amber-950/30 text-amber-100"
        } transition hover:scale-[1.01]">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs flex items-center gap-1">
              <i data-lucide="${f.severity === "HIGH" ? "alert-circle" : "alert-triangle"}" class="w-3.5 h-3.5"></i>
              ${f.title}
            </span>
            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded ${
              f.severity === "HIGH" ? "bg-rose-900 text-rose-200" : "bg-amber-900 text-amber-200"
            }">${f.severity}</span>
          </div>
          <p class="text-[11px] text-slate-300 mb-1.5 leading-snug">${f.desc}</p>
          <div class="bg-slate-950/60 p-1.5 rounded border border-slate-800 font-mono text-[10px] text-slate-400 mb-1">
            <span class="text-rose-400 font-bold block mb-0.5">Original Flag:</span>
            "${f.clause}"
          </div>
          <div class="bg-emerald-950/40 p-1.5 rounded border border-emerald-900/60 font-mono text-[10px] text-emerald-300">
            <span class="text-emerald-400 font-bold block mb-0.5">Recommended Playbook Fix:</span>
            ${f.fix}
          </div>
        </div>
      `
      )
      .join("");
  }

  // Populate Smart Redline View
  renderSmartRedline(doc, findings);
}

// Generate Redline View (Side-by-side or Strikethrough edits like Ironclad)
function renderSmartRedline(originalText, findings) {
  let redlinedHtml = `
    <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-3 text-xs text-slate-400">
      <i data-lucide="git-commit" class="w-4 h-4 text-cyan-400 inline mr-1"></i>
      <strong>Automated AI Redline (Ironclad / Robin AI Standard):</strong> Hostile and uncalibrated clauses have been marked for deletion with calibrated fallback amendments suggested.
    </div>
  `;

  findings.forEach((f, idx) => {
    redlinedHtml += `
      <div class="p-4 rounded-xl border border-slate-800 bg-slate-950/70 font-mono text-xs space-y-2">
        <div class="text-slate-400 font-bold flex items-center justify-between">
          <span>Amendment #${idx + 1}: ${f.title}</span>
          <span class="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Ready to Apply</span>
        </div>
        <div class="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300 line-through">
          ${f.clause}
        </div>
        <div class="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 font-medium">
          + ${f.fix}
        </div>
      </div>
    `;
  });

  viewRedline.innerHTML = redlinedHtml;
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
