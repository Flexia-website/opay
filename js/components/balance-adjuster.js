// Format balance to display decimals properly
function formatBalanceAmount(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Math.floor(balance).toLocaleString();
}

function BalanceAdjusterHtml() {
  const { balance } = Stores.balance.get();
  const { primaryColor } = Stores.customization.get();
  return `
  <div class="card" style="padding:1rem;">
    <div class="flex justify-between items-center" style="margin-bottom:1rem;">
      <h3 style="font-weight:500;margin:0;">Adjust Balance</h3>
      <button id="ba-close" style="background:none;border:none;color:#6b7280;">${Icon("x", { size: 20 })}</button>
    </div>
    <div style="margin-bottom:1rem;">
      <label style="display:block;font-size:0.875rem;color:#6b7280;margin-bottom:0.25rem;">Current Balance</label>
      <div style="font-size:1.125rem;font-weight:600;">₦${formatBalanceAmount(balance)}</div>
    </div>
    <div style="margin-bottom:1rem;">
      <label style="display:block;font-size:0.875rem;color:#6b7280;margin-bottom:0.25rem;">Operation</label>
      <div class="flex" style="gap:0.5rem;">
        <button id="ba-op-add" style="flex:1;padding:0.5rem;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;border:none;background:${primaryColor};color:white;">
          ${Icon("plus-circle", { size: 18 })} Add Money
        </button>
        <button id="ba-op-sub" style="flex:1;padding:0.5rem;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;border:none;background:#f3f4f6;color:#374151;">
          ${Icon("minus-circle", { size: 18 })} Withdraw
        </button>
      </div>
    </div>
    <div style="margin-bottom:1rem;">
      <label style="display:block;font-size:0.875rem;color:#6b7280;margin-bottom:0.25rem;">Amount</label>
      <div style="display:flex;align-items:center;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem;">
        <span style="color:#9ca3af;">₦</span>
        <input id="ba-amount" type="text" placeholder="0.00" style="flex:1;border:none;outline:none;padding:0 0.5rem;" />
      </div>
    </div>
    <div id="ba-sender-wrap" style="margin-bottom:1rem;">
      <label style="display:block;font-size:0.875rem;color:#6b7280;margin-bottom:0.25rem;">Sender Name (Optional)</label>
      <div style="display:flex;align-items:center;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem;">
        ${Icon("user", { size: 16, class: "" })}
        <input id="ba-sender" type="text" placeholder="Who is sending you money?" style="flex:1;border:none;outline:none;padding:0 0.5rem;margin-left:0.25rem;" />
      </div>
    </div>
    <button id="ba-submit" disabled style="width:100%;padding:0.75rem;border-radius:9999px;color:white;font-weight:500;border:none;background:#cccccc;">Add to Balance</button>
  </div>`;
}

function bindBalanceAdjuster(container, onClose) {
  let operation = "add";
  const amountInput = container.querySelector("#ba-amount");
  const senderInput = container.querySelector("#ba-sender");
  const senderWrap = container.querySelector("#ba-sender-wrap");
  const submitBtn = container.querySelector("#ba-submit");
  const opAdd = container.querySelector("#ba-op-add");
  const opSub = container.querySelector("#ba-op-sub");
  const primaryColor = Stores.customization.get().primaryColor;

  container.querySelector("#ba-close").addEventListener("click", onClose);

  function updateOpButtons() {
    if (operation === "add") {
      opAdd.style.background = primaryColor;
      opAdd.style.color = "white";
      opSub.style.background = "#f3f4f6";
      opSub.style.color = "#374151";
      senderWrap.style.display = "block";
      submitBtn.textContent = "Add to Balance";
    } else {
      opSub.style.background = primaryColor;
      opSub.style.color = "white";
      opAdd.style.background = "#f3f4f6";
      opAdd.style.color = "#374151";
      senderWrap.style.display = "none";
      submitBtn.textContent = "Withdraw from Balance";
    }
  }

  opAdd.addEventListener("click", () => {
    operation = "add";
    updateOpButtons();
  });
  opSub.addEventListener("click", () => {
    operation = "subtract";
    updateOpButtons();
  });

  amountInput.addEventListener("input", () => {
    let value = amountInput.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) value = amountInput.value; // reject extra dots (keep prior)
    amountInput.value = value;
    const amt = parseFloat(value);
    const valid = !isNaN(amt) && amt > 0;
    submitBtn.disabled = !valid;
    submitBtn.style.background = valid ? primaryColor : "#cccccc";
  });

  submitBtn.addEventListener("click", () => {
    const amountValue = parseFloat(amountInput.value);
    const { balance } = Stores.balance.get();
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (operation === "subtract" && amountValue > balance) {
      toast.error("Insufficient funds");
      return;
    }
    const newBalance = operation === "add" ? balance + amountValue : balance - amountValue;
    Stores.balance.set({ balance: newBalance });

    if (operation === "add") {
      const sender = senderInput.value.trim() ? senderInput.value.trim() : "Self Deposit";
      Stores.transaction.addCreditAlert(sender, amountValue);
      toast.success(`₦${formatBalanceAmount(amountValue)} added to your balance from ${sender}`);
    } else {
      Stores.transaction.addTransaction({
        type: "Balance Withdrawal",
        amount: `-₦${formatBalanceAmount(amountValue)}`,
        status: "Successful",
        icon: "minus-circle",
      });
      toast.success(`₦${formatBalanceAmount(amountValue)} withdrawn from your balance`);
    }
    onClose();
  });

  updateOpButtons();
}

window.BalanceAdjusterHtml = BalanceAdjusterHtml;
window.bindBalanceAdjuster = bindBalanceAdjuster;
