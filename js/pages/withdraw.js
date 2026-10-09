// Format balance to display decimals properly
function formatBalanceWithdraw(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Math.floor(balance).toLocaleString();
}

function renderWithdrawPage(container) {
  const { primaryColor, buttonBackgroundColor } = Stores.customization.get();
  const withdrawalOptions = [
    { id: "1", type: "bank", name: "To Bank Account", description: "Withdraw to your linked bank account", icon: "building-2" },
    { id: "2", type: "agent", name: "OPay Agent", description: "Visit nearest agent to withdraw cash", icon: "user" },
    { id: "3", type: "atm", name: "Cardless ATM", description: "Withdraw from ATM without card", icon: "credit-card" },
  ];

  let amount = "";
  let selectedMethod = null;
  let showBalance = false;

  function render() {
    const { balance } = Stores.balance.get();
    const canSubmit = selectedMethod && amount;

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      ${PageHeader("Withdraw")}
      <div style="padding:1rem;">
        <div class="card" style="padding:1rem;margin-bottom:1rem;">
          <h3 style="font-weight:500;margin:0 0 0.75rem;">Withdrawal</h3>

          <div style="margin-bottom:1rem;padding:0.75rem;background:#f9fafb;border-radius:0.5rem;">
            <div class="flex items-center" style="gap:0.5rem;color:#6b7280;font-size:0.875rem;">
              Available Balance
              <button id="toggle-balance" style="background:none;border:none;color:#6b7280;display:flex;">${Icon(showBalance ? "eye-off" : "eye", { size: 16 })}</button>
            </div>
            <h2 style="font-size:1.25rem;font-weight:700;margin:4px 0 0;">${showBalance ? "₦" + formatBalanceWithdraw(balance) : "****"}</h2>
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.25rem;">Amount</label>
            <div style="display:flex;align-items:center;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem;">
              <span style="color:#9ca3af;">₦</span>
              <input id="amount-input" type="text" inputmode="numeric" pattern="[0-9]*" style="flex:1;border:none;outline:none;padding:0 0.5rem;" placeholder="0.00" value="${amount}" />
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block;font-size:0.875rem;font-weight:500;color:#374151;margin-bottom:0.5rem;">Select Withdrawal Method</label>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${withdrawalOptions
                .map((opt) => {
                  const isSelected = selectedMethod === opt.type;
                  return `
                <button data-method="${opt.type}" style="width:100%;display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border-radius:0.5rem;text-align:left;border:${
                    isSelected ? `2px solid ${primaryColor}` : "1px solid transparent"
                  };background:${isSelected ? primaryColor + "10" : buttonBackgroundColor};">
                  <div style="width:2.5rem;height:2.5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}20;">
                    <span style="color:${primaryColor};">${Icon(opt.icon, { size: 20 })}</span>
                  </div>
                  <div style="text-align:left;">
                    <p style="font-weight:500;margin:0;">${opt.name}</p>
                    <p style="font-size:0.75rem;color:#6b7280;margin:0;">${opt.description}</p>
                  </div>
                </button>`;
                })
                .join("")}
            </div>
          </div>

          <button id="withdraw-btn" style="width:100%;color:white;padding:0.75rem;border-radius:9999px;margin-top:0.5rem;font-weight:500;display:flex;align-items:center;justify-content:center;gap:0.5rem;border:none;background:${
            canSubmit ? primaryColor : "#cccccc"
          };" ${canSubmit ? "" : "disabled"}>${Icon("wallet", { size: 16 })} Withdraw</button>
        </div>

        <div class="card" style="padding:1rem;">
          <h3 style="font-weight:500;margin:0 0 0.75rem;">Withdrawal Information</h3>
          <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem;font-size:0.875rem;">
            ${["Bank withdrawal processing time: 5-30 minutes", "Agent withdrawals are processed instantly", "Cardless ATM withdrawal code expires in 30 minutes"]
              .map(
                (t) => `
              <li style="display:flex;align-items:flex-start;gap:0.5rem;">
                <span style="height:1.25rem;width:1.25rem;border-radius:9999px;background:#dcfce7;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">
                  <span style="height:0.5rem;width:0.5rem;border-radius:9999px;background:#22c55e;"></span>
                </span>
                <p style="margin:0;">${t}</p>
              </li>`
              )
              .join("")}
          </ul>
        </div>
      </div>
    </div>`;

    bindPageHeader(container, "/dashboard");
    container.querySelector("#toggle-balance").addEventListener("click", () => {
      showBalance = !showBalance;
      render();
    });
    const amtInput = container.querySelector("#amount-input");
    amtInput.addEventListener("input", () => {
      amount = amtInput.value;
    });
    attachAmountKeypad(amtInput);
    container.querySelectorAll("[data-method]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedMethod = btn.dataset.method;
        render();
      });
    });
    const btn = container.querySelector("#withdraw-btn");
    if (canSubmit) btn.addEventListener("click", handleWithdraw);
  }

  function handleWithdraw() {
    if (!selectedMethod || !amount) {
      alert("Please select a withdrawal method and enter amount");
      return;
    }
    const amountValue = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const { balance } = Stores.balance.get();
    if (amountValue > balance) {
      alert("Insufficient funds");
      return;
    }
    const selectedOption = withdrawalOptions.find((o) => o.type === selectedMethod);
    showPinModal({
      amount,
      recipientLabel: `via ${selectedOption.name}`,
      onConfirm: () => {
        const closeProgress = showTransferProgress();
        setTimeout(() => {
          closeProgress();
          const newBalance = Stores.balance.get().balance - amountValue;
          Stores.balance.set({ balance: newBalance });

          const transId = "25" + Math.floor(Math.random() * 1e18).toString().padStart(20, "0");
          const now = new Date();
          const formattedDate = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;

          Stores.transaction.addTransaction({
            type: `Withdrawal to ${selectedOption.name}`,
            amount: `-₦${formatMoney(amount)}`,
            status: "Successful",
            icon: "arrow-up-right",
          });

          showTransactionReceipt({
            amount: `₦${formatMoney(amount)}`,
            success: true,
            date: formattedDate,
            details: [
              { label: "Withdrawal Method", value: selectedOption.name },
              { label: "Transaction Type", value: "Withdrawal" },
              { label: "Transaction No.", value: transId },
            ],
            title: "Withdrawal Successful",
            footerText: "Thank you for using OPay. Your withdrawal has been processed successfully.",
            onClose: () => navigate("/dashboard"),
          });
        }, 2000);
      },
    });
  }

  render();
}

window.renderWithdrawPage = renderWithdrawPage;
