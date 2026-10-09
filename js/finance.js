// Format balance to display decimals properly
function formatBalanceFinance(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Math.floor(balance).toLocaleString();
}

function renderFinancePage(container) {
  let tab = "savings";
  let showBalance = false;
  const services = [
    { key: "owealth", label: "OWealth", icon: "wallet", to: "/safebox" },
    { key: "targets", label: "Targets", icon: "target", to: "/safebox" },
    { key: "safebox", label: "SafeBox", icon: "vault", to: "/safebox" },
    { key: "fixed", label: "Fixed", icon: "lock", to: "/safebox", badge: "New" },
    { key: "spend", label: "Spend & Save", icon: "piggy-bank", to: "/safebox" },
  ];

  function render() {
    const { balance } = Stores.balance.get();
    const primaryColor = Stores.customization.get().primaryColor;
    container.innerHTML = `
    <div class="pb-nav-safe" style="min-height:100vh;background:#f5f6f8;">
      <div style="background:#dcf3e3;padding:1.25rem 1rem 1.5rem;border-radius:0 0 1.5rem 1.5rem;">
        <div class="flex items-center justify-between" style="margin-bottom:1.25rem;">
          <h1 style="font-size:1.75rem;font-weight:800;color:#111827;margin:0;">Finance</h1>
          <span style="color:#374151;">${Icon("settings", { size: 22 })}</span>
        </div>
        <div class="flex items-center" style="gap:1.75rem;margin-bottom:1rem;">
          <button id="tab-savings" style="position:relative;padding-bottom:6px;font-size:1.0625rem;background:none;border:none;font-weight:${tab === "savings" ? 800 : 500};color:${tab === "savings" ? "#111827" : "#6b7280"};">
            Savings
            ${tab === "savings" ? `<span style="position:absolute;bottom:0;left:0;width:1.375rem;height:3px;background:#111827;border-radius:9999px;"></span>` : ""}
          </button>
          <button id="tab-loan" style="position:relative;padding-bottom:6px;font-size:1.0625rem;display:flex;align-items:center;gap:5px;background:none;border:none;font-weight:${tab === "loan" ? 800 : 500};color:${tab === "loan" ? "#111827" : "#6b7280"};">
            Loan <span style="background:#f87171;color:white;font-size:9px;font-weight:800;padding:2px 6px;border-radius:9999px;margin-top:-14px;">Hot</span>
          </button>
        </div>

        <div style="background:${primaryColor};border-radius:1.125rem;padding:1.125rem;color:white;box-shadow:0 6px 20px -6px ${primaryColor}80;">
          <div class="flex items-start justify-between">
            <div>
              <button id="toggle-balance" style="display:flex;align-items:center;gap:0.4375rem;font-size:0.8125rem;font-weight:600;opacity:0.92;margin-bottom:5px;background:none;border:none;color:white;">
                Total Balance ${Icon(showBalance ? "eye" : "eye-off", { size: 14 })}
              </button>
              <div style="font-size:1.5rem;font-weight:800;letter-spacing:0.02em;">${showBalance ? "₦" + formatBalanceFinance(balance) : "****"}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.8125rem;font-weight:600;opacity:0.92;margin-bottom:5px;">Interest Credited Today</div>
              <div class="flex items-center justify-end" style="gap:3px;font-size:1.5rem;font-weight:800;letter-spacing:0.02em;">
                ${showBalance ? "₦0.00" : "****"} ${Icon("chevron-right", { size: 18, class: "" })}
              </div>
            </div>
          </div>
          <button style="margin-top:0.75rem;background:rgba(255,255,255,0.18);border-radius:9999px;padding:0.5rem 0.875rem;font-size:0.75rem;font-weight:600;border:none;color:white;display:flex;align-items:center;gap:4px;">
            Estimate interest ₦**/month, Beats **% of others ${Icon("chevron-right", { size: 13, class: "" })}
          </button>
        </div>

        <button style="width:100%;margin-top:0.375rem;padding:0.625rem;display:flex;align-items:center;justify-content:center;gap:4px;color:#047857;font-weight:700;font-size:0.875rem;background:none;border:none;">
          View Assets Breakdown ${Icon("chevron-down", { size: 15, class: "" })}
        </button>
      </div>

      <div style="background:white;margin:-0.5rem 0.75rem 0;border-radius:1.125rem;padding:1.125rem 0.5rem;box-shadow:0 4px 16px -4px rgb(0 0 0 / 0.08);position:relative;z-index:1;">
        <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:0.25rem;">
          ${services
            .map(
              (s) => `
            <button data-svc-nav="${s.to}" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;position:relative;background:none;border:none;">
              <div style="position:relative;">
                <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:#dcf3e3;display:flex;align-items:center;justify-content:center;color:#059669;">${Icon(s.icon, { size: 22 })}</div>
                ${s.badge ? `<span style="position:absolute;top:-5px;right:-8px;background:#f87171;color:white;font-size:8px;font-weight:800;padding:2px 5px;border-radius:9999px;">${s.badge}</span>` : ""}
              </div>
              <span style="font-size:0.6875rem;font-weight:600;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center;">${s.label}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>

      <div style="margin:1rem 0.75rem 0;border-radius:1.125rem;overflow:hidden;position:relative;background:linear-gradient(120deg,#312e81,#4c1d95);padding:1.125rem;">
        <div style="position:relative;z-index:1;">
          <h3 style="font-size:1.125rem;font-weight:800;color:white;line-height:1.3;margin:0;">OPay Affiliate Program</h3>
          <p style="font-size:0.75rem;color:#e0e7ff;margin-top:4px;max-width:75%;">Earn up to ₦50,000 every week by inviting friends to save with OPay</p>
          <button data-svc-nav="/invitation" style="margin-top:0.75rem;background:#a3e635;color:#1a2e05;font-weight:700;padding:0.5rem 1.125rem;border-radius:9999px;font-size:0.8125rem;border:none;">Apply Now!</button>
          <div style="font-size:8px;color:#c7d2fe;margin-top:0.75rem;display:flex;align-items:center;gap:0.5rem;">
            <span>Licensed by CBN</span><span>|</span><span>Insured by NDIC</span><span>|</span><span>Powered by OPay MFB</span>
          </div>
        </div>
      </div>

      <div class="grid" style="grid-template-columns:1fr 1fr;gap:0.75rem;margin:1rem 0.75rem 0;">
        <button data-svc-nav="/safebox" style="background:white;border-radius:1.125rem;padding:1rem;text-align:left;border:none;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <h4 style="color:#111827;font-weight:800;font-size:1.0625rem;margin:0 0 0.5rem;">10,000,000<br/><span style="color:#16a34a;">Savers Here</span></h4>
          <p style="font-size:0.8125rem;color:#4b5563;margin:0;">Save with OPay and fulfil your dreams with ease</p>
          <div style="margin-top:0.875rem;">
            <span style="background:#16a34a;color:white;padding:0.4375rem 1rem;border-radius:9999px;font-size:0.8125rem;font-weight:700;">Join Now</span>
          </div>
        </button>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <button data-svc-nav="/safebox" style="width:100%;background:white;border-radius:1.125rem;padding:1rem;text-align:left;border:none;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
            <h4 style="color:#16a34a;font-weight:800;font-size:1rem;margin:0;">SafeBox</h4>
            <p style="font-size:0.8125rem;color:#4b5563;margin-top:4px;">Flexible savings with 15% p.a.</p>
          </button>
          <button data-svc-nav="/safebox" style="width:100%;background:#dcf3e3;border-radius:1.125rem;padding:1rem;text-align:left;border:none;position:relative;">
            <span style="position:absolute;top:0.625rem;right:0.625rem;background:#ef4444;color:white;font-size:8px;font-weight:800;padding:2px 6px;border-radius:9999px;">NEW</span>
            <h4 style="color:#16a34a;font-weight:800;font-size:1rem;margin:0;">Big Friday</h4>
            <p style="font-size:0.8125rem;color:#374151;margin-top:4px;">Get <span style="color:#16a34a;font-weight:700;">25% p.a.</span> every Friday!</p>
          </button>
        </div>
      </div>

      <div class="flex items-center" style="gap:0.5rem;margin:1rem 0.75rem 1.5rem;font-size:0.75rem;color:#6b7280;">
        ${Icon("shield-check", { size: 15, class: "" })}
        <span>OWealth and Savings are Powered by OPay MicroFinance Bank Ltd.</span>
      </div>

      ${BottomNav("finance")}
    </div>`;

    container.querySelector("#tab-savings").addEventListener("click", () => { tab = "savings"; render(); });
    container.querySelector("#tab-loan").addEventListener("click", () => { tab = "loan"; navigate("/loan"); });
    container.querySelector("#toggle-balance").addEventListener("click", () => { showBalance = !showBalance; render(); });
    container.querySelectorAll("[data-svc-nav]").forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.svcNav)));
    bindBottomNav(container);
  }

  render();
}

window.renderFinancePage = renderFinancePage;
