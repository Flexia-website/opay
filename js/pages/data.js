function renderDataPage(container) {
  const durationTabs = [
    { id: "hot", name: "Hot" },
    { id: "night", name: "Extra Night" },
    { id: "daily", name: "Daily" },
    { id: "weekly_monthly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
  ];
  
  const networkDataPlans = {
    mtn: {
      hot: [
        { id: "mtn_hot_1", size: "500MB", validity: "1 Day", price: 124, description: "Super Fast" },
        { id: "mtn_hot_2", size: "1GB", validity: "3 Days", price: 235, description: "" },
        { id: "mtn_hot_3", size: "2GB", validity: "7 Days", price: 425, description: "" },
      ],
      night: [
        { id: "mtn_night_1", size: "1GB", validity: "11PM-6AM", price: 164, description: "" },
        { id: "mtn_night_2", size: "2GB", validity: "11PM-6AM", price: 294, description: "" },
      ],
      daily: [
        { id: "mtn_social_1", size: "250MB", validity: "1 Day", price: 89, description: "" },
        { id: "mtn_social_2", size: "500MB", validity: "1 Day", price: 142, description: "" },
      ],
      weekly_monthly: [
        { id: "mtn_weekly_1", size: "3.5GB", validity: "7 Days", price: 615, description: "" },
        { id: "mtn_weekly_2", size: "10GB", validity: "30 Days", price: 1825, description: "Best Value" },
      ],
      mega: [
        { id: "mtn_mega_1", size: "20GB", validity: "30 Days", price: 3650, description: "Mega Pack" },
        { id: "mtn_mega_2", size: "50GB", validity: "30 Days", price: 8550, description: "" },
      ]
    },
    airtel: {
      hot: [
        { id: "airtel_hot_1", size: "500MB", validity: "1 Day", price: 119, description: "" },
        { id: "airtel_hot_2", size: "1GB", validity: "3 Days", price: 225, description: "" },
        { id: "airtel_hot_3", size: "2GB", validity: "7 Days", price: 410, description: "" },
      ],
      night: [
        { id: "airtel_night_1", size: "1GB", validity: "12AM-5AM", price: 155, description: "" },
        { id: "airtel_night_2", size: "2GB", validity: "12AM-5AM", price: 280, description: "" },
      ],
      daily: [
        { id: "airtel_social_1", size: "300MB", validity: "1 Day", price: 95, description: "" },
        { id: "airtel_social_2", size: "600MB", validity: "1 Day", price: 155, description: "" },
      ],
      weekly_monthly: [
        { id: "airtel_weekly_1", size: "3GB", validity: "7 Days", price: 580, description: "" },
        { id: "airtel_weekly_2", size: "10GB", validity: "30 Days", price: 1650, description: "" },
      ],
      mega: [
        { id: "airtel_mega_1", size: "20GB", validity: "30 Days", price: 3300, description: "" },
        { id: "airtel_mega_2", size: "40GB", validity: "30 Days", price: 6600, description: "" },
      ]
    },
    glo: {
      hot: [
        { id: "glo_hot_1", size: "500MB", validity: "1 Day", price: 109, description: "" },
        { id: "glo_hot_2", size: "1.5GB", validity: "3 Days", price: 215, description: "" },
        { id: "glo_hot_3", size: "2.5GB", validity: "7 Days", price: 390, description: "" },
      ],
      night: [
        { id: "glo_night_1", size: "1.5GB", validity: "11:30PM-4:30AM", price: 145, description: "" },
        { id: "glo_night_2", size: "3GB", validity: "11:30PM-4:30AM", price: 260, description: "" },
      ],
      daily: [
        { id: "glo_social_1", size: "400MB", validity: "1 Day", price: 85, description: "" },
        { id: "glo_social_2", size: "750MB", validity: "1 Day", price: 145, description: "" },
      ],
      weekly_monthly: [
        { id: "glo_weekly_1", size: "4GB", validity: "7 Days", price: 560, description: "" },
        { id: "glo_weekly_2", size: "12GB", validity: "30 Days", price: 1600, description: "" },
      ],
      mega: [
        { id: "glo_mega_1", size: "25GB", validity: "30 Days", price: 3200, description: "" },
        { id: "glo_mega_2", size: "60GB", validity: "30 Days", price: 7500, description: "" },
      ]
    },
    "9mobile": {
      hot: [
        { id: "9mobile_hot_1", size: "500MB", validity: "1 Day", price: 114, description: "" },
        { id: "9mobile_hot_2", size: "1GB", validity: "3 Days", price: 220, description: "" },
        { id: "9mobile_hot_3", size: "2GB", validity: "7 Days", price: 400, description: "" },
      ],
      night: [
        { id: "9mobile_night_1", size: "1GB", validity: "12AM-5AM", price: 150, description: "" },
        { id: "9mobile_night_2", size: "1.5GB", validity: "12AM-5AM", price: 225, description: "" },
      ],
      daily: [
        { id: "9mobile_social_1", size: "350MB", validity: "1 Day", price: 90, description: "" },
        { id: "9mobile_social_2", size: "650MB", validity: "1 Day", price: 150, description: "" },
      ],
      weekly_monthly: [
        { id: "9mobile_weekly_1", size: "3.5GB", validity: "7 Days", price: 570, description: "" },
        { id: "9mobile_weekly_2", size: "10GB", validity: "30 Days", price: 1700, description: "" },
      ],
      mega: [
        { id: "9mobile_mega_1", size: "22GB", validity: "30 Days", price: 3400, description: "" },
        { id: "9mobile_mega_2", size: "55GB", validity: "30 Days", price: 8000, description: "" },
      ]
    }
  };

  // Map our stored categories onto the tabs shown in the reference UI.
  const tabToCategory = {
    hot: "hot",
    night: "night",
    daily: "daily",
    weekly_monthly: "weekly_monthly",
    monthly: "mega",
  };

  let selectedNetwork = "mtn";
  let showNetworkPicker = false;
  let phoneNumber = "0816 0881 049";
  let activeTab = "hot";
  let selectedPlan = "";
  let useCashbackForPayment = false;

  function networkLogo(net, size) {
    const { networkImages } = Stores.customization.get();
    const img = networkImages[net.id];
    if (img) {
      return `<img src="${img}" alt="${net.name}" style="width:${size}px;height:${size}px;border-radius:9999px;object-fit:cover;" />`;
    }
    return `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${net.color};color:${net.textColor};display:flex;align-items:center;justify-content:center;font-size:${size * 0.32}px;font-weight:800;">${net.name.charAt(0)}</div>`;
  }

  function getAvailablePlans(network, category) {
    const plans = networkDataPlans[network] || {};
    return plans[category] || [];
  }

  function render() {
    const { primaryColor } = Stores.customization.get();
    const { totalCashback } = Stores.cashback.get();
    const net = window.NETWORKS.find((n) => n.id === selectedNetwork);
    const category = tabToCategory[activeTab];
    const availablePlans = getAvailablePlans(selectedNetwork, category);
    const chosenPlan = availablePlans.find((p) => p.id === selectedPlan);

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:2rem;">
      <header style="background:white;padding:1rem;display:flex;align-items:center;justify-content:space-between;">
        <div class="flex items-center" style="gap:0.75rem;">
          <button data-nav-back style="background:none;border:none;color:#111827;">${Icon("chevron-left", { size: 22 })}</button>
          <h1 style="font-size:1.125rem;font-weight:700;margin:0;">Mobile Data</h1>
        </div>
        <button id="history-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;">History</button>
      </header>

      <div style="background:white;padding:0 1rem 1rem;position:relative;">
        <div class="flex items-center justify-between" style="padding:0.5rem 0;">
          <div style="display:flex;align-items:center;gap:0.5rem;flex:1;">
            <button id="network-toggle" class="flex items-center" style="gap:0.5rem;background:none;border:none;">
              ${networkLogo(net, 34)}
              <span style="color:#d1d5db;">|</span>
              ${Icon(showNetworkPicker ? "chevron-up" : "chevron-down", { size: 16, class: "" })}
            </button>
            <input id="phone-input" type="tel" inputmode="numeric" pattern="[0-9]*" value="${phoneNumber}" placeholder="Phone number"
              style="flex:1;border:none;outline:none;font-size:1.0625rem;font-weight:700;color:#111827;background:transparent;font-family:inherit;" />
          </div>
          <button id="contacts-btn" style="width:2.25rem;height:2.25rem;border-radius:9999px;background:${primaryColor};display:flex;align-items:center;justify-content:center;border:none;color:white;">
            ${Icon("user", { size: 16 })}
          </button>
        </div>

        ${
          showNetworkPicker
            ? `<div style="position:absolute;left:1rem;right:1rem;top:100%;background:#f3f4f6;border-radius:0.75rem;padding:0.5rem;box-shadow:0 8px 24px -4px rgb(0 0 0 / 0.15);z-index:10;">
            ${window.NETWORKS.map((n) => {
              const isSelected = n.id === selectedNetwork;
              return `
              <button data-select-network="${n.id}" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:none;border:none;text-align:left;">
                <div class="flex items-center" style="gap:0.75rem;">
                  ${networkLogo(n, 30)}
                  <span style="font-size:0.9375rem;font-weight:600;color:#111827;">${n.name}</span>
                </div>
                ${isSelected ? `<span style="width:1.375rem;height:1.375rem;border-radius:9999px;background:${primaryColor};display:flex;align-items:center;justify-content:center;color:white;">${Icon("check", { size: 13 })}</span>` : `<span style="width:1.375rem;height:1.375rem;border-radius:9999px;border:1.5px solid #d1d5db;"></span>`}
              </button>`;
            }).join("")}
          </div>`
            : ""
        }
      </div>

      <div style="height:0.5rem;background:#f9fafb;"></div>

      <div style="margin:0 1rem;background:linear-gradient(135deg,#0f2027,#1a2f38);border-radius:1rem;padding:1.125rem;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative;">
        <div>
          <p style="color:#4ade80;font-weight:800;font-size:1.0625rem;margin:0;line-height:1.25;">Calls Shouldn't<br/>Wait For Payday</p>
          <p style="color:white;font-size:0.75rem;margin:0.5rem 0 0;opacity:0.85;">Recharge Airtime &amp; Get<br/>Up To 6% Cashback</p>
        </div>
        <div style="color:#4ade80;opacity:0.7;">${Icon("phone", { size: 40 })}</div>
      </div>

      <div style="margin:1rem 1rem 0;background:white;border-radius:1rem;padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
        <div class="flex items-center" style="gap:0.625rem;">
          <span style="color:${primaryColor};">${Icon("banknote", { size: 24 })}</span>
          <span style="font-weight:700;font-size:0.9375rem;">Cashback</span>
          <span style="background:${primaryColor}17;color:${primaryColor};font-size:0.75rem;font-weight:700;padding:2px 10px;border-radius:9999px;">₦${formatMoney(totalCashback.toFixed(2))}</span>
        </div>
        <button id="cashback-more" style="background:none;border:none;color:#9ca3af;font-size:0.8125rem;display:flex;align-items:center;">More ${Icon("chevron-right", { size: 14 })}</button>
      </div>
      ${
        totalCashback > 0
          ? `<div style="margin:0.5rem 1rem 0;background:white;border-radius:0.75rem;padding:0.75rem 1rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <label class="flex items-center" style="gap:0.5rem;font-size:0.875rem;color:#4b5563;">
            <input type="checkbox" id="use-cashback" ${useCashbackForPayment ? "checked" : ""} style="width:1rem;height:1rem;" />
            Use cashback for this purchase
          </label>
        </div>`
          : ""
      }

      <div style="margin:1rem 1rem 0;background:linear-gradient(135deg,#0aab63,#0e8a52);border-radius:0.875rem;padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
        <span style="color:white;font-size:0.8125rem;font-weight:600;">Top-up your data anytime, anywhere</span>
      </div>
      <div style="margin:0.5rem 1rem 0;background:#1B1464;border-radius:0.75rem;padding:0.625rem 1rem;text-align:center;">
        <span style="color:#4ade80;font-weight:800;font-size:1.0625rem;letter-spacing:0.02em;">Simply Dial *955*4* mobile no#</span>
      </div>

      <div style="margin:1.25rem 1rem 0;display:flex;align-items:center;justify-content:space-between;">
        <h3 style="font-size:1.0625rem;font-weight:800;margin:0;color:#111827;">Data Plans</h3>
      </div>

      <div style="margin:0.75rem 1rem 0;display:flex;gap:1.25rem;border-bottom:1px solid #f3f4f6;overflow-x:auto;">
        ${durationTabs
          .map(
            (t) => `
          <button data-tab="${t.id}" style="background:none;border:none;padding:0.375rem 0.125rem 0.625rem;white-space:nowrap;font-size:0.9375rem;font-weight:700;color:${activeTab === t.id ? primaryColor : "#9ca3af"};border-bottom:2px solid ${activeTab === t.id ? primaryColor : "transparent"};">${t.name}</button>`
          )
          .join("")}
      </div>

      <div style="margin:0.875rem 1rem 0;">
        <div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:0.625rem;">
          ${availablePlans
            .map((p) => {
              const isSelected = selectedPlan === p.id;
              const originalPrice = Math.round(p.price / 0.97);
              const cashbackAmt = (p.price * 0.035).toFixed(1);
              return `
            <button data-plan="${p.id}" style="position:relative;text-align:left;padding:0.75rem 0.625rem;border-radius:0.875rem;background:${isSelected ? primaryColor + "12" : "#f5f6f8"};border:${isSelected ? `1.5px solid ${primaryColor}` : "1.5px solid transparent"};">
              <span style="position:absolute;top:0.5rem;right:0.5rem;background:#fee2e2;color:#dc2626;font-size:0.5625rem;font-weight:800;padding:1px 5px;border-radius:3px;">%</span>
              <div style="font-weight:800;font-size:1.0625rem;color:#111827;">${p.size}</div>
              <div style="font-size:0.75rem;color:#6b7280;margin:1px 0 6px;">${p.validity}</div>
              <div style="font-size:0.9375rem;font-weight:700;color:#111827;">₦${p.price.toLocaleString()}</div>
              <div style="font-size:0.75rem;color:#9ca3af;text-decoration:line-through;">₦${originalPrice.toLocaleString()}.00</div>
              <div style="font-size:0.75rem;color:#16a34a;font-weight:600;margin-top:2px;">₦${formatMoney(cashbackAmt)} Cashback</div>
              ${p.description ? `<div style="margin-top:6px;background:#fef3c7;color:#92400e;font-size:0.625rem;font-weight:600;padding:2px 6px;border-radius:4px;display:inline-block;">${p.description}</div>` : ""}
            </button>`;
            })
            .join("")}
        </div>
        ${availablePlans.length === 0 ? `<p style="text-align:center;color:#9ca3af;font-size:0.875rem;padding:2rem 0;">No plans in this category yet.</p>` : ""}
      </div>

      ${
        selectedPlan
          ? `<div style="margin:1.25rem 1rem 0;">
          <button id="buy-btn" style="width:100%;color:white;padding:0.875rem;border-radius:9999px;font-weight:700;border:none;background:${primaryColor};font-size:0.9375rem;">Buy ${chosenPlan.size} for ₦${chosenPlan.price.toLocaleString()}</button>
        </div>`
          : ""
      }

      <div style="margin:1.5rem 1rem 0;">
        <h3 style="font-size:0.9375rem;font-weight:700;margin:0 0 0.5rem;color:#111827;">Mobile Data Service</h3>
        <div style="background:white;border-radius:0.875rem;padding:0.875rem 1rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <span style="font-size:0.875rem;color:#4b5563;">USSD enquiry, auto-renewal, and more coming soon.</span>
        </div>
      </div>
    </div>`;

    bindPageHeader(container, "/dashboard");

    const phoneInput = container.querySelector("#phone-input");
    if (phoneInput) {
      phoneInput.addEventListener("change", () => {
        phoneNumber = phoneInput.value || phoneNumber;
      });
    }

    const networkToggle = container.querySelector("#network-toggle");
    if (networkToggle) {
      networkToggle.addEventListener("click", () => {
        showNetworkPicker = !showNetworkPicker;
        render();
      });
    }
    container.querySelectorAll("[data-select-network]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedNetwork = btn.dataset.selectNetwork;
        showNetworkPicker = false;
        selectedPlan = "";
        render();
      });
    });
    container.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab;
        selectedPlan = "";
        render();
      });
    });
    container.querySelectorAll("[data-plan]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedPlan = selectedPlan === btn.dataset.plan ? "" : btn.dataset.plan;
        render();
      });
    });
    const cashbackCheckbox = container.querySelector("#use-cashback");
    if (cashbackCheckbox) {
      cashbackCheckbox.addEventListener("change", () => {
        useCashbackForPayment = cashbackCheckbox.checked;
      });
    }
    const historyBtn = container.querySelector("#history-btn");
    if (historyBtn) historyBtn.addEventListener("click", () => navigate("/transaction-history"));
    const buyBtn = container.querySelector("#buy-btn");
    if (buyBtn) buyBtn.addEventListener("click", () => handleBuy(chosenPlan));
  }

  function handleBuy(plan) {
    if (!plan) return;
    const { totalCashback } = Stores.cashback.get();
    const cashbackToUse = useCashbackForPayment ? Math.min(totalCashback, plan.price) : 0;
    const remainingAmount = plan.price - cashbackToUse;
    const { balance } = Stores.balance.get();
    if (balance < remainingAmount) {
      toast.error("Insufficient balance");
      return;
    }
    
    // Show confirmation modal first
    showConfirmationModal({
      title: "Confirm Data Purchase",
      amount: plan.price.toLocaleString(),
      details: [
        { label: "Network", value: selectedNetwork.toUpperCase() },
        { label: "Phone Number", value: phoneNumber },
        { label: "Data Plan", value: plan.size },
        { label: "Price", value: `₦${plan.price.toLocaleString()}` },
        ...(cashbackToUse > 0 ? [{ label: "Cashback to Use", value: `₦${formatMoney(cashbackToUse.toFixed(2))}` }] : []),
        { label: "From Balance", value: `₦${formatMoney(remainingAmount.toFixed(2))}` },
      ],
      onConfirm: () => {
        showPinModal({
          amount: plan.price.toLocaleString(),
          recipientLabel: phoneNumber,
          onConfirm: () => {
        const cashbackEarned = plan.price * 0.005;
        const transId = Date.now().toString().slice(-12);
        if (cashbackToUse > 0) Stores.cashback.useCashback(cashbackToUse);
        Stores.balance.set({ balance: Stores.balance.get().balance - remainingAmount });
        Stores.cashback.addCashback(cashbackEarned);

        Stores.transaction.addTransaction({
          type: `${selectedNetwork.toUpperCase()} Data`,
          amount: `-₦${plan.price.toLocaleString()}`,
          status: "Successful",
          icon: "smartphone",
        });
        
        showTransactionReceipt({
          title: selectedNetwork.toUpperCase(),
          amount: `-₦${formatMoney(plan.price)}`,
          success: true,
          date: new Date().toLocaleString(),
          details: [
            { label: "Recipient Mobile", value: phoneNumber },
            { label: "Transaction Type", value: "Data" },
            { label: "Data Plan", value: plan.size },
            { label: "Transaction No.", value: transId },
            { label: "Payment Method", value: "OWealth" },
            { label: "Cashback Earned", value: `+₦${formatMoney(cashbackEarned.toFixed(2))}` },
          ],
          variant: "badge",
          footerText: "Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.",
          onClose: () => navigate("/dashboard")
        });
        
        Stores.transaction.addTransaction({ type: "Data Cashback", amount: `+₦${formatMoney(cashbackEarned.toFixed(2))}`, status: "Successful", icon: "wifi" });
        if (cashbackToUse > 0) {
          Stores.transaction.addTransaction({ type: "Cashback Used", amount: `-₦${formatMoney(cashbackToUse.toFixed(2))}`, status: "Successful", icon: "gift" });
        }
        },
        });
      },
    });
  }

  render();
}

window.renderDataPage = renderDataPage;
