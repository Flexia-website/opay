function renderSafeboxInterestsPage(container) {
  const dailyBreakdown = [
    { date: "01 Aug 2026", interest: 0.09, balance: 6.12, credited: true },
    { date: "02 Aug 2026", interest: 0.09, balance: 8.91, credited: true },
    { date: "03 Aug 2026", interest: 0.09, balance: 8.91, credited: true },
    { date: "04 Aug 2026", interest: 0, balance: 0.0, credited: false },
  ];
  const monthTotal = dailyBreakdown.reduce((t, d) => t + d.interest, 0);

  container.innerHTML = `
  <div style="min-height:100vh;background:white;">
    <div style="padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
      <button id="sbi-back" style="display:flex;align-items:center;gap:2px;background:none;border:none;">
        ${Icon("chevron-left", { size: 20 })}
        <span style="font-size:1.0625rem;font-weight:800;">Interests</span>
      </button>
      <button id="sbi-close" style="background:none;border:none;color:#111827;">${Icon("x", { size: 20 })}</button>
    </div>

    <div style="padding:0.5rem 1.25rem 1.5rem;">
      <h2 style="font-size:1.375rem;font-weight:800;color:#0aab63;margin:0 0 0.75rem;">Interest Breakdown</h2>
      <p style="color:#6b7280;font-size:0.9375rem;line-height:1.5;margin:0 0 0.75rem;">Interest on SafeBox is calculated daily and paid on the first day of the following month.</p>
      <p style="color:#6b7280;font-size:0.9375rem;line-height:1.5;margin:0 0 1.5rem;">In compliance with Nigerian tax regulations, a Withholding Tax of 10% applies to the interest earned on your savings.</p>

      <div style="background:#e2f6e9;border-radius:1rem;padding:1.25rem;text-align:center;position:relative;margin-bottom:1.5rem;">
        <button id="sbi-prev-month" style="position:absolute;left:1.25rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#374151;">${Icon("chevron-left", { size: 20 })}</button>
        <div style="color:#111827;font-size:0.9375rem;margin-bottom:0.375rem;">Interest on August 2026</div>
        <div style="font-size:1.75rem;font-weight:800;color:#0aab63;">₦${formatMoney(monthTotal.toFixed(2))}</div>
      </div>

      ${dailyBreakdown
        .map(
          (d) => `
        <div style="border:1px solid ${d.credited ? "#bfe6cc" : "#e5e7eb"};border-radius:1rem;padding:1.125rem;margin-bottom:1rem;display:flex;align-items:flex-start;gap:0.75rem;${
            d.credited ? "" : "opacity:0.5;"
          }">
          ${
            d.credited
              ? `<span style="color:#059669;margin-top:2px;">${Icon("check", { size: 18 })}</span>`
              : `<span style="color:#9ca3af;margin-top:2px;">${Icon("calendar", { size: 18 })}</span>`
          }
          <div>
            <div style="font-size:1.0625rem;font-weight:700;color:${d.credited ? "#0aab63" : "#9ca3af"};">Interest:₦${formatMoney(d.interest.toFixed(2))}</div>
            <div style="font-size:0.9375rem;color:#111827;margin-top:2px;">Balance at ${d.date}：₦${formatMoney(d.balance.toFixed(2))}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>

    <div class="pb-nav-safe"></div>
    <div style="position:fixed;bottom:1.25rem;left:0;right:0;padding:0 1.25rem;max-width:480px;margin:0 auto;">
      <button id="sbi-done" style="width:100%;background:#0aab63;color:white;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;border:none;">Back</button>
    </div>
  </div>`;

  container.querySelector("#sbi-back").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbi-close").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbi-done").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbi-prev-month").addEventListener("click", () => toast("No earlier interest history"));
}

window.renderSafeboxInterestsPage = renderSafeboxInterestsPage;
