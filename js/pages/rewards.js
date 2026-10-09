function renderRewardsPage(container) {
  let activeCategory = "Airtime";
  const categories = ["Airtime", "Data", "Betting", "Electricity", "TV"];
  const quickActions = [
    { key: "friday-bonus", label: "Friday Bonus", icon: "ticket", bg: "#dbf3e6" },
    { key: "refer-friends", label: "Refer Friends", icon: "heart-handshake", bg: "#fde0e9" },
    { key: "play4achild", label: "Play4aChild", icon: "star", bg: "#fdedc9", nav: "/play4achild" },
    { key: "voucher-pack", label: "Voucher Pack", icon: "banknote", bg: "#dbf3e6" },
  ];
  const dailyBonus = [
    { key: "daily-bonus-1", name: "Glo Airtime", pct: "6%" },
    { key: "daily-bonus-2", name: "9 Mobile Airtime", pct: "5%" },
    { key: "daily-bonus-3", name: "MTN/Airtel Ai...", pct: "3.5%" },
  ];

  function render() {
    const { buttonImages } = Stores.customization.get();
    function iconOrImage(iconName, key, size, color) {
      const img = buttonImages[key];
      if (img) {
        return `<img src="${img}" alt="${key}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:0.75rem;" />`;
      }
      return `<span style="color:${color};display:flex;">${Icon(iconName, { size, strokeWidth: 2 })}</span>`;
    }
    container.innerHTML = `
    <div class="pb-nav-safe" style="min-height:100vh;background:#f5f6f8;">
      <div style="background:#dcf3e3;padding:1.25rem 1rem 1.5rem;border-radius:0 0 1.5rem 1.5rem;">
        <div class="flex items-center justify-between" style="margin-bottom:1.25rem;">
          <h1 style="font-size:1.75rem;font-weight:800;color:#111827;margin:0;">Rewards</h1>
          <button data-nav-back style="width:2rem;height:2rem;border-radius:9999px;border:1.5px solid #9ca3af;display:flex;align-items:center;justify-content:center;background:none;color:#374151;">
            ${Icon("more-horizontal", { size: 16 })}
          </button>
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem;">
          <div>
            <div class="flex items-center" style="gap:4px;color:#374151;font-size:0.8125rem;font-weight:600;margin-bottom:0.5rem;">
              Cashback ${Icon("help-circle", { size: 13 })}
            </div>
            <div class="flex items-center" style="gap:0.5rem;">
              <img src="./icons/icon-192.png" alt="Logo" style="width:24px;height:24px;object-fit:contain;flex-shrink:0;" />
              <span style="font-size:1.375rem;font-weight:800;color:#111827;">₦ 10.00</span>
              ${Icon("chevron-right", { size: 15, class: "" })}
            </div>
          </div>
          <div style="text-align:right;">
            <div class="flex items-center justify-end" style="gap:0.5rem;color:#374151;font-size:0.8125rem;font-weight:600;margin-bottom:0.5rem;">
              Voucher <span style="background:#dcf3e3;color:#0a7d3f;font-size:0.6875rem;font-weight:700;padding:1px 7px;border-radius:9999px;">₦715</span>
            </div>
            <div class="flex items-center justify-end" style="gap:0.375rem;">
              <span style="font-size:1.375rem;font-weight:800;color:#111827;">20</span>
              ${Icon("chevron-right", { size: 15 })}
            </div>
          </div>
        </div>
      </div>

      <div style="background:white;margin:-0.875rem 0.75rem 0;border-radius:1.125rem;padding:1rem 0.5rem;box-shadow:0 4px 16px -4px rgb(0 0 0 / 0.08);position:relative;z-index:1;">
        <div class="grid" style="grid-template-columns:repeat(4,1fr);">
          ${quickActions
            .map(
              (a) => `
            <button data-qa-nav="${a.nav || ""}" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;background:none;border:none;">
              <div style="width:3.25rem;height:3.25rem;border-radius:1.125rem;background:${a.bg};display:flex;align-items:center;justify-content:center;">${iconOrImage(a.icon, a.key, 26, "#111827")}</div>
              <span style="font-size:0.75rem;font-weight:600;color:#111827;text-align:center;line-height:1.15;">${a.label}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>

      <div style="padding:0 0.75rem;margin-top:1.25rem;">
        <h3 style="font-weight:800;color:#111827;margin:0 0 0.75rem;display:flex;align-items:center;gap:0.5rem;font-size:1.0625rem;">
          Hot Vouchers <span style="background:#a7f3d0;color:#065f46;font-size:0.6875rem;font-weight:800;padding:2px 7px;border-radius:0.3125rem;">₦</span>
        </h3>
        <div style="background:white;border-radius:1.125rem;padding:1rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <div class="flex items-center" style="gap:1.25rem;border-bottom:1px solid #f3f4f6;padding-bottom:0.625rem;margin-bottom:0.875rem;overflow-x:auto;" class="no-scrollbar">
            ${categories
              .map(
                (c) => `
              <button data-category="${c}" style="font-size:0.875rem;font-weight:700;background:none;border:none;padding-bottom:0.625rem;margin-bottom:-0.625rem;white-space:nowrap;color:${
                  activeCategory === c ? "#111827" : "#9ca3af"
                };border-bottom:2px solid ${activeCategory === c ? "#16a34a" : "transparent"};">${c}</button>`
              )
              .join("")}
          </div>
          <div style="background:#dcf3e3;border-radius:0.75rem;padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
            <div class="flex items-center" style="gap:0.75rem;">
              <span style="font-weight:800;font-size:0.9375rem;color:#111827;">₦20</span>
              <div style="width:1px;height:1.5rem;background:#a7d9b8;"></div>
              <div>
                <p style="font-weight:700;font-size:0.875rem;margin:0;color:#111827;">Super ${activeCategory} Voucher</p>
                <p style="font-size:0.75rem;color:#4b5563;margin:2px 0 0;">₦600 available</p>
              </div>
            </div>
            <button data-use-voucher style="background:#111827;color:white;font-size:0.8125rem;font-weight:700;padding:0.4375rem 1.125rem;border-radius:9999px;border:none;">Use</button>
          </div>
        </div>
      </div>

      <div style="padding:0 0.75rem;margin-top:1.25rem;">
        <h3 style="font-weight:800;color:#111827;margin:0 0 0.75rem;font-size:1.0625rem;">Daily Bonus</h3>
        <div style="background:white;border-radius:1.125rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);overflow:hidden;">
          ${dailyBonus
            .map(
              (b, i) => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;${i < dailyBonus.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
              <div>${iconOrImage("banknote", b.key, 28, "#16a34a")}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:0.875rem;font-weight:700;color:#111827;display:flex;align-items:center;gap:0.375rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${b.name}
                  <span style="width:0.875rem;height:0.875rem;border-radius:9999px;background:#fbbf24;display:flex;align-items:center;justify-content:center;font-size:7px;color:white;font-weight:800;flex-shrink:0;">₦</span>
                  <span style="color:#16a34a;font-size:0.8125rem;flex-shrink:0;">+Up to ${b.pct}</span>
                </div>
                <div style="font-size:0.75rem;color:#6b7280;margin-top:3px;">Buy Airtime and get up to <span style="color:#16a34a;font-weight:600;">${b.pct}</span> Cashback</div>
              </div>
              <button data-daily-go style="background:#dcf3e3;color:#0a7d3f;padding:0.4375rem 1.125rem;border-radius:9999px;font-size:0.8125rem;font-weight:700;border:none;flex-shrink:0;">Go</button>
            </div>`
            )
            .join("")}
          <button id="view-all-bonus" style="width:100%;padding:0.75rem;font-size:0.875rem;font-weight:600;color:#374151;display:flex;align-items:center;justify-content:center;gap:4px;background:none;border:none;">
            View All ${Icon("chevron-down", { size: 15, class: "" })}
          </button>
        </div>
      </div>

      ${BottomNav("rewards")}
    </div>`;

    container.querySelectorAll("[data-category]").forEach((btn) =>
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        render();
      })
    );
    container.querySelectorAll("[data-daily-go]").forEach((btn) => btn.addEventListener("click", () => navigate("/airtime")));
    container.querySelectorAll("[data-qa-nav]").forEach((btn) => {
      if (btn.dataset.qaNav) btn.addEventListener("click", () => navigate(btn.dataset.qaNav));
    });
    const useVoucher = container.querySelector("[data-use-voucher]");
    if (useVoucher) useVoucher.addEventListener("click", () => toast.success("Voucher applied!"));
    const backBtn = container.querySelector("[data-nav-back]");
    if (backBtn) backBtn.addEventListener("click", () => navigate("/dashboard"));
    bindBottomNav(container);
  }

  render();
}

window.renderRewardsPage = renderRewardsPage;
