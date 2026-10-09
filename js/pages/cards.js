function renderCardsPage(container) {
  const primaryColor = Stores.customization.get().primaryColor;
  let showDialPad = false;
  let action = "";
  let cardLocked = false;

  function cardArt(bg, label, brand) {
    return `
    <div style="position:relative;overflow:hidden;border-radius:1.25rem;padding:1.25rem;height:11rem;background:${bg};box-shadow:0 10px 30px -8px rgb(0 0 0 / 0.25);">
      <svg width="220" height="220" viewBox="0 0 220 220" style="position:absolute;right:-3.5rem;top:-3rem;opacity:0.5;" fill="none">
        <circle cx="110" cy="110" r="95" stroke="white" stroke-opacity="0.35" stroke-width="14"/>
        <circle cx="110" cy="110" r="70" stroke="white" stroke-opacity="0.25" stroke-width="10"/>
      </svg>
      <div style="position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-between;height:100%;">
        <div style="font-weight:800;font-size:1.375rem;color:white;letter-spacing:-0.02em;">${label}</div>
        <div class="flex items-center justify-between">
          <span style="color:white;font-weight:600;font-size:0.9375rem;">${brand}</span>
          <span style="width:1.75rem;height:1.75rem;border-radius:9999px;background:#ee2b3c;display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;font-weight:800;font-style:italic;">V</span>
        </div>
      </div>
    </div>`;
  }

  function mainContent() {
    return `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div class="flex items-center justify-center" style="gap:2.5rem;">
        <div style="text-align:center;">
          <span style="background:#fee2e2;color:#dc2626;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:9999px;">20% OFF</span>
          <p style="font-family:cursive;font-weight:700;color:#111827;margin:2px 0 0;text-decoration:underline;">Virtual Card</p>
        </div>
        <div style="text-align:center;opacity:0.4;">
          <span style="background:#fee2e2;color:#dc2626;font-size:0.6875rem;font-weight:800;padding:2px 8px;border-radius:9999px;">25% OFF</span>
          <p style="font-family:cursive;font-weight:700;color:#111827;margin:2px 0 0;">Physical Card</p>
        </div>
      </div>
    </div>

    <div style="position:relative;margin-bottom:1.5rem;">
      <div style="position:absolute;left:-1.5rem;top:0.75rem;bottom:0.75rem;width:2.5rem;border-radius:1rem;background:linear-gradient(135deg,#f59e0b,#111827);opacity:0.6;"></div>
      ${cardArt(cardLocked ? "linear-gradient(135deg,#9ca3af,#4b5563)" : `linear-gradient(135deg,${primaryColor},#00814a)`, "OPay", "Virtual Card")}
      <div style="position:absolute;right:-1.5rem;top:0.75rem;bottom:0.75rem;width:2.5rem;border-radius:1rem;background:linear-gradient(135deg,#eab308,#a16207);opacity:0.6;"></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;margin-bottom:1.25rem;">
      <div style="text-align:center;padding:0.625rem;background:#f5f6f8;">
        <span style="font-size:0.8125rem;font-weight:700;color:#374151;">OPay Verve Classic</span>
      </div>
      <div style="padding:0.25rem 1rem 1rem;">
        ${[
          ["zap", "Instant Access", "Use it instantly after quick application"],
          ["globe", "Accepted at 40,000+ Online Merchants", "Including GooglePlay, Netflix, Glovo, Shein, Jumia, Konga, Uber Wallet Funding, and more"],
          ["store", "Self-managed Transactions", "Unique Merchant Control, Unlimited Convenience"],
          ["shield", "NO maintenance fee", "Free & switch your favorite card design anytime"],
          ["shield-check", "Safe & Secure", "CBN licensed, NDIC Insured"],
        ]
          .map(
            ([icon, title, desc], i, arr) => `
          <div style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem 0;${i < arr.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
            <div style="width:2rem;height:2rem;border-radius:0.5rem;background:#dcf3e3;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0;">${Icon(icon, { size: 17 })}</div>
            <div>
              <p style="font-weight:700;font-size:0.875rem;color:#111827;margin:0;">${title}</p>
              <p style="font-size:0.8125rem;color:#6b7280;margin:2px 0 0;line-height:1.4;">${desc}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="grid" style="grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
      <button id="lock-btn" ${cardLocked ? "disabled" : ""} class="card" style="padding:1rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem;border:none;opacity:${cardLocked ? 0.5 : 1};">
        <div style="width:2.75rem;height:2.75rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}17;">
          <span style="color:${primaryColor};">${Icon("lock", { size: 20 })}</span>
        </div>
        <span style="font-size:0.875rem;font-weight:600;">Lock Card</span>
      </button>
      <button id="unlock-btn" ${!cardLocked ? "disabled" : ""} class="card" style="padding:1rem;display:flex;flex-direction:column;align-items:center;gap:0.5rem;border:none;opacity:${!cardLocked ? 0.5 : 1};">
        <div style="width:2.75rem;height:2.75rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}17;">
          <span style="color:${primaryColor};">${Icon("unlock", { size: 20 })}</span>
        </div>
        <span style="font-size:0.875rem;font-weight:600;">Unlock Card</span>
      </button>
    </div>

    <div class="card" style="margin-bottom:1.25rem;">
      <div class="card-header"><h3 class="card-title" style="font-size:1.0625rem;">Card Details</h3></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:0.625rem;">
        <div class="flex justify-between"><span style="color:#6b7280;font-size:0.875rem;">Card Number</span><span style="font-weight:600;font-size:0.875rem;">**** **** **** 7890</span></div>
        <div class="flex justify-between"><span style="color:#6b7280;font-size:0.875rem;">Expiry Date</span><span style="font-weight:600;font-size:0.875rem;">12/26</span></div>
        <div class="flex justify-between"><span style="color:#6b7280;font-size:0.875rem;">CVV</span><span style="font-weight:600;font-size:0.875rem;">***</span></div>
        <div class="flex justify-between"><span style="color:#6b7280;font-size:0.875rem;">Card Type</span><span style="font-weight:600;font-size:0.875rem;">Virtual</span></div>
      </div>
      <div class="card-footer">
        <button id="copy-btn" class="btn btn-outline" style="width:100%;">Copy Details</button>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:1rem;">
      <span style="font-size:0.8125rem;color:#6b7280;">Discount expires in <span style="color:#16a34a;font-weight:700;">28 Days 15h</span></span>
    </div>
    <button id="get-card-btn" style="width:100%;background:${primaryColor};color:white;padding:1rem;border-radius:9999px;font-size:1rem;font-weight:800;border:none;box-shadow:0 8px 20px -6px ${primaryColor}90;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
      <span style="width:1.25rem;height:1.25rem;border-radius:9999px;background:#fbbf24;display:flex;align-items:center;justify-content:center;font-size:0.6875rem;color:white;font-weight:800;">₦</span>
      Get It for just <span style="text-decoration:line-through;opacity:0.7;">₦1000</span> ₦800
    </button>`;
  }

  function render() {
    container.innerHTML = `
    <div class="pb-nav-safe" style="min-height:100vh;background:#f5f6f8;">
      <div style="padding:1rem 1rem 0;display:flex;align-items:center;justify-content:space-between;">
        <h1 style="font-size:1.75rem;font-weight:800;color:#111827;margin:0;">Cards</h1>
        <span style="color:#16a34a;font-weight:700;font-size:0.875rem;">Q&amp;A</span>
      </div>
      <div id="cards-body" style="padding:1.25rem 1rem 1rem;"></div>
      ${BottomNav("cards")}
    </div>`;
    bindBottomNav(container);
    const body = container.querySelector("#cards-body");

    if (!showDialPad) {
      body.innerHTML = mainContent();
      container.querySelector("#lock-btn").addEventListener("click", () => initiateAction("lock"));
      container.querySelector("#unlock-btn").addEventListener("click", () => initiateAction("unlock"));
      container.querySelector("#copy-btn").addEventListener("click", () => toast.success("Card details copied to clipboard"));
      container.querySelector("#get-card-btn").addEventListener("click", () => toast.success("Application started!"));
    } else {
      body.innerHTML = `<div class="card" style="padding:1.25rem;"><div id="dialpad-mount"></div></div>`;
      renderDialPad(container.querySelector("#dialpad-mount"), {
        title: action === "lock" ? "Enter PIN to Lock Card" : "Enter PIN to Unlock Card",
        onComplete: handlePinComplete,
        onCancel: () => {
          showDialPad = false;
          action = "";
          render();
        },
      });
    }
  }

  function initiateAction(actionType) {
    action = actionType;
    showDialPad = true;
    render();
  }

  function handlePinComplete(pin) {
    if (pin === "0803") {
      if (action === "lock") {
        cardLocked = true;
        toast.success("Card locked successfully");
      } else if (action === "unlock") {
        cardLocked = false;
        toast.success("Card unlocked successfully");
      }
      showDialPad = false;
      action = "";
      render();
    } else {
      toast.error("Incorrect PIN");
    }
  }

  render();
}

window.renderCardsPage = renderCardsPage;
