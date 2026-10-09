function renderSpendSavePage(container) {
  const { primaryColor } = Stores.customization.get();
  const balance = 105.18;
  const interest = 12.29;
  const activities = [
    { label: "Spend & Save from Airtime", amount: "+₦50.00", date: "Aug 03 2026 08:20:59" },
    { label: "Interest", amount: "+₦0.09", date: "Aug 03 2026 03:01:37" },
    { label: "Interest", amount: "+₦0.09", date: "Aug 02 2026 02:26:27" },
  ];
  const trendBars = [20, 55, 30, 70, 15, 10, 100];

  container.innerHTML = `
  <div style="min-height:100vh;background:#e9f7ee;padding-bottom:2rem;">
    <header style="padding:1rem;display:flex;align-items:center;justify-content:space-between;">
      <div class="flex items-center" style="gap:0.75rem;">
        <button data-nav-back style="background:none;border:none;color:#111827;">${Icon("chevron-left", { size: 22 })}</button>
        <h1 style="font-size:1.125rem;font-weight:800;margin:0;">Spend &amp; Save</h1>
      </div>
      <button style="background:none;border:none;color:#374151;font-weight:600;font-size:0.9375rem;">More</button>
    </header>

    <div style="margin:0 1rem;background:${primaryColor}17;border-radius:1.125rem;padding:1.25rem;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div class="flex items-center" style="gap:0.5rem;margin-bottom:0.5rem;">
          <span style="font-size:0.9375rem;color:#111827;">Spend &amp; Save</span>
          <span style="background:#111827;color:white;font-size:0.6875rem;font-weight:700;padding:2px 8px;border-radius:9999px;">Up to 15% p.a</span>
        </div>
        <div style="font-size:2rem;font-weight:800;color:#111827;">₦${formatMoney(balance.toFixed(2))}</div>
        <div style="font-size:0.8125rem;color:#4b5563;margin-top:2px;">Total Interest: <strong>₦${formatMoney(interest.toFixed(2))}</strong> ${Icon("chevron-right", { size: 12, class: "" })}</div>
      </div>
      <div style="color:${primaryColor};opacity:0.8;">${Icon("piggy-bank", { size: 56 })}</div>
    </div>

    <div class="card" style="margin:1rem;padding:1rem;">
      <div class="flex items-center justify-between" style="margin-bottom:0.75rem;">
        <span style="font-weight:700;font-size:0.9375rem;">Saving Settings</span>
        <span style="background:${primaryColor}17;color:${primaryColor};font-size:0.75rem;font-weight:700;padding:2px 10px;border-radius:9999px;">Active</span>
      </div>
      <div style="border-top:1px solid #f3f4f6;padding-top:0.875rem;display:flex;align-items:center;justify-content:space-between;">
        <div><span style="font-size:1.5rem;font-weight:800;">10%</span> <span style="color:#6b7280;font-size:0.875rem;">of per payment</span></div>
        <button id="change-btn" style="background:${primaryColor}17;color:${primaryColor};border:none;padding:0.5rem 1.25rem;border-radius:9999px;font-weight:700;font-size:0.8125rem;">Change</button>
      </div>
    </div>

    <div class="card" style="margin:1rem;padding:1rem;">
      <span style="font-weight:700;font-size:0.9375rem;">Weekly Saving Trend</span>
      <div style="border-top:1px solid #f3f4f6;margin-top:0.75rem;padding-top:1rem;display:flex;align-items:flex-end;justify-content:space-between;">
        <div><span style="font-size:1.5rem;font-weight:800;">1</span> <span style="color:#6b7280;font-size:0.875rem;">times</span></div>
        <div style="display:flex;align-items:flex-end;gap:5px;height:2.5rem;">
          ${trendBars.map((h, i) => `<div style="width:6px;height:${h}%;background:${i === trendBars.length - 1 ? primaryColor : primaryColor + "55"};border-radius:3px;"></div>`).join("")}
        </div>
      </div>
    </div>

    <div class="card" style="margin:1rem;padding:1rem;">
      <div class="flex items-center justify-between" style="margin-bottom:0.5rem;">
        <span style="font-weight:800;font-size:1rem;">Recent activities</span>
        <button style="background:none;border:none;color:#6b7280;font-size:0.8125rem;display:flex;align-items:center;gap:2px;">View All ${Icon("chevron-right", { size: 14 })}</button>
      </div>
      ${activities
        .map(
          (a, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;${i < activities.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
          <div>
            <p style="font-weight:600;font-size:0.875rem;margin:0;color:#111827;">${a.label}</p>
            <p style="font-size:0.75rem;color:#9ca3af;margin:2px 0 0;">${a.date}</p>
          </div>
          <span style="color:#16a34a;font-weight:700;font-size:0.9375rem;display:flex;align-items:center;gap:2px;">${a.amount} ${Icon("chevron-right", { size: 13 })}</span>
        </div>`
        )
        .join("")}
    </div>

    <div style="margin:1.25rem 1rem 0;">
      <button id="withdraw-btn" style="width:100%;background:${primaryColor}17;color:${primaryColor};padding:0.875rem;border-radius:9999px;font-weight:700;border:none;font-size:0.9375rem;">Withdraw</button>
    </div>
  </div>`;

  bindPageHeader(container, "/dashboard");
  const withdrawBtn = container.querySelector("#withdraw-btn");
  if (withdrawBtn) withdrawBtn.addEventListener("click", () => toast.success("Withdrawal request submitted"));
}

window.renderSpendSavePage = renderSpendSavePage;
