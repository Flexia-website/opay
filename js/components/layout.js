// ---- Shared layout pieces used across many pages ----

// Simple back-header used by most sub-pages
function PageHeader(title, opts = {}) {
  const rightHtml = opts.right || "";
  return `
  <header class="app-header flex items-center justify-between" style="padding:0.75rem 1rem;">
    <div style="display:flex;align-items:center;gap:0.625rem;">
      <button data-nav-back style="display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;margin-left:-0.375rem;border-radius:9999px;border:none;background:transparent;color:#111827;">${Icon("arrow-left", { size: 20 })}</button>
      <h1 style="font-size:1.0625rem;font-weight:600;margin:0;letter-spacing:-0.01em;">${title}</h1>
    </div>
    <div>${rightHtml}</div>
  </header>`;
}

function bindPageHeader(container, backPath) {
  const btn = container.querySelector("[data-nav-back]");
  if (btn) {
    btn.addEventListener("click", () => {
      if (backPath) navigate(backPath);
      else history.back();
    });
  }
}

// Bottom nav (dashboard, rewards, finance, cards, me all reuse this) —
// pinned to the viewport with .app-bottom-nav (see base.css); pages that
// render it should add the .pb-nav-safe class to their outer wrapper so
// content never sits underneath it.
function BottomNav(activeKey) {
  const primaryColor = Stores.customization.get().primaryColor;
  const navItems = [
    { icon: "home", label: "Home", path: "/dashboard", key: "home" },
    { icon: "star", label: "Rewards", path: "/rewards", key: "rewards" },
    { icon: "trending-up", label: "Finance", path: "/finance", key: "finance" },
    { icon: "credit-card", label: "Cards", path: "/cards", key: "cards" },
    { icon: "more-horizontal", label: "Me", path: "/me", key: "me" },
  ];
  return `
  <nav class="app-bottom-nav">
    <div class="flex justify-between items-center">
      ${navItems
        .map((item) => {
          const active = item.key === activeKey;
          return `
        <button data-nav="${item.path}" class="app-bottom-nav-item" style="color:${active ? primaryColor : "#94a3b8"};">
          <span style="display:flex;transform:${active ? "translateY(-1px)" : "none"};transition:transform .15s ease;">${Icon(item.icon, { size: 21, strokeWidth: active ? 2.3 : 2 })}</span>
          <span style="font-weight:${active ? 600 : 500};">${item.label}</span>
        </button>`;
        })
        .join("")}
    </div>
  </nav>`;
}

function bindBottomNav(container) {
  container.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.nav));
  });
}

window.PageHeader = PageHeader;
window.bindPageHeader = bindPageHeader;
window.BottomNav = BottomNav;
window.bindBottomNav = bindBottomNav;
