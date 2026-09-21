document.addEventListener("DOMContentLoaded", () => {
  const reportsGrid = document.getElementById("reports-grid");
  const searchInput = document.getElementById("search-input");
  const filterType = document.getElementById("filter-type");
  const filterStatus = document.getElementById("filter-status");

  function renderList() {
    const allReports = getReports();
    const query = searchInput.value.toLowerCase().trim();
    const selectedType = filterType.value;
    const selectedStatus = filterStatus.value;

    const filtered = allReports.filter(report => {
      const matchQuery = report.id.toLowerCase().includes(query) ||
                         report.location.toLowerCase().includes(query) ||
                         report.description.toLowerCase().includes(query);
      const matchType = !selectedType || report.issueType === selectedType;
      const matchStatus = !selectedStatus || report.status === selectedStatus;
      return matchQuery && matchType && matchStatus;
    });

    if (filtered.length === 0) {
      reportsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: white; border-radius: var(--radius); border: 1px solid var(--border);">
          <h3>No matching road damage reports found</h3>
          <p>Try modifying your search criteria or filter selections.</p>
        </div>
      `;
      return;
    }

    reportsGrid.innerHTML = filtered.map(item => `
      <div class="report-card">
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.issueType}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Preview';">
        </div>
        <div class="card-body">
          <div class="card-header-meta">
            <span class="report-id">${item.id}</span>
            ${getStatusBadge(item.status)}
          </div>
          <h3 class="card-title">${item.issueType}</h3>
          <div class="card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${item.location}
          </div>
          <p class="card-desc">${item.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid var(--border); padding-top: 0.85rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">${item.date}</span>
            <a href="details.html?id=${item.id}" class="btn btn-secondary btn-sm">Inspect Status</a>
          </div>
        </div>
      </div>
    `).join("");
  }

  searchInput.addEventListener("input", renderList);
  filterType.addEventListener("change", renderList);
  filterStatus.addEventListener("change", renderList);

  renderList();
});