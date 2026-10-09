// Format balance to display decimals properly
function formatBalanceMe(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Math.floor(balance).toLocaleString();
}

function renderMePage(container, routeState) {
  let isLocked = true;
  let passcode = "";
  let showBalanceAdjuster = (routeState && routeState.openBalanceAdjuster) || false;
  let showBalance = false;

  function lockedHtml() {
    return `
    <div style="min-height:100vh;background:#f9fafb;display:flex;align-items:center;justify-content:center;">
      <div class="card" style="padding:2rem;width:100%;max-width:24rem;margin:0 1rem;">
        <h2 style="font-size:1.25rem;font-weight:600;text-align:center;margin:0 0 1.5rem;">Enter Passcode</h2>
        <input id="passcode-input" type="password" placeholder="Enter 4-digit passcode" maxlength="4" class="input" style="margin-bottom:1rem;" />
        <button id="unlock-btn" class="btn" style="width:100%;background:#059669;color:white;" disabled>Unlock</button>
      </div>
    </div>`;
  }

  function bindLocked() {
    const input = container.querySelector("#passcode-input");
    const btn = container.querySelector("#unlock-btn");
    input.addEventListener("input", () => {
      btn.disabled = input.value.length !== 4;
    });
    function submit() {
      if (input.value === "0000") {
        isLocked = false;
        toast.success("Access granted");
        renderUnlocked();
      } else {
        toast.error("Invalid passcode");
        input.value = "";
        btn.disabled = true;
      }
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.length === 4) submit();
    });
  }

  function Row({ icon, label, desc, badge, danger, action, id }) {
    return `
    <button data-row="${id}" style="width:100%;display:flex;align-items:center;gap:1rem;padding:1rem;border-bottom:1px solid #f3f4f6;background:none;border-left:none;border-right:none;border-top:none;text-align:left;">
      <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;background:${danger ? "#fef2f2" : "#d1fae5"};color:${danger ? "#ef4444" : "#059669"};">
        ${Icon(icon, { size: 20 })}
      </div>
      <div style="flex:1;text-align:left;">
        <div style="font-weight:500;color:${danger ? "#ef4444" : "#111827"};">${label}</div>
        ${desc ? `<div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">${desc}</div>` : ""}
      </div>
      ${badge ? `<span style="background:#f87171;color:white;font-size:10px;padding:2px 8px;border-radius:9999px;">${badge}</span>` : ""}
      ${Icon("chevron-right", { size: 16, class: "" })}
    </button>`;
  }

  const primaryItems = [
    { id: "txhistory", icon: "file-text", label: "Transaction History", desc: "" },
    { id: "limits", icon: "gauge", label: "Account Limits", desc: "View your transaction limits" },
    { id: "cards", icon: "credit-card", label: "Bank Card/Account", desc: "Add payment option" },
    { id: "bizpayment", icon: "store", label: "My BizPayment", desc: "Receive payment for business" },
    { id: "ojunior", icon: "users", label: "OJunior", desc: "Create an account for your child/ward", badge: "New" },
  ];
  const secondaryItems = [
    { id: "security", icon: "shield-check", label: "Security Center", desc: "Protect your funds" },
    { id: "support", icon: "headphones", label: "Customer Service Center", desc: "" },
    { id: "invitation", icon: "party-popper", label: "Invitation", desc: "" },
    { id: "adjustbalance", icon: "wallet", label: "Adjust Balance", desc: "Add or remove funds" },
    { id: "addmoney", icon: "plus-circle", label: "Add Money", desc: "Fund your account" },
    { id: "appearance", icon: "palette", label: "Appearance", desc: "Customize the app" },
    { id: "signout", icon: "log-out", label: "Sign Out", desc: "", danger: true },
  ];

  function unlockedHtml() {
    const { profilePhoto } = Stores.customization.get();
    const { balance } = Stores.balance.get();
    return `
    <div class="pb-nav-safe" style="min-height:100vh;background:#f9fafb;">
      <div style="background:#e8f5ec;padding:1.5rem 1.25rem;position:relative;overflow:hidden;">
        <div class="flex items-start justify-between" style="margin-bottom:0.75rem;">
          <div class="flex items-center" style="gap:0.75rem;">
            <div style="width:3.5rem;height:3.5rem;border-radius:9999px;background:${profilePhoto ? 'transparent' : '#111827'};display:flex;align-items:center;justify-content:center;">
              ${profilePhoto ? `<img src="${profilePhoto}" style="width:100%;height:100%;object-fit:contain;" />` : `<span style="color:white;">${Icon("user", { size: 20 })}</span>`}
            </div>
            <div>
              <h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin:0;">Hi, CLINTON</h2>
              <span style="display:inline-flex;align-items:center;gap:4px;margin-top:4px;background:#fef3c7;color:#b45309;font-size:0.75rem;padding:2px 8px;border-radius:9999px;">Tier 3</span>
            </div>
          </div>
          <span style="color:#374151;">${Icon("hexagon", { size: 28 })}</span>
        </div>
        <div style="margin-top:1rem;">
          <button id="toggle-balance-me" style="display:flex;align-items:center;gap:0.5rem;color:#374151;font-size:0.875rem;background:none;border:none;">
            Total Balance ${Icon(showBalance ? "eye" : "eye-off", { size: 16 })}
          </button>
          <div style="font-size:1.875rem;font-weight:700;color:#111827;letter-spacing:0.05em;margin-top:4px;">
            ${showBalance ? "₦" + formatBalanceMe(balance) : "****"}
          </div>
          <div style="margin-top:0.75rem;display:inline-flex;align-items:center;gap:0.5rem;background:white;border-radius:9999px;padding:0.5rem 1rem;font-size:0.875rem;">
            Interest Credited Today <span style="color:#059669;font-weight:600;letter-spacing:0.05em;">****</span>
          </div>
        </div>
      </div>

      <div style="margin:-0.75rem 1rem 0;background:#10b981;border-radius:1rem;padding:1rem;display:flex;align-items:center;gap:0.75rem;color:white;position:relative;z-index:1;">
        ${Icon("shield-check", { size: 24 })}
        <div style="flex:1;">
          <div style="font-weight:600;">Security Check is not turned on</div>
          <div style="font-size:0.75rem;opacity:0.9;margin-top:2px;">Make your account more secure with extra safety checks.</div>
        </div>
        <button style="background:white;color:#059669;font-weight:600;padding:0.5rem 1rem;border-radius:9999px;font-size:0.875rem;border:none;">Turn On</button>
      </div>

      <div id="ba-wrap" style="margin:1rem 1rem 0;">${showBalanceAdjuster ? BalanceAdjusterHtml() : ""}</div>

      <div style="margin:1rem 1rem 0;background:white;border-radius:1rem;overflow:hidden;">
        ${primaryItems.map(Row).join("")}
      </div>
      <div style="margin:1rem 1rem 0;background:white;border-radius:1rem;overflow:hidden;">
        ${secondaryItems.map(Row).join("")}
      </div>
      ${BottomNav("me")}
    </div>`;
  }

  function bindUnlocked() {
    bindBottomNav(container);
    const toggleBtn = container.querySelector("#toggle-balance-me");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        showBalance = !showBalance;
        renderUnlocked();
      });
    }
    container.querySelectorAll("[data-row]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.row;
        switch (id) {
          case "txhistory":
            navigate("/transaction-history");
            break;
          case "cards":
            navigate("/cards");
            break;
          case "invitation":
            navigate("/invitation");
            break;
          case "adjustbalance":
            showBalanceAdjuster = !showBalanceAdjuster;
            renderUnlocked();
            break;
          case "addmoney":
            showAddMoneyModal();
            break;
          case "appearance":
            navigate("/customization");
            break;
          case "signout":
            navigate("/");
            break;
          default:
            toast("Coming soon");
        }
      });
    });
    if (showBalanceAdjuster) {
      const baWrap = container.querySelector("#ba-wrap");
      bindBalanceAdjuster(baWrap, () => {
        showBalanceAdjuster = false;
        renderUnlocked();
      });
    }
  }

  function renderUnlocked() {
    container.innerHTML = unlockedHtml();
    bindUnlocked();
  }

  if (isLocked) {
    container.innerHTML = lockedHtml();
    bindLocked();
  } else {
    renderUnlocked();
  }
}

window.renderMePage = renderMePage;
