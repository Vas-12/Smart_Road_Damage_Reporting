document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("admin-table-body");
  const adminSearch = document.getElementById("admin-search");
  const adminFilterStatus = document.getElementById("admin-filter-status");
  const demoDataBtn = document.getElementById("demo-data-btn");

  function updateMetrics(reports) {
    document.getElementById("total-count").textContent = reports.length;
    document.getElementById("reported-count").textContent = reports.filter(r => r.status === "Reported").length;
    document.getElementById("review-count").textContent = reports.filter(r => r.status === "Under Review").length;
    document.getElementById("progress-count").textContent = reports.filter(r => r.status === "In Progress").length;
    document.getElementById("resolved-count").textContent = reports.filter(r => r.status === "Resolved").length;
  }

  function renderTable() {
    const reports = getReports();
    updateMetrics(reports);

    const query = adminSearch.value.toLowerCase().trim();
    const statusVal = adminFilterStatus.value;

    const filtered = reports.filter(r => {
      const matchQuery = r.id.toLowerCase().includes(query) ||
                         r.location.toLowerCase().includes(query) ||
                         r.name.toLowerCase().includes(query);
      const matchStatus = !statusVal || r.status === statusVal;
      return matchQuery && matchStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem;">
            No incidents found matching the specified parameters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(r => `
      <tr>
        <td style="font-weight: 700; color: var(--primary);">${r.id}</td>
        <td>${r.issueType}</td>
        <td>${r.location}</td>
        <td>${r.date}</td>
        <td>${r.name}</td>
        <td>${getStatusBadge(r.status)}</td>
        <td>
          <select class="form-control" style="padding: 0.35rem; font-size: 0.85rem;" onchange="handleStatusChange('${r.id}', this.value)">
            <option value="Reported" ${r.status === "Reported" ? "selected" : ""}>Reported</option>
            <option value="Under Review" ${r.status === "Under Review" ? "selected" : ""}>Under Review</option>
            <option value="In Progress" ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Resolved" ${r.status === "Resolved" ? "selected" : ""}>Resolved</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <a href="details.html?id=${r.id}" class="btn btn-secondary btn-sm" title="View Full Report">View</a>
            <button onclick="handleDelete('${r.id}')" class="btn btn-danger btn-sm" title="Delete Report">&times;</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  window.handleStatusChange = function (id, newStatus) {
    updateReportStatus(id, newStatus);
    renderTable();
  };

  window.handleDelete = function (id) {
    if (confirm(`Are you sure you want to permanently delete incident ${id}?`)) {
      deleteReport(id);
      renderTable();
    }
  };

  demoDataBtn.addEventListener("click", () => {
    if (confirm("Reset current records back to default sample viva reports?")) {
      reloadDemoData();
      renderTable();
    }
  });

  adminSearch.addEventListener("input", renderTable);
  adminFilterStatus.addEventListener("change", renderTable);

  renderTable();
});