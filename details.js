document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("details-container");
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id");

  if (!reportId) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2>Missing Ticket Identifier</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">No valid incident ID was passed in query parameters.</p>
        <a href="reports.html" class="btn btn-primary">Return to Catalog</a>
      </div>
    `;
    return;
  }

  const report = getReportById(reportId);

  if (!report) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h2>Report Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The ticket ID "${reportId}" does not exist in local records.</p>
        <a href="reports.html" class="btn btn-primary">Browse All Reports</a>
      </div>
    `;
    return;
  }

  // 4-Stage State Progression Matrix
  const stages = ["Reported", "Under Review", "In Progress", "Resolved"];
  const currentIdx = stages.indexOf(report.status);

  const timelineHtml = `
    <div class="timeline">
      ${stages.map((st, idx) => {
        let stepClass = "";
        let markIcon = idx + 1;
        if (idx < currentIdx) {
          stepClass = "completed";
          markIcon = "&#10003;";
        } else if (idx === currentIdx) {
          stepClass = "active";
        }
        return `
          <div class="timeline-step ${stepClass}">
            <div class="step-marker">${markIcon}</div>
            <div class="step-title">${st}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  container.innerHTML = `
    <div class="card" style="max-width: 900px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div>
          <span class="report-id" style="font-size: 1rem;">${report.id}</span>
          <h1 style="font-size: 1.75rem; margin-top: 0.25rem;">${report.issueType}</h1>
        </div>
        <div>${getStatusBadge(report.status)}</div>
      </div>

      <!-- Lifecycle Visualizer -->
      ${timelineHtml}

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
        <div>
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Incident Details</h3>
          <table style="width: 100%; font-size: 0.95rem; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Location:</td><td style="font-weight: 600; text-align: right;">${report.location}</td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Date Noticed:</td><td style="font-weight: 600; text-align: right;">${report.date}</td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Filed By:</td><td style="font-weight: 600; text-align: right;">${report.name}</td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Contact Phone:</td><td style="font-weight: 600; text-align: right;">${report.phone}</td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0; color: var(--text-muted);">Contact Email:</td><td style="font-weight: 600; text-align: right;">${report.email}</td></tr>
          </table>

          <div style="margin-top: 1.5rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Citizen Description</h4>
            <p style="background: #f8fafc; border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius); font-size: 0.9rem; color: #334155;">
              ${report.description}
            </p>
          </div>
        </div>

        <div>
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Photographic Evidence</h3>
          <div style="width: 100%; height: 280px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border);">
            <img src="${report.image}" alt="Damage Proof" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Unavailable';">
          </div>
        </div>
      </div>
    </div>
  `;
});