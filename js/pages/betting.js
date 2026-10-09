function renderBettingPage(container) {
  const { primaryColor } = Stores.customization.get();
  const platforms = [
    { id: "bet9ja", name: "Bet9ja" },
    { id: "sportybet", name: "SportyBet" },
    { id: "1xbet", name: "1xBet" },
    { id: "nairabet", name: "NairaBet" },
  ];
  const amounts = [
    { value: "500", display: "₦500" },
    { value: "1000", display: "₦1,000" },
    { value: "2000", display: "₦2,000" },
    { value: "5000", display: "₦5,000" },
    { value: "10000", display: "₦10,000" },
  ];

  let selectedPlatform = "";
  let accountId = "";
  let amount = "";

  function render() {
    const { transactions } = Stores.transaction.get();
    const filtered = transactions.filter((t) => t.type.includes("Deposit") || t.type.includes("Betting")).slice(0, 3);
    const canSubmit = selectedPlatform && accountId && amount;

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      ${PageHeader("Betting")}
      <div style="padding:1rem;">
        <div class="card" style="padding:1rem;">
          <div style="background:#fff7ed;padding:0.75rem;display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;border-radius:0.5rem;">
            ${Icon("info", { size: 20, class: "" })}
            <p style="font-size:0.875rem;color:#c2410c;margin:0;">Fund your betting account instantly. No hidden fees!</p>
          </div>

          <h3 style="font-weight:500;margin:0 0 0.75rem;">Select Platform</h3>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
            ${platforms
              .map((p) => {
                const isSelected = selectedPlatform === p.id;
                return `
              <button data-platform="${p.id}" style="padding:0.75rem;border-radius:0.75rem;display:flex;align-items:center;gap:0.5rem;border:${
                  isSelected ? `2px solid ${primaryColor}` : "1px solid hsl(var(--border))"
                };">
                <div style="width:32px;height:32px;border-radius:9999px;background:${primaryColor}20;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:${primaryColor};">${p.name.charAt(0)}</div>
                <span style="font-size:0.875rem;">${p.name}</span>
              </button>`;
              })
              .join("")}
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.25rem;">Betting Account ID</label>
            <input id="account-input" type="text" inputmode="numeric" pattern="[0-9]*" class="input" placeholder="Enter your account ID/number" value="${accountId}" />
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.25rem;">Amount</label>
            <div style="display:flex;align-items:center;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem;margin-bottom:0.75rem;">
              <span style="color:#9ca3af;">₦</span>
              <input id="amount-input" type="text" inputmode="numeric" pattern="[0-9]*" style="flex:1;border:none;outline:none;padding:0 0.5rem;" placeholder="Enter amount" value="${amount}" />
            </div>
            <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:0.5rem;">
              ${amounts
                .map(
                  (a) => `
                <button data-quick-amount="${a.value}" style="padding:0.5rem;border-radius:0.5rem;font-size:0.75rem;border:${
                    amount === a.value ? `1px solid ${primaryColor}` : "none"
                  };background:${amount === a.value ? primaryColor + "15" : "#f9fafb"};">${a.display}</button>`
                )
                .join("")}
            </div>
          </div>

          <button id="deposit-btn" style="width:100%;color:white;padding:0.75rem;border-radius:9999px;margin-top:1rem;font-weight:500;border:none;background:${
            canSubmit ? primaryColor : "#cccccc"
          };" ${canSubmit ? "" : "disabled"}>Deposit</button>
        </div>

        ${
          filtered.length > 0
            ? `<div class="card" style="padding:1rem;margin-top:1rem;">
            <h3 style="font-weight:500;margin:0 0 0.75rem;">Recent Betting Transactions</h3>
            ${filtered
              .map(
                (t, i) => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;${i < filtered.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
                <div class="flex items-center" style="gap:0.5rem;">
                  <div style="width:2rem;height:2rem;border-radius:9999px;background:${primaryColor}15;display:flex;align-items:center;justify-content:center;">
                    <span style="color:${primaryColor};">${Icon(t.icon || "activity", { size: 16 })}</span>
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
            <button id="view-all-tx" style="width:100%;text-align:center;padding:0.5rem 0;margin-top:0.5rem;font-size:0.875rem;background:none;border:none;color:${primaryColor};">View All Transactions</button>
          </div>`
            : ""
        }
      </div>
    </div>`;

    bindPageHeader(container, "/dashboard");
    container.querySelectorAll("[data-platform]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedPlatform = btn.dataset.platform;
        render();
      });
    });
    const accountInput = container.querySelector("#account-input");
    accountInput.addEventListener("input", () => {
      accountId = accountInput.value;
    });
    const amtInput = container.querySelector("#amount-input");
    amtInput.addEventListener("input", () => {
      amount = amtInput.value.replace(/[^\d]/g, "");
    });
    attachAmountKeypad(amtInput, { decimal: false });
    container.querySelectorAll("[data-quick-amount]").forEach((btn) => {
      btn.addEventListener("click", () => {
        amount = btn.dataset.quickAmount;
        render();
      });
    });
    const depositBtn = container.querySelector("#deposit-btn");
    if (canSubmit) depositBtn.addEventListener("click", handleDeposit);
    const viewAll = container.querySelector("#view-all-tx");
    if (viewAll) viewAll.addEventListener("click", () => navigate("/transaction-history"));
  }

  function handleDeposit() {
    if (!selectedPlatform || !accountId || !amount) {
      alert("Please fill in all required fields");
      return;
    }
    const amountValue = parseInt(amount.replace(/,/g, ""), 10);
    const { balance } = Stores.balance.get();
    if (amountValue > balance) {
      alert("Insufficient balance");
      return;
    }
    const platformName = platforms.find((p) => p.id === selectedPlatform).name;
    showPinModal({
      amount: amountValue.toLocaleString(),
      recipientLabel: platformName,
      onConfirm: () => {
        Stores.balance.set({ balance: Stores.balance.get().balance - amountValue });
        const transId = "25" + Math.floor(Math.random() * 1e18).toString().padStart(20, "0");
        const now = new Date();
        const formattedDate = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;

        Stores.transaction.addTransaction({
          type: `${platformName} Deposit`,
          amount: `-₦${amountValue.toLocaleString()}`,
          status: "Successful",
          icon: "activity",
        });

        showTransactionReceipt({
          amount: `₦${amountValue.toLocaleString()}`,
          success: true,
          date: formattedDate,
          details: [
            { label: "Betting Platform", value: platformName },
            { label: "Account ID", value: accountId },
            { label: "Transaction Type", value: "Betting Deposit" },
            { label: "Transaction No.", value: transId },
          ],
          title: "Betting Deposit Successful",
          footerText:
            "Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.",
          onClose: () => {
            selectedPlatform = "";
            accountId = "";
            amount = "";
            render();
          },
        });
      },
    });
  }

  render();
}

window.renderBettingPage = renderBettingPage;
