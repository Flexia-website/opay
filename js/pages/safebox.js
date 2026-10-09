function renderSafeboxPage(container) {
  function render() {
    const { safeboxBalance } = Stores.safebox.get();
    const safeboxBalanceStr = safeboxBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const sbBalanceFontSize = safeboxBalanceStr.length > 13 ? "1.5rem" : safeboxBalanceStr.length > 10 ? "1.875rem" : safeboxBalanceStr.length > 7 ? "2.125rem" : "2.5rem";
    container.innerHTML = `
    <div style="min-height:100vh;background:#daf1e2;">
      <div style="padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
        <button id="sb-back" style="display:flex;align-items:center;gap:2px;background:none;border:none;">
          ${Icon("chevron-left", { size: 22 })}
          <span style="font-size:1.125rem;font-weight:800;">SafeBox</span>
        </button>
        <button id="sb-more" style="font-size:1rem;font-weight:700;color:#111827;background:none;border:none;">More</button>
      </div>

      <div style="margin:0 1rem;position:relative;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:58%;background:#bfe6cc;border-radius:1.25rem 0.5rem 0.5rem 1.25rem;"></div>
        <div style="position:relative;border-radius:1.25rem;padding:1.125rem 1.125rem 1rem;">
          <div class="flex items-center" style="gap:0.5rem;margin-bottom:0.625rem;">
            <span style="font-size:1rem;font-weight:600;color:#111827;">SafeBox</span>
            <span style="background:#111827;color:white;font-size:0.6875rem;font-weight:700;padding:2px 9px;border-radius:9999px;">15% p.a.</span>
          </div>
          <div style="font-size:${sbBalanceFontSize};font-weight:800;color:#111827;line-height:1.1;white-space:nowrap;">₦${safeboxBalanceStr}</div>
          <p style="font-size:0.875rem;color:#4b5563;margin:0.5rem 0 1rem;max-width:65%;">Save daily, weekly or monthly with discipline</p>

          <button id="sb-withdrawal-date" style="background:rgba(255,255,255,0.75);border-radius:9999px;padding:0.5rem 0.875rem;display:inline-flex;align-items:center;gap:0.5rem;font-size:0.8125rem;font-weight:600;border:none;color:#111827;">
            Next Free Withdrawal
            <span style="background:rgba(0,0,0,0.08);font-size:0.6875rem;font-weight:600;padding:2px 8px;border-radius:9999px;">Quarterly</span>
            <span style="color:#059669;font-weight:700;">30 Sep 2026</span>
            ${Icon("chevron-right", { size: 15, class: "" })}
          </button>

          <img src="assets/safebox-vault.png" alt="SafeBox vault" width="112" height="112" style="position:absolute;right:0.25rem;top:1rem;width:6.5rem;height:6.5rem;object-fit:contain;" />
        </div>
      </div>

      <div style="margin:0.875rem 1rem 0;background:white;border-radius:1.125rem;padding:1rem 1.125rem;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
        <div class="flex items-center" style="gap:0.5rem;">
          <span style="font-weight:600;color:#111827;font-size:0.9375rem;">Regular Save</span>
          <span style="background:#f3f4f6;color:#6b7280;font-size:0.6875rem;font-weight:600;padding:2px 9px;border-radius:9999px;">Off</span>
        </div>
        <button id="sb-autosave" style="background:#0aab63;color:white;padding:0.5rem 1.25rem;border-radius:9999px;font-size:0.875rem;font-weight:700;border:none;">Turn on</button>
      </div>

      <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:0.75rem;margin:0.875rem 1rem 0;">
        ${[
          { icon: "download", label: "Withdraw", to: "/safebox/withdraw" },
          { icon: "coins", label: "Interests", to: "/safebox/interests" },
          { icon: "settings", label: "Settings", to: "/safebox/settings" },
        ]
          .map(
            (a) => `
          <button data-sb-nav="${a.to}" style="background:white;border-radius:1.125rem;padding:1.125rem 0;display:flex;flex-direction:column;align-items:center;gap:0.5rem;border:none;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
            <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#059669;">${Icon(a.icon, { size: 20 })}</div>
            <span style="font-size:0.875rem;font-weight:600;color:#111827;">${a.label}</span>
          </button>`
          )
          .join("")}
      </div>

      <div style="margin:1.375rem 1rem 0;">
        <div class="flex items-center justify-between" style="margin-bottom:0.625rem;">
          <h3 style="font-size:1.125rem;font-weight:800;color:#111827;margin:0;">Recent activities</h3>
          ${Icon("chevron-down", { size: 20, class: "" })}
        </div>
        <div style="background:white;border-radius:1.125rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          ${[
            { label: "Interest", date: "01 Aug 2026 03:52:54", amount: "+₦2.79" },
            { label: "Interest", date: "01 Jul 2026 03:25:01", amount: "+₦2.70" },
            { label: "Interest", date: "01 Jun 2026 03:38:37", amount: "+₦2.70" },
            { label: "Interest", date: "01 May 2026 03:34:00", amount: "+₦2.70" },
            { label: "Withdraw to OWealth", date: "09 Apr 2026 08:57:07", amount: "-₦49.52" },
          ]
            .map(
              (a, i, arr) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.125rem;${i < arr.length - 1 ? "border-bottom:1px solid #f3f4f6;" : ""}">
              <div>
                <div style="font-weight:600;color:#111827;font-size:0.9375rem;">${a.label}</div>
                <div style="font-size:0.75rem;color:#9ca3af;margin-top:2px;">${a.date}</div>
              </div>
              <div style="font-weight:700;color:${a.amount.startsWith("+") ? "#059669" : "#111827"};">${a.amount}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="pb-nav-safe"></div>
      <div style="position:fixed;bottom:1.25rem;left:0;right:0;padding:0 1.25rem;z-index:40;max-width:480px;margin:0 auto;">
        <button id="sb-deposit-now" style="width:100%;background:#0aab63;color:white;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;border:none;box-shadow:0 8px 20px -6px rgb(10 171 99 / 0.55);">Deposit Now</button>
      </div>
    </div>`;

    container.querySelector("#sb-back").addEventListener("click", () => navigate("/finance"));
    container.querySelector("#sb-more").addEventListener("click", () => navigate("/more"));
    container.querySelector("#sb-withdrawal-date").addEventListener("click", showWithdrawalScheduleModal);
    container.querySelector("#sb-autosave").addEventListener("click", () => navigate("/safebox/autosave"));
    container.querySelectorAll("[data-sb-nav]").forEach((btn) => btn.addEventListener("click", () => navigate(btn.dataset.sbNav)));
    container.querySelector("#sb-deposit-now").addEventListener("click", () => navigate("/safebox/deposit"));
  }

  render();
}

function showWithdrawalScheduleModal() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.display = "flex";
  overlay.style.alignItems = "flex-end";
  overlay.style.justifyContent = "center";
  overlay.innerHTML = `
    <div style="background:white;width:100%;max-width:28rem;border-radius:1.25rem 1.25rem 0 0;padding:1.25rem;">
      <div class="flex items-center justify-between" style="margin-bottom:1rem;">
        <h3 style="font-size:1.125rem;font-weight:700;margin:0;">Important Reminder</h3>
        <button data-close style="background:none;border:none;color:#9ca3af;">${Icon("x", { size: 20 })}</button>
      </div>
      <p style="color:#4b5563;font-size:0.9375rem;text-align:center;margin:0 0 1.25rem;">Today is not a free withdrawal day. Your next free withdrawal day is <strong>30 Sep 2026</strong></p>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
        <div style="background:#eafaf0;border-radius:0.875rem;padding:0.875rem;">
          <div class="flex items-center justify-between" style="margin-bottom:0.5rem;"><span style="font-weight:700;font-size:0.875rem;">Wait Until The Next Fee-Free Day</span><span style="color:#059669;">${Icon("check-circle", { size: 16 })}</span></div>
          <div style="font-size:0.8125rem;color:#059669;margin-bottom:4px;display:flex;align-items:center;gap:4px;">${Icon("check", { size: 12 })} Fee-Free</div>
          <div style="font-size:0.8125rem;color:#059669;display:flex;align-items:center;gap:4px;">${Icon("check", { size: 12 })} Keep enjoying interest up to <strong>15%</strong> annually</div>
        </div>
        <div style="border:1px solid #f3f4f6;border-radius:0.875rem;padding:0.875rem;">
          <div style="font-weight:700;font-size:0.875rem;margin-bottom:0.5rem;">Withdraw Today</div>
          <div style="font-size:0.8125rem;color:#dc2626;margin-bottom:4px;display:flex;align-items:center;gap:4px;">2.5% Breaking Fee ${Icon("alert-circle", { size: 12 })}</div>
          <div style="font-size:0.8125rem;color:#dc2626;display:flex;align-items:center;gap:4px;">Stop Earning Interest ${Icon("alert-circle", { size: 12 })}</div>
        </div>
      </div>
      <button data-keep style="width:100%;background:#0aab63;color:white;padding:0.875rem;border-radius:9999px;font-weight:700;border:none;margin-bottom:0.75rem;">Keep in Safebox</button>
      <button data-withdraw-fee style="width:100%;background:none;border:none;color:#059669;font-weight:700;padding:0.5rem;">Withdraw with Fee</button>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector("[data-close]").addEventListener("click", close);
  overlay.querySelector("[data-keep]").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  overlay.querySelector("[data-withdraw-fee]").addEventListener("click", () => {
    close();
    navigate("/safebox/withdraw");
  });
}

function renderSafeboxDepositPage(container) {
  let amount = "";
  let disableInterest = false;
  let keypadOpen = false;

  function render() {
    const depositAmount = parseFloat(amount) || 0;
    const dailyInterest = disableInterest ? 0 : (depositAmount * 0.15) / 365;
    const monthlyInterest = disableInterest ? 0 : (depositAmount * 0.15) / 12;
    const yearlyInterest = disableInterest ? 0 : depositAmount * 0.15;

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <div style="background:white;padding:1rem;display:flex;align-items:center;gap:0.5rem;">
        <button id="sbd-back" style="background:none;border:none;border-radius:9999px;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;">${Icon("arrow-left", { size: 20 })}</button>
        <h1 style="font-size:1.125rem;font-weight:600;margin:0;">Deposit</h1>
      </div>
      <div style="padding:1rem;">
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;color:#374151;font-weight:500;margin-bottom:0.5rem;">Amount(₦)</label>
          <input id="sbd-amount" type="text" inputmode="numeric" pattern="[0-9]*" readonly class="input" style="font-size:1.125rem;padding:1rem;" placeholder="Input Amount" value="${amount}" />
        </div>

        <div style="margin-bottom:1.5rem;">
          <div class="flex items-center" style="gap:0.5rem;margin-bottom:1rem;">
            <span style="color:#374151;">Your estimated interest will be</span>
            ${Icon("help-circle", { size: 16, class: "" })}
          </div>
          <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:1rem;">
            <div class="card" style="padding:1rem;text-align:center;">
              <p style="color:#4b5563;font-size:0.875rem;margin:0 0 0.5rem;">Daily</p>
              <p style="color:#9333ea;font-weight:700;font-size:1.125rem;margin:0;">₦${formatMoney(dailyInterest.toFixed(2))}</p>
            </div>
            <div class="card" style="padding:1rem;text-align:center;">
              <p style="color:#4b5563;font-size:0.875rem;margin:0 0 0.5rem;">Monthly</p>
              <p style="color:#9333ea;font-weight:700;font-size:1.125rem;margin:0;">₦${formatMoney(monthlyInterest.toFixed(2))}</p>
            </div>
            <div class="card" style="padding:1rem;text-align:center;">
              <p style="color:#4b5563;font-size:0.875rem;margin:0 0 0.5rem;">Yearly</p>
              <p style="color:#9333ea;font-weight:700;font-size:1.125rem;margin:0;">₦${formatMoney(yearlyInterest.toFixed(2))}</p>
            </div>
          </div>
        </div>

        <p style="color:#4b5563;font-size:0.875rem;margin:0 0 1rem;">10% Withholding tax apply</p>

        <div class="flex items-center justify-between" style="margin-bottom:1.5rem;">
          <span style="color:#374151;">Your next free withdrawal day is</span>
          <div class="flex items-center" style="gap:0.5rem;">
            <span style="color:#9333ea;font-weight:500;">30 Sep 2026</span>
            ${Icon("help-circle", { size: 16, class: "" })}
          </div>
        </div>

        <div class="flex items-center justify-between" style="margin-bottom:2rem;">
          <span style="color:#111827;font-weight:500;">Disable interest on your savings</span>
          ${UI.switch({ id: "sbd-switch", checked: disableInterest })}
        </div>

        <div class="flex items-center justify-center" style="gap:0.5rem;margin-bottom:2rem;">
          ${Icon("shield", { size: 16, class: "" })}
          <span style="font-size:0.875rem;color:#9333ea;">Powered by BlueRidge Microfinance Bank</span>
        </div>

        <button id="sbd-submit" style="width:100%;background:#d1d5db;color:#374151;padding:1rem;border-radius:0.5rem;font-size:1.125rem;font-weight:500;border:none;">Next</button>
      </div>
    </div>`;

    container.querySelector("#sbd-back").addEventListener("click", () => navigate("/safebox"));
    const amountInput = container.querySelector("#sbd-amount");
    amountInput.addEventListener("focus", () => {
      if (keypadOpen) return;
      if (amountInput._keypadCooldown) return;
      keypadOpen = true;
      openNumericKeypad({
        decimal: true,
        value: amount,
        onInput: (v) => {
          amount = v;
          amountInput.value = amount;
        },
        onClose: () => {
          keypadOpen = false;
          amountInput._keypadCooldown = true;
          amountInput.blur();
          setTimeout(() => {
            amountInput._keypadCooldown = false;
          }, 400);
        },
      });
    });
    UI.bindSwitch("sbd-switch", (val) => {
      disableInterest = val;
      render();
    });
    container.querySelector("#sbd-submit").addEventListener("click", handleDeposit);
  }

  function handleDeposit() {
    const depositAmount = parseFloat(amount) || 0;
    if (!amount || depositAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const { balance } = Stores.balance.get();
    if (depositAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    const { safeboxBalance } = Stores.safebox.get();
    Stores.safebox.set({ safeboxBalance: safeboxBalance + depositAmount });
    Stores.balance.set({ balance: balance - depositAmount });
    toast.success(`₦${depositAmount.toLocaleString()} deposited successfully`);
    navigate("/safebox");
  }

  render();
}

function renderSafeboxWithdrawPage(container) {
  let amount = "";
  let keypadOpen = false;

  function render() {
    const { safeboxBalance } = Stores.safebox.get();
    const withdrawAmount = parseFloat(amount) || 0;
    const breakingFee = withdrawAmount * 0.025;
    const netAmount = Math.max(0, withdrawAmount - breakingFee);

    container.innerHTML = `
    <div style="min-height:100vh;background:white;">
      <div style="padding:0.875rem 1rem;display:flex;align-items:center;gap:0.5rem;">
        <button id="sbw-back" style="background:none;border:none;">${Icon("chevron-left", { size: 22 })}</button>
        <h1 style="font-size:1.0625rem;font-weight:800;margin:0;">Withdraw</h1>
      </div>
      <div style="padding:0.75rem 1.25rem 1.25rem;">
        <div style="background:#e2f6e9;border-radius:1rem;padding:1.25rem;text-align:center;margin-bottom:1.5rem;">
          <div class="flex items-center justify-center" style="gap:6px;color:#374151;font-size:0.875rem;margin-bottom:0.5rem;">
            ${Icon("clock", { size: 16 })} Your next free withdrawal day is
          </div>
          <div style="font-size:1.25rem;font-weight:800;color:#059669;">Wednesday, 30 September 2026</div>
        </div>

        <div style="border-top:1px solid #f3f4f6;margin-bottom:1.5rem;"></div>

        <div style="margin-bottom:0.375rem;">
          <label style="display:block;color:#111827;font-size:0.9375rem;margin-bottom:0.5rem;">Amount(₦)</label>
          <input id="sbw-amount" type="text" inputmode="numeric" pattern="[0-9]*" readonly class="input" style="font-size:1.0625rem;padding:1rem;background:#f5f6f8;border:none;" placeholder="₦" value="${amount}" />
        </div>
        <p style="color:#9ca3af;font-size:0.875rem;margin:0.5rem 0 1.5rem;">Current SafeBox balance ₦${formatMoney(safeboxBalance.toFixed(2))}</p>

        <div class="flex items-center justify-between" style="margin-bottom:0.25rem;">
          <span style="color:#111827;font-size:0.9375rem;">Breaking fee(₦)</span>
          <span style="color:#9ca3af;">${Icon("help-circle", { size: 15 })}</span>
        </div>
        <p id="sbw-breaking-fee" style="font-size:1.0625rem;color:#111827;margin:0 0 1.25rem;">${breakingFee.toFixed(2)}</p>

        <div style="margin-bottom:0.25rem;">
          <span style="color:#111827;font-size:0.9375rem;">Withdraw to OWealth(₦)</span>
        </div>
        <p id="sbw-net-amount" style="font-size:1.0625rem;color:#111827;margin:0 0 1.5rem;">${netAmount.toFixed(2)}</p>
      </div>

      <div class="pb-nav-safe"></div>
      <div style="position:fixed;bottom:1.25rem;left:0;right:0;padding:0 1.25rem;max-width:480px;margin:0 auto;">
        <button id="sbw-submit" style="width:100%;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;color:white;border:none;background:#0aab63;">Withdraw</button>
      </div>
    </div>`;

    container.querySelector("#sbw-back").addEventListener("click", () => navigate("/safebox"));
    const amountInput = container.querySelector("#sbw-amount");
    amountInput.addEventListener("focus", () => {
      if (keypadOpen) return;
      if (amountInput._keypadCooldown) return;
      keypadOpen = true;
      openNumericKeypad({
        decimal: true,
        value: amount,
        onInput: (v) => {
          amount = v;
          amountInput.value = amount;
          const val = parseFloat(amount) || 0;
          const fee = val * 0.025;
          const net = Math.max(0, val - fee);
          const feeEl = container.querySelector("#sbw-breaking-fee");
          const netEl = container.querySelector("#sbw-net-amount");
          if (feeEl) feeEl.textContent = fee.toFixed(2);
          if (netEl) netEl.textContent = net.toFixed(2);
        },
        onClose: () => {
          keypadOpen = false;
          amountInput._keypadCooldown = true;
          amountInput.blur();
          setTimeout(() => {
            amountInput._keypadCooldown = false;
          }, 400);
        },
      });
    });
    container.querySelector("#sbw-submit").addEventListener("click", () => {
      if (!amount || withdrawAmount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      toast.error("Withdrawal date not reached");
    });
  }

  render();
}

window.renderSafeboxPage = renderSafeboxPage;
window.renderSafeboxDepositPage = renderSafeboxDepositPage;
window.renderSafeboxWithdrawPage = renderSafeboxWithdrawPage;
window.showWithdrawalScheduleModal = showWithdrawalScheduleModal;
