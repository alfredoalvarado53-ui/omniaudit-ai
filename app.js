import { HybridAuditEngine } from "./engine.js";

const docText = document.getElementById("docText");
const charCount = document.getElementById("charCount");
const btnRunAudit = document.getElementById("btnRunAudit");
const btnExportMd = document.getElementById("btnExportMd");
const reportContainer = document.getElementById("reportContainer");
const engineStatusBadge = document.getElementById("engineStatusBadge");
const engineBadgeText = document.getElementById("engineBadgeText");
const netStatusBadge = document.getElementById("netStatusBadge");
const netStatusText = document.getElementById("netStatusText");
const routerModeTitle = document.getElementById("routerModeTitle");
const routerModeDesc = document.getElementById("routerModeDesc");
const routerDecisionBanner = document.getElementById("routerDecisionBanner");
const statEngine = document.getElementById("statEngine");
const statLatency = document.getElementById("statLatency");
const statPrivacy = document.getElementById("statPrivacy");
const btnSampleContract = document.getElementById("btnSampleContract");
const btnSampleSaaS = document.getElementById("btnSampleSaaS");

const engine = new HybridAuditEngine({
  mode: "prefer_on_device",
});

let latestReportContent = "";

// Real-time Network Monitoring
function updateNetworkTelemetry() {
  const isOnline = navigator.onLine;
  if (!isOnline) {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-950/70 text-amber-300 border border-amber-600/60 animate-pulse";
    netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span id="netStatusText">Offline (Zero-Cloud Enforced)</span>`;

    routerDecisionBanner.className =
      "p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-200 text-xs leading-relaxed";
    routerModeTitle.textContent = "Offline Mode: 100% Local Inference";
    routerModeDesc.textContent =
      "No internet connection detected. The app automatically forces 100% On-Device execution via Chrome Gemini Nano. Zero data will attempt to reach the cloud.";

    statPrivacy.textContent = "Offline Air-Gapped";
    statPrivacy.className = "text-sm font-bold text-amber-400 mt-1 block";
  } else {
    netStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/60";
    netStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span id="netStatusText">Online (Hybrid Ready)</span>`;

    routerDecisionBanner.className =
      "p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-slate-300 text-xs leading-relaxed";
    routerModeTitle.textContent = "Auto-Routing: Hybrid Intelligence Active";
    routerModeDesc.textContent =
      "Internet connected. Privacy sanitization & rapid analysis run locally on Gemini Nano. If deep cross-referencing or huge documents require it, Firebase AI Logic seamlessly bridges to cloud Gemini Flash.";

    statPrivacy.textContent = "Hybrid Protected";
    statPrivacy.className = "text-sm font-bold text-emerald-400 mt-1 block";
  }
}

window.addEventListener("online", updateNetworkTelemetry);
window.addEventListener("offline", updateNetworkTelemetry);
updateNetworkTelemetry();

// Char count update
docText.addEventListener("input", () => {
  charCount.textContent = `${docText.value.length} chars`;
});

// Detect browser AI capabilities
async function initCapabilities() {
  const caps = await engine.checkCapabilities();
  if (caps.available) {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/60";
    engineStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Gemini Nano Ready (On-Device)</span>`;
    statEngine.textContent = "Gemini Nano";
  } else {
    engineStatusBadge.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-700/60";
    engineStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400"></span><span>Cloud Fallback (Firebase AI Logic)</span>`;
    statEngine.textContent = "Gemini Flash";
  }
}
initCapabilities();

// Stream listener
engine.onStatusChange((status) => {
  if (status.step === "streaming" && status.partial) {
    reportContainer.innerHTML = marked.parse(status.partial);
  } else if (status.message) {
    statEngine.textContent = status.engine || statEngine.textContent;
  }
});

// Run Audit Action (Autonomous Engine Routing)
btnRunAudit.addEventListener("click", async () => {
  const text = docText.value.trim();
  if (!text) {
    alert("Please enter or paste a document text to audit.");
    return;
  }

  // Force local engine if offline
  if (!navigator.onLine) {
    engine.mode = "only_on_device";
  } else {
    engine.mode = "prefer_on_device";
  }

  btnRunAudit.disabled = true;
  btnRunAudit.classList.add("opacity-60", "cursor-not-allowed");
  reportContainer.innerHTML = `
    <div class="h-64 flex flex-col items-center justify-center text-slate-400">
      <div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="font-mono text-sm animate-pulse">Running autonomous audit (${navigator.onLine ? "Hybrid Network" : "Offline On-Device"})...</p>
    </div>
  `;

  try {
    const result = await engine.auditDocument(text);
    latestReportContent = result.content;
    reportContainer.innerHTML = marked.parse(result.content);

    // Update real metrics
    statEngine.textContent = result.model;
    statLatency.textContent = `${result.latencyMs} ms`;
    statPrivacy.textContent = result.isPrivateZeroCloud
      ? "100% On-Device (Zero Cloud)"
      : "Hybrid Sanitized (Firebase)";
    statPrivacy.className = result.isPrivateZeroCloud
      ? "text-sm font-bold text-emerald-400 mt-1 block"
      : "text-sm font-bold text-cyan-400 mt-1 block";
  } catch (err) {
    console.error(err);
    reportContainer.innerHTML = `<div class="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-200">Error executing audit: ${err.message}</div>`;
  } finally {
    btnRunAudit.disabled = false;
    btnRunAudit.classList.remove("opacity-60", "cursor-not-allowed");
  }
});

// Export Markdown
btnExportMd.addEventListener("click", () => {
  if (!latestReportContent) {
    alert("Please execute an audit first before exporting.");
    return;
  }
  const blob = new Blob([latestReportContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `OmniAudit-Report-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
});

// Samples
btnSampleContract.addEventListener("click", () => {
  docText.value = `MUTUAL NON-DISCLOSURE & LIABILITY AGREEMENT
Date: November 12, 2026
Between:
Acme Global Logistics Inc., represented by Johnathan Doe (SSN: 045-89-1234, email: jdoe@acmelogistics.com, Tel: +1-555-839-2041), located at 124 Market St, Suite 400, San Francisco CA.
AND
Integraciones TRC S.A. de C.V., represented by Alfredo Alvarado (RFC: ALVA890412-TR1, email: alfredo@example.com).

1. CONFIDENTIAL INFORMATION
All shared financial ledgers, customer credit card records (including test card 4532-8921-9943-1284), and intellectual property remain confidential.

2. UNLIMITED LIABILITY & PENAL CLAUSE
In the event of any unauthorized disclosure, even if inadvertent, the receiving party agrees to assume UNLIMITED LIABILITY for all direct, indirect, punitive, and consequential damages, plus an immediate non-negotiable penalty fee of $500,000 USD payable within 5 business days without proof of actual loss.

3. UNILATERAL TERMINATION
Acme Global Logistics reserves the right to terminate this agreement immediately at its sole discretion with 0 days notice.

4. GOVERNING LAW
Any dispute shall be litigated in the courts of Delaware without right to arbitration.`;
  charCount.textContent = `${docText.value.length} chars`;
});

btnSampleSaaS.addEventListener("click", () => {
  docText.value = `MASTER SERVICES AGREEMENT (SaaS)
Provider: CloudScale Enterprise Solutions Inc. (billing@cloudscale.io)
Customer: Retail Commerce Partners LLC

1. SERVICE LEVEL AGREEMENT (SLA)
Provider will use commercially reasonable efforts to maintain 99.5% uptime. However, Provider shall have zero liability for unannounced downtime lasting under 48 consecutive hours.

2. INDEMNIFICATION BY CUSTOMER
Customer shall defend, indemnify, and hold harmless Provider against any third-party claim arising from Customer Data, regardless of Provider fault. Provider's total aggregate liability under this agreement for any cause whatsoever shall not exceed $100 USD.

3. DATA PROTECTION
Provider may process customer contact details (e.g. support phone +1-800-555-0199) and anonymized telemetry for internal product benchmarking.`;
  charCount.textContent = `${docText.value.length} chars`;
});
