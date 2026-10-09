// Format balance to display decimals properly
function formatBalance(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return Math.floor(balance).toLocaleString();
}

function renderDashboard(container) {
  const { balance } = Stores.balance.get();
  const { primaryColor, buttonImages, profilePhoto, profilePhotoSize } = Stores.customization.get();
  const { transactions } = Stores.transaction.get();
  let showBalance = true;

  const quickActions = [
    { icon: "send", label: "To OPay", path: "/to-opay", key: "toopay" },
    { icon: "building-2", label: "To Bank", path: "/to-bank", key: "tobank" },
    { icon: "arrow-up-right", label: "Withdraw", path: "/withdraw", key: "withdraw" },
  ];

  const services = [
    { icon: "activity", label: "Airtime", path: "/airtime", key: "airtime" },
    { icon: "smartphone", label: "Data", path: "/data", key: "data" },
    { icon: "circle", label: "Betting", path: "/betting", key: "betting" },
    { icon: "play", label: "TV", path: "/tv", key: "tv" },
    { icon: "credit-card", label: "SafeBox", path: "/safebox", key: "safebox" },
    { icon: "hand-heart", label: "Loan", badge: "Hot", path: "/loan", key: "loan" },
    { icon: "megaphone", label: "Invitation", badge: "₦5600", path: "/invitation", key: "invitation" },
    { icon: "more-horizontal", label: "More", path: "/more", key: "more" },
  ];

  function iconOrImage(iconName, key, size = 22, color) {
    const img = buttonImages[key];
    if (img) {
      return `<img src="${img}" alt="${key}" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:9999px;" />`;
    }
    return `<span style="color:${color || primaryColor};display:flex;">${Icon(iconName, { size, strokeWidth: 2 })}</span>`;
  }

  function renderBalanceCard() {
    const balanceDisplay = showBalance ? "₦" + formatBalance(balance) : "****";
    const balanceFontSize = balanceDisplay.length > 14 ? "0.95rem" : balanceDisplay.length > 11 ? "1.1rem" : balanceDisplay.length > 9 ? "1.25rem" : "1.4rem";
    return `
    <div style="background:${primaryColor};margin:0;padding:0.7rem 0.5rem;border-radius:0.875rem;color:white;box-shadow:0 6px 20px -6px ${primaryColor}80;">
      <div class="flex justify-between items-center" style="margin-bottom:0.4rem;">
        <div class="flex items-center" style="gap:4px;">
          ${iconOrImage("shield-check", "balance-shield", 14, "white")}
          <span style="font-size:0.75rem;font-weight:700;">Available Balance</span>
          <button id="toggle-balance" style="display:flex;align-items:center;justify-content:center;border:none;background:none;color:rgba(255,255,255,0.85);padding:0;">
            ${Icon(showBalance ? "eye" : "eye-off", { size: 13 })}
          </button>
        </div>
        <span id="tx-history-link" style="font-size:0.7rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:1px;margin-right:0.2rem;">Transaction History ${Icon("chevron-right", { size: 12 })}</span>
      </div>
      <div class="flex justify-between items-center">
        <h2 id="balance-amount" style="font-size:${balanceFontSize};font-weight:800;margin:0;letter-spacing:0.01em;display:flex;align-items:center;gap:4px;white-space:nowrap;">${balanceDisplay} ${Icon("chevron-right", { size: 16 })}</h2>
        <button id="add-money-btn" style="background:white;color:${primaryColor};padding:0.4rem 0.9rem;border-radius:9999px;font-size:0.75rem;font-weight:700;border:none;display:flex;align-items:center;gap:3px;flex-shrink:0;">
          ${iconOrImage("plus", "add-money", 13)} Add Money
        </button>
      </div>
    </div>`;
  }

  function renderTransactionsCard() {
    if (!showBalance) return "";
    const recent = transactions.slice(0, 2);
    if (recent.length === 0) return "";
    return `
    <div style="background:white;margin:0;padding:0.6rem 0.8rem;border-radius:0.875rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
      <div class="flex justify-between items-center" style="margin-bottom:0.35rem;">
        <h3 style="font-size:0.8rem;font-weight:600;margin:0;">Recent</h3>
        <button id="tx-view-all" style="font-size:0.7rem;color:${primaryColor};background:none;border:none;font-weight:600;">View All</button>
      </div>
      ${recent
        .map(
          (t, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.35rem 0;${
          i < recent.length - 1 ? "border-bottom:0.5px solid #f3f4f6;" : ""
        }">
          <div class="flex items-center" style="gap:0.5rem;">
            <div style="width:1.75rem;height:1.75rem;border-radius:9999px;background:var(--opay-accent);display:flex;align-items:center;justify-content:center;color:${primaryColor};">
              ${Icon(t.icon || "user", { size: 14 })}
            </div>
            <div style="min-width:0;">
              <p style="font-weight:500;font-size:0.75rem;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.type}</p>
              <p style="font-size:0.65rem;color:#9ca3af;margin:0;">${t.date}</p>
            </div>
          </div>
          <div style="text-align:right;margin-left:0.5rem;">
            <p style="font-size:0.75rem;font-weight:600;margin:0;color:${t.amount.startsWith("+") ? "#16a34a" : "#111827"};">${t.amount}</p>
            <p style="font-size:0.65rem;color:#16a34a;margin:0;">${t.status}</p>
          </div>
        </div>`
        )
        .join("")}
    </div>`;
  }

  function fullHtml() {
    return `
    <div class="pb-nav-safe" style="height:100vh;background:#f5f6f8;width:100%;overflow:hidden;display:flex;flex-direction:column;">
      <header class="app-header flex items-center justify-between" style="padding:0.5rem 0.5rem;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;border-bottom:none;box-shadow:none;flex-shrink:0;">
        <div class="flex items-center" style="gap:0.5rem;">
          <button id="profile-btn" style="width:${2.25 * (profilePhotoSize || 1)}rem;height:${2.25 * (profilePhotoSize || 1)}rem;border-radius:9999px;background:transparent;display:flex;align-items:center;justify-content:center;border:none;flex-shrink:0;">
            ${
              profilePhoto
                ? `<img src="${profilePhoto}" alt="Profile" style="width:100%;height:100%;object-fit:contain;" />`
                : `<span style="color:#111827;">${Icon("user", { size: Math.round(18 * (profilePhotoSize || 1)) })}</span>`
            }
          </button>
          <h1 style="font-size:1rem;font-weight:700;margin:0;">Hi, CLINTON</h1>
        </div>
        <div class="flex items-center" style="gap:1rem;">
          <button id="help-btn" style="position:relative;background:none;border:none;color:#374151;">
            ${iconOrImage("headphones", "help", 20)}
            <span style="position:absolute;top:-6px;right:-10px;background:#ec4899;color:white;font-size:7px;font-weight:700;padding:1px 4px;border-radius:9999px;">HELP</span>
          </button>
          <button id="qr-btn" style="background:none;border:none;color:#374151;">${iconOrImage("qr-code", "qrcode", 20)}</button>
          <button id="notif-btn" style="position:relative;background:none;border:none;color:#374151;">
            ${iconOrImage("bell", "notifications", 20)}
            <span style="position:absolute;top:-6px;right:-8px;background:#ef4444;color:white;font-size:8px;font-weight:700;border-radius:9999px;min-width:14px;height:14px;padding:0 2px;display:flex;align-items:center;justify-content:center;font-size:7px;">99</span>
          </button>
        </div>
      </header>

      <div style="flex:1;overflow-y:auto;padding-bottom:3rem;">
        <div id="balance-card-wrap" style="margin:0.4rem 0.5rem 0;padding:0;">${renderBalanceCard()}</div>
        <div id="tx-card-wrap" style="margin:0.3rem 0.5rem 0;padding:0;">${renderTransactionsCard()}</div>

        <div style="background:white;margin:0.3rem 0.5rem 0;padding:0.75rem 0.5rem;border-radius:0.875rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:0.3rem;">
            ${quickActions
              .map(
                (a) => `
              <button data-nav="${a.path}" style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;padding:0.25rem;background:none;border:none;">
                <div style="width:2.5rem;height:2.5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}17;">
                  ${iconOrImage(a.icon, a.key, 20)}
                </div>
                <span style="font-size:0.75rem;font-weight:600;color:#111827;">${a.label}</span>
              </button>`
              )
              .join("")}
          </div>
        </div>

        <div style="margin:0.3rem 0.5rem 0;background:white;padding:0.55rem 0.7rem;border-radius:0.875rem;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <div class="flex items-center" style="gap:0.5rem;">
            <div style="color:${primaryColor};display:flex;flex-shrink:0;">${iconOrImage("mail", "stay-informed", 24)}</div>
            <div>
              <h3 style="font-weight:700;font-size:0.7rem;margin:0;line-height:1.2;">Take Control, Stay Informed</h3>
              <p style="font-size:0.625rem;color:#6b7280;margin:1px 0 0;line-height:1.2;">Add your email, get the latest from OPay</p>
            </div>
          </div>
        </div>

        <div style="background:white;margin:0.3rem 0.5rem 0;padding:0.75rem 0.5rem;border-radius:0.875rem;box-shadow:0 1px 2px rgb(0 0 0 / 0.04);">
          <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:0.3rem;row-gap:0.7rem;">
            ${services
              .map(
                (s) => `
              <button data-nav="${s.path}" style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;position:relative;padding:0.15rem;background:none;border:none;">
                <div style="position:relative;">
                  <div style="width:2.75rem;height:2.75rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}17;">
                    ${iconOrImage(s.icon, s.key, 22)}
                  </div>
                  ${
                    s.badge
                      ? `<span style="position:absolute;top:-5px;right:-8px;background:#ef4444;color:white;font-size:7px;font-weight:700;padding:1px 4px;border-radius:9999px;white-space:nowrap;">${s.badge}</span>`
                      : ""
                  }
                </div>
                <span style="font-size:0.7rem;font-weight:600;color:#111827;">${s.label}</span>
              </button>`
              )
              .join("")}
          </div>
        </div>
      </div>

      ${BottomNav("home")}
    </div>`;
  }

  function bind() {
    container.querySelector("#profile-btn").addEventListener("click", () => navigate("/me"));
    container.querySelector("#help-btn").addEventListener("click", () => navigate("/help"));
    container.querySelector("#qr-btn").addEventListener("click", () => navigate("/qr-code"));
    container.querySelector("#notif-btn").addEventListener("click", () => navigate("/notifications"));
    container.querySelector("#tx-history-link").addEventListener("click", () => navigate("/transaction-history"));
    const txViewAll = container.querySelector("#tx-view-all");
    if (txViewAll) txViewAll.addEventListener("click", () => navigate("/transaction-history"));

    container.querySelector("#toggle-balance").addEventListener("click", () => {
      showBalance = !showBalance;
      container.querySelector("#balance-card-wrap").innerHTML = renderBalanceCard();
      container.querySelector("#tx-card-wrap").innerHTML = renderTransactionsCard();
      rebindDynamic();
    });
    const addMoneyBtn = container.querySelector("#add-money-btn");
    if (addMoneyBtn) addMoneyBtn.addEventListener("click", () => navigate("/me", { openAddMoney: true }));
    container.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => navigate(btn.dataset.nav));
    });
  }

  function rebindDynamic() {
    const toggleBtn = container.querySelector("#toggle-balance");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        showBalance = !showBalance;
        container.querySelector("#balance-card-wrap").innerHTML = renderBalanceCard();
        container.querySelector("#tx-card-wrap").innerHTML = renderTransactionsCard();
        rebindDynamic();
      });
    }
    const addMoneyBtn = container.querySelector("#add-money-btn");
    if (addMoneyBtn) addMoneyBtn.addEventListener("click", () => navigate("/me", { openAddMoney: true }));
    const link = container.querySelector("#tx-history-link");
    if (link) link.addEventListener("click", () => navigate("/transaction-history"));

    const viewAll = container.querySelector("#tx-view-all");
    if (viewAll) viewAll.addEventListener("click", () => navigate("/transaction-history"));
  }

  container.innerHTML = fullHtml();
  bind();
}

function showAddMoneyModal() {
  const { primaryColor } = Stores.customization.get();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;z-index:1000;';
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = 'background:white;border-radius:1.5rem 1.5rem 0 0;padding:1.5rem;width:100%;max-height:80vh;overflow-y:auto;';
  
  modalContent.innerHTML = `
    <h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin:0 0 1.5rem;">Add Money to OPay</h2>
    
    <div style="margin-bottom:1.5rem;">
      <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 1rem;">Select Bank</h3>
      <div id="bank-selector" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;"></div>
    </div>

    <div style="margin-bottom:1.5rem;">
      <label style="font-size:0.8125rem;color:#6b7280;display:block;margin-bottom:0.5rem;">Amount</label>
      <input id="add-amount" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter amount" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;font-family:inherit;" />
    </div>

    <button id="add-proceed-btn" style="width:100%;background:${primaryColor};color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:600;font-size:0.9375rem;cursor:pointer;">Proceed</button>
    <button id="add-cancel-btn" style="width:100%;background:none;color:#6b7280;border:1px solid #e5e7eb;border-radius:0.75rem;font-weight:600;padding:0.75rem;margin-top:0.75rem;cursor:pointer;">Cancel</button>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  const banks = [
    { name: 'GTB', code: 'gtb' },
    { name: 'Access', code: 'access' },
    { name: 'First Bank', code: 'fb' },
    { name: 'UBA', code: 'uba' },
    { name: 'Zenith', code: 'zenith' },
    { name: 'FCMB', code: 'fcmb' }
  ];
  
  let selectedBank = '';
  let amount = '';
  
  const bankSelector = modal.querySelector('#bank-selector');
  banks.forEach(bank => {
    const btn = document.createElement('button');
    btn.style.cssText = `
      padding:1rem;
      border:2px solid #e5e7eb;
      border-radius:0.75rem;
      background:white;
      cursor:pointer;
      font-weight:600;
      font-size:0.875rem;
      transition:all 0.2s;
    `;
    btn.textContent = bank.name;
    btn.addEventListener('click', () => {
      selectedBank = bank;
      bankSelector.querySelectorAll('button').forEach(b => {
        b.style.borderColor = '#e5e7eb';
        b.style.color = '#111827';
      });
      btn.style.borderColor = primaryColor;
      btn.style.color = primaryColor;
    });
    bankSelector.appendChild(btn);
  });
  
  const amountInp = modal.querySelector('#add-amount');
  amountInp.addEventListener('input', (e) => {
    amount = e.target.value;
  });
  
  modal.querySelector('#add-proceed-btn').addEventListener('click', () => {
    if (!selectedBank) {
      alert('Please select a bank');
      return;
    }
    if (!amount) {
      alert('Please enter amount');
      return;
    }
    modal.remove();
    showBankReceiptModal(selectedBank, amount);
  });
  
  modal.querySelector('#add-cancel-btn').addEventListener('click', () => modal.remove());
}

function showBankReceiptModal(bank, amount) {
  const { primaryColor } = Stores.customization.get();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:flex-end;z-index:1000;';
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = 'background:white;border-radius:1.5rem 1.5rem 0 0;padding:1.5rem;width:100%;max-height:80vh;overflow-y:auto;';
  
  const bankDetails = {
    gtb: { accountNumber: '0016548974', accountName: 'OPay Limited' },
    access: { accountNumber: '0087654321', accountName: 'OPay Limited' },
    fb: { accountNumber: '0123456789', accountName: 'OPay Limited' },
    uba: { accountNumber: '9876543210', accountName: 'OPay Limited' },
    zenith: { accountNumber: '5432109876', accountName: 'OPay Limited' },
    fcmb: { accountNumber: '1234567890', accountName: 'OPay Limited' }
  };
  
  const details = bankDetails[bank.code] || bankDetails.gtb;
  
  modalContent.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin:0;margin-bottom:1rem;">Bank Transfer Details</h2>
      <p style="color:#6b7280;font-size:0.875rem;margin:0;">Transfer exactly ₦${formatMoney(amount)} to complete your deposit</p>
    </div>

    <div style="background:#f9fafb;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;">
      <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #e5e7eb;">
        <span style="color:#6b7280;font-size:0.875rem;">Bank Name</span>
        <span style="font-weight:600;color:#111827;">${bank.name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #e5e7eb;">
        <span style="color:#6b7280;font-size:0.875rem;">Account Name</span>
        <span style="font-weight:600;color:#111827;">${details.accountName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #e5e7eb;">
        <span style="color:#6b7280;font-size:0.875rem;">Account Number</span>
        <span style="font-weight:600;color:#111827;font-family:monospace;">${details.accountNumber}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:0.75rem 0;">
        <span style="color:#6b7280;font-size:0.875rem;">Amount</span>
        <span style="font-weight:700;color:${primaryColor};font-size:1rem;">₦${formatMoney(amount)}</span>
      </div>
    </div>

    <div style="background:#e0f2fe;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;font-size:0.875rem;color:#0369a1;">
      <strong>Note:</strong> Your account will be credited automatically after we confirm the bank transfer. This usually takes 5-10 minutes.
    </div>

    <button id="confirm-deposit-btn" style="width:100%;background:${primaryColor};color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:600;font-size:0.9375rem;cursor:pointer;">I Have Sent The Money</button>
    <button id="cancel-deposit-btn" style="width:100%;background:none;color:#6b7280;border:1px solid #e5e7eb;border-radius:0.75rem;font-weight:600;padding:0.75rem;margin-top:0.75rem;cursor:pointer;">Cancel</button>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  modal.querySelector('#confirm-deposit-btn').addEventListener('click', () => {
    modal.remove();
    const txId = Date.now().toString().slice(-12);
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const userAccount = Stores.balance.get();
    
    Stores.transaction.addTransaction({
      type: 'Deposit from ' + bank.name,
      amount: `+₦${formatMoney(amount)}`,
      status: 'Successful',
      icon: 'plus-circle'
    });
    Stores.balance.set(s => ({ balance: s.balance + parseFloat(amount) }));
    showTransactionReceipt({
      title: `Deposit from ${bank.name}`,
      amount: `+₦${formatMoney(amount)}`,
      success: true,
      date: new Date().toLocaleString(),
      details: [
        { label: 'Recipient Details', value: `${userAccount.accountName}<br/>${userAccount.bank} | ${userAccount.accountNumber}` },
        { label: 'Transaction No.', value: txId },
        { label: 'Payment Method', value: bank.name },
        { label: 'Transaction Date', value: new Date().toLocaleString() },
        { label: 'Session ID', value: sessionId }
      ],
      variant: 'tracker',
      onClose: () => navigate('/dashboard')
    });
  });
  
  modal.querySelector('#cancel-deposit-btn').addEventListener('click', () => modal.remove());
}

window.renderDashboard = renderDashboard;
window.showAddMoneyModal = showAddMoneyModal;
window.showBankReceiptModal = showBankReceiptModal;
