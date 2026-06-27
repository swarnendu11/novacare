/**
 * Generate and "download" a prescription PDF in the browser.
 * Uses the browser's print dialog targeted at a hidden iframe – no backend needed.
 */

import { mockPrescriptions } from "../services/mockData";
import { formatDateIndian } from "./formatIndian";

export async function downloadPrescriptionPdf(id) {
  const p = mockPrescriptions.getById(id);
  if (!p) throw new Error("Prescription not found");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Prescription #${p.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
    h1 { color: #2563EB; margin-bottom: 4px; }
    .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .section { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; }
    td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>NovaCare</h1>
  <p class="subtitle">Smart Healthcare. Simplified.</p>
  <hr style="border-color:#e5e7eb;margin-bottom:24px" />

  <div style="display:flex;gap:40px;margin-bottom:24px">
    <div class="section">
      <div class="label">Patient</div>
      <div class="value">${p.patientName || "—"}</div>
    </div>
    <div class="section">
      <div class="label">Doctor</div>
      <div class="value">${p.doctorName || "—"}</div>
    </div>
    <div class="section">
      <div class="label">Date</div>
      <div class="value">${formatDateIndian(p.date)}</div>
    </div>
    <div class="section">
      <div class="label">Prescription #</div>
      <div class="value">${p.id}</div>
    </div>
  </div>

  <div class="section">
    <div class="label">Diagnosis</div>
    <div class="value">${p.diagnosis || "—"}</div>
  </div>

  <div class="section">
    <div class="label">Medicines</div>
    <table>
      <tr>
        <th>Medicine</th>
        <th>Dosage</th>
        <th>Frequency</th>
        <th>Duration</th>
      </tr>
      ${(p.medicines || [])
        .map(
          (m) => `
      <tr>
        <td>${m.name || "—"}</td>
        <td>${m.dosage || "—"}</td>
        <td>${m.frequency || "—"}</td>
        <td>${m.duration || "—"}</td>
      </tr>`,
        )
        .join("")}
    </table>
  </div>

  ${p.notes ? `<div class="section"><div class="label">Notes / Instructions</div><div class="value">${p.notes}</div></div>` : ""}

  <div class="footer">
    This is a computer-generated prescription from NovaCare Health System.
    Prescription #${p.id} | Generated: ${new Date().toLocaleString("en-IN")}
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank", "width=800,height=600");
  if (!win)
    throw new Error("Popup blocked. Allow popups to download prescriptions.");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
