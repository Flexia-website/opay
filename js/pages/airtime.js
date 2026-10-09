function renderAirtimePage(container) {
  const amounts = [
    { amount: "50", cashback: "0.25" },
    { amount: "100", cashback: "0.50" },
    { amount: "200", cashback: "1.00" },
    { amount: "500", cashback: "2.50" },
    { amount: "1,000", cashback: "5.00" },
    { amount: "2,000", cashback: "10.00" },
  ];

  let selectedNetwork = "mtn";
  let showNetworkPicker = false;
  let phoneNumber = "0816 0881 049";
  let amount = "";
  let selectedAmount = "";
  let useCashbackForPayment = false;

  function networkLogo(net, size) {
    const { networkImages } = Stores.customization.get();
    const img = networkImages[net.id];
    if (img) {
      return `<img src="${img}" alt="${net.name}" style="width:${size}px;height:${size}px;border-radius:9999px;object-fit:cover;" />`;
    }
    return `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${net.color};color:${net.textColor};display:flex;align-items:center;justify-content:center;font-size:${size * 0.32}px;font-weight:800;">${net.name.charAt(0)}</div>`;
  }

  function render() {
    const { primaryColor } = Stores.customization.get();
    const { transactions } = Stores.transaction.get();
    const { totalCashback } = Stores.cashback.get();
    const net = window.NETWORKS.find((n) => n.id === selectedNetwork);
    const canSubmit = selectedNetwork && phoneNumber && amount;

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:2rem;">
      <header style="background:white;padding:1rem;display:flex;align-items:center;justify-content:space-between;">
        <div class="flex items-center" style="gap:0.75rem;">
          <button data-nav-back style="background:none;border:none;color:#111827;">${Icon("chevron-left", { size: 22 })}</button>
          <h1 style="font-size:1.125rem;font-weight:700;margin:0;">Airtime</h1>
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

      <div style="margin:0 1rem;background:linear-gradient(135deg,#0f2027,#1a2f38);border-radius:1rem;padding:1.125rem;display:flex;align-items:center;justify-content:space-between;overflow:hidden;">
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

      <div style="margin:1.25rem 1rem 0;">
        <h3 style="font-size:0.9375rem;font-weight:700;margin:0 0 0.625rem;color:#111827;">Select Amount</h3>
        <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:0.625rem;">
          ${amounts
            .map((item) => {
              const isSelected = selectedAmount === item.amount;
              return `
            <button data-amount="${item.amount}" style="padding:0.75rem 0.5rem;border-radius:0.875rem;border:${
                isSelected ? `1.5px solid ${primaryColor}` : "1.5px solid transparent"
              };background:${isSelected ? primaryColor + "12" : "#f5f6f8"};text-align:left;">
                <div style="font-size:1rem;font-weight:800;color:#111827;">₦${formatMoney(item.amount)}</div>
                <div style="font-size:0.75rem;color:#16a34a;font-weight:600;margin-top:2px;">₦${formatMoney(item.cashback)} Cashback</div>
              </button>`;
            })
            .join("")}
        </div>
      </div>

      <div style="margin:1.25rem 1rem 0;">
        <label style="display:block;font-size:0.875rem;font-weight:600;color:#374151;margin-bottom:0.5rem;">Or Enter Custom Amount</label>
        <div style="display:flex;align-items:center;background:white;border-radius:0.75rem;padding:0.75rem 1rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <span style="color:#9ca3af;font-weight:600;">₦</span>
          <input id="custom-amount" type="text" inputmode="numeric" pattern="[0-9]*" style="flex:1;border:none;outline:none;padding:0 0.5rem;font-size:0.9375rem;" placeholder="50 - 500,000" value="${selectedAmount ? "" : amount}" />
        </div>
      </div>

      <div style="margin:1.25rem 1rem 0;">
        <button id="buy-btn" style="width:100%;color:white;padding:0.875rem;border-radius:9999px;font-weight:700;border:none;background:${
          canSubmit ? primaryColor : "#d1d5db"
        };font-size:0.9375rem;" ${canSubmit ? "" : "disabled"}>Buy Airtime</button>
      </div>

      ${
        transactions.length > 0
          ? `<div style="margin:1.5rem 1rem 0;">
          <h3 style="font-size:0.9375rem;font-weight:700;margin:0 0 0.625rem;color:#111827;">Recent Transactions</h3>
          <div style="background:white;border-radius:0.875rem;padding:0.5rem 1rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          ${transactions
            .slice(0, 3)
            .map(
              (t, i) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.625rem 0;${i < 2 ? "border-bottom:1px solid #f3f4f6;" : ""}">
              <div class="flex items-center" style="gap:0.5rem;">
                <div style="width:2rem;height:2rem;border-radius:9999px;background:${primaryColor}20;display:flex;align-items:center;justify-content:center;">
                  <span style="color:${primaryColor};">${Icon("phone", { size: 16 })}</span>
                </div>
                <div>
                  <p style="font-weight:500;font-size:0.875rem;margin:0;">${t.type}</p>
                  <p style="font-size:0.75rem;color:#6b7280;margin:0;">${t.date}</p>
                </div>
              </div>
              <div style="text-align:right;">
                <p style="font-size:0.875rem;margin:0;color:${t.amount.startsWith("+") ? "#22c55e" : "black"};">${t.amount}</p>
                <p style="font-size:0.75rem;color:#22c55e;margin:0;">${t.status}</p>
              </div>
            </div>`
            )
            .join("")}
          </div>
        </div>`
          : ""
      }
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
        render();
      });
    });
    const cashbackCheckbox = container.querySelector("#use-cashback");
    if (cashbackCheckbox) {
      cashbackCheckbox.addEventListener("change", () => {
        useCashbackForPayment = cashbackCheckbox.checked;
      });
    }
    container.querySelectorAll("[data-amount]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedAmount = btn.dataset.amount;
        amount = btn.dataset.amount;
        render();
      });
    });
    const customAmount = container.querySelector("#custom-amount");
    customAmount.addEventListener("input", () => {
      amount = customAmount.value;
      selectedAmount = "";
    });
    attachAmountKeypad(customAmount, { decimal: false });
    const historyBtn = container.querySelector("#history-btn");
    if (historyBtn) historyBtn.addEventListener("click", () => navigate("/transaction-history"));
    const buyBtn = container.querySelector("#buy-btn");
    if (canSubmit) buyBtn.addEventListener("click", handleBuy);
  }

  function handleBuy() {
    if (!selectedNetwork || !phoneNumber || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    const amountValue = parseFloat(amount.replace(/,/g, ""));
    const { totalCashback } = Stores.cashback.get();
    const cashbackToUse = useCashbackForPayment ? Math.min(totalCashback, amountValue) : 0;
    const remainingAmount = amountValue - cashbackToUse;
    const { balance } = Stores.balance.get();
    if (balance < remainingAmount) {
      toast.error("Insufficient balance");
      return;
    }
    
    // Show confirmation modal first
    showConfirmationModal({
      title: "Confirm Airtime Purchase",
      amount: amount,
      details: [
        { label: "Network", value: window.NETWORKS.find((n) => n.id === selectedNetwork)?.name || "" },
        { label: "Phone Number", value: phoneNumber },
        { label: "Amount", value: `₦${formatMoney(amount)}` },
        ...(cashbackToUse > 0 ? [{ label: "Cashback to Use", value: `₦${formatMoney(cashbackToUse.toFixed(2))}` }] : []),
        { label: "From Balance", value: `₦${formatMoney(remainingAmount.toFixed(2))}` },
      ],
      onConfirm: () => {
        showPinModal({
          amount,
          recipientLabel: phoneNumber,
          onConfirm: () => {
            const cashbackEarned = amountValue * 0.005;
            if (cashbackToUse > 0) Stores.cashback.useCashback(cashbackToUse);
            Stores.balance.set({ balance: Stores.balance.get().balance - remainingAmount });
            Stores.cashback.addCashback(cashbackEarned);

            const transId = "25" + Math.floor(Math.random() * 1e18).toString().padStart(20, "0");
            const now = new Date();
            const formattedDate = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;

            Stores.transaction.addTransaction({ type: "Airtime Purchase", amount: `-₦${formatMoney(amount)}`, status: "Successful", icon: "phone" });
            Stores.transaction.addTransaction({ type: "Cashback from Airtime", amount: `+₦${formatMoney(cashbackEarned.toFixed(2))}`, status: "Successful", icon: "gift" });
            if (cashbackToUse > 0) {
              Stores.transaction.addTransaction({ type: "Cashback Used", amount: `-₦${formatMoney(cashbackToUse.toFixed(2))}`, status: "Successful", icon: "gift" });
            }

            toast.success(`Airtime purchase successful! Earned ₦${formatMoney(cashbackEarned.toFixed(2))} cashback.`);

            const networkName = window.NETWORKS.find((n) => n.id === selectedNetwork)?.name || "Airtime";
            showTransactionReceipt({
              amount: `₦${formatMoney(amount)}`,
              success: true,
              date: formattedDate,
              details: [
                { label: "Recipient Mobile", value: phoneNumber },
                { label: "Transaction Type", value: "Airtime" },
                { label: "Transaction No.", value: transId },
                { label: "Payment Method", value: "OWealth" },
                ...(cashbackToUse > 0 ? [{ label: "Cashback Used", value: `₦${formatMoney(cashbackToUse.toFixed(2))}` }] : []),
                { label: "Cashback Earned", value: `+₦${formatMoney(cashbackEarned.toFixed(2))}` },
              ],
              title: networkName,
              footerText:
                "Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.",
              onClose: () => {
                amount = "";
                selectedAmount = "";
                useCashbackForPayment = false;
                render();
              },
            });
          },
        });
      },
    });
  }

  render();
}

window.renderAirtimePage = renderAirtimePage;
