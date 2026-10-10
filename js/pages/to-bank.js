function renderToBankPage(container) {
  let selectedBank = "";
  let selectedBankCode = "";
  let accountNumber = "";
  let accountName = "";
  let amount = "";
  let verifiedAccount = null;

  function getRecents() {
    return Stores.recentTransfers.get().bank || [];
  }

  function bankBadge(bankName) {
    const colors = {
      'GTBank': '#FF6600', 'GTB': '#FF6600',
      'Access Bank': '#D41159', 'First Bank': '#1a3365',
      'UBA': '#EC1C24', 'Zenith Bank': '#001E6C',
      'FCMB': '#004B93', 'Stanbic IBTC': '#003478',
      'OPay': '#00B875', 'Monie Point': '#0e0e52',
      'MONIE POINT': '#0e0e52', 'PalmPay': '#00b300',
      'Wema Bank': '#01aeef', 'Fidelity Bank': '#008000',
    };
    const initial = bankName ? bankName[0].toUpperCase() : 'B';
    const bg = colors[bankName] || '#6b7280';
    return `<div style="width:2rem;height:2rem;border-radius:9999px;background:${bg};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;">${initial}</div>`;
  }

  function renderRecentItem(r, idx) {
    const acctLabel = r.account_number + ' ' + r.bank;
    return `
    <button data-recent-idx="${idx}" style="width:100%;display:flex;align-items:center;gap:0.75rem;padding:0.875rem 0;border:none;background:none;cursor:pointer;border-bottom:1px solid #f3f4f6;text-align:left;">
      <div style="width:2.5rem;height:2.5rem;border-radius:9999px;background:#e0f2fe;display:flex;align-items:center;justify-content:center;color:#0369a1;flex-shrink:0;">
        ${Icon('user',{size:16})}
      </div>
      <div style="flex:1;min-width:0;">
        <p style="font-size:0.875rem;font-weight:600;color:#111827;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name}</p>
        <p style="font-size:0.75rem;color:#6b7280;margin:0.25rem 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${acctLabel}</p>
      </div>
      ${bankBadge(r.bank)}
    </button>`;
  }

  function render() {
    const { primaryColor, adBanners } = Stores.customization.get();
    const recents = getRecents();

    function adCarouselHtml() {
      if (!adBanners || adBanners.length === 0) return '';
      return `
      <div style="position:relative;overflow:hidden;border-radius:0.875rem;margin-bottom:1rem;">
        <div id="ad-carousel-inner" style="display:flex;transition:transform 0.35s ease;">
          ${adBanners.map(url => `
          <div style="min-width:100%;border-radius:0.875rem;overflow:hidden;">
            <img src="${url}" style="width:100%;height:auto;display:block;" />
          </div>`).join('')}
        </div>
        ${adBanners.length > 1 ? `<div style="display:flex;justify-content:center;gap:5px;margin-top:0.5rem;">
          ${adBanners.map((_, i) => `<div class="ad-dot" data-idx="${i}" style="width:6px;height:6px;border-radius:9999px;background:${i === 0 ? primaryColor : '#d1d5db'};"></div>`).join('')}
        </div>` : ''}
      </div>`;
    }

    container.innerHTML = `
    <div style="display:flex;flex-direction:column;min-height:100vh;background:#f9fafb;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:white;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:10;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;color:#111827;cursor:pointer;">${Icon('chevron-left',{size:22})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Transfer to Bank Account</h1>
        </div>
        <button style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">History</button>
      </div>

      <div style="flex:1;overflow-y:auto;padding:1rem 1.25rem;">

        ${adBanners && adBanners.length > 0 ? adCarouselHtml() : ''}

        <!-- Free transfers badge -->
        <div style="background:#f5f3ff;border-radius:0.75rem;padding:0.875rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:0.625rem;">
          <div style="width:24px;height:24px;border-radius:9999px;background:#7c3aed;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('zap',{size:13,color:'white'})}
          </div>
          <p style="font-size:0.875rem;font-weight:700;color:#7c3aed;margin:0;">Free transfers for the day: <span style="font-size:1.0625rem;">3</span></p>
        </div>

        <!-- Recipient Account card -->
        <div style="background:white;border-radius:0.875rem;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1rem;">
          <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 1rem;">Recipient Account</h3>

          <div style="border:1px solid #e5e7eb;border-radius:0.75rem;overflow:hidden;margin-bottom:0.75rem;">
            <input id="account-input" type="text" inputmode="numeric" pattern="[0-9]*"
              placeholder="Enter 10 digits Account Number"
              value="${accountNumber}"
              style="width:100%;padding:0.875rem 1rem;border:none;outline:none;font-size:0.9375rem;font-family:inherit;box-sizing:border-box;" />
          </div>

          <div id="bank-select" style="border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.875rem 1rem;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:white;margin-bottom:1rem;">
            <span style="color:${selectedBank ? '#111827' : '#9ca3af'};font-size:0.9375rem;">${selectedBank || 'Select Bank'}</span>
            ${Icon('chevron-right',{size:18,color:'#9ca3af'})}
          </div>

          <!-- Verified account name display -->
          ${verifiedAccount ? `
          <div style="background:#ecfdf5;border:1px solid #86efac;border-radius:0.75rem;padding:0.875rem 1rem;margin-bottom:1rem;">
            <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.375rem;font-weight:500;">VERIFIED ACCOUNT NAME</p>
            <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">${verifiedAccount.account_name}</p>
            <div style="display:flex;align-items:center;gap:0.25rem;margin-top:0.375rem;">
              ${Icon('check',{size:14,color:'#16a34a'})}
              <p style="font-size:0.75rem;color:#6b7280;margin:0;">Account verified</p>
            </div>
          </div>` : ''}

          <button id="next-btn" style="width:100%;background:${verifiedAccount ? primaryColor : '#a0e0c4'};color:white;border:none;padding:0.9rem;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;transition:background 0.2s;">
            ${verifiedAccount ? 'Next' : 'Next'}
          </button>
        </div>

        <!-- Bank Transfer Success Rate Monitor -->
        <div style="background:white;border:1px solid #e5e7eb;border-radius:0.875rem;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.875rem;margin-bottom:1rem;cursor:pointer;">
          <div style="width:40px;height:40px;border-radius:0.625rem;background:#e8f5ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('bar-chart',{size:20,color:primaryColor})}
          </div>
          <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0;flex:1;">Bank Transfer Success Rate Monitor</p>
          ${Icon('chevron-right',{size:18,color:'#9ca3af'})}
        </div>

        <!-- Recents / Favourites -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;gap:1.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0;">
            <button id="tab-recents" style="background:none;border:none;font-weight:700;font-size:0.9375rem;color:${primaryColor};padding:0 0 0.75rem;border-bottom:2px solid ${primaryColor};cursor:pointer;">Recents</button>
            <button id="tab-favs" style="background:none;border:none;font-weight:600;font-size:0.9375rem;color:#6b7280;padding:0 0 0.75rem;cursor:pointer;">Favourites</button>
            <button style="background:none;border:none;margin-left:auto;padding:0 0 0.75rem;cursor:pointer;color:#6b7280;">
              ${Icon('search',{size:18})}
            </button>
          </div>
          <div id="recents-list">
            ${recents.length === 0
              ? `<p style="color:#9ca3af;font-size:0.875rem;text-align:center;padding:1.5rem 0;margin:0;">No recent bank transfers yet</p>`
              : recents.slice(0, 5).map((r, i) => renderRecentItem(r, i)).join('')
            }
          </div>
        </div>

      </div>
    </div>`;

    document.getElementById("back-btn").addEventListener("click", () => navigate("/dashboard"));
    document.getElementById("bank-select").addEventListener("click", () => {
      showBankSelector((bank) => {
        selectedBank = bank;
        const bankData = NIGERIAN_BANKS.find(b => b.name === bank);
        selectedBankCode = bankData ? bankData.code : "";
        render();
      });
    });

    document.getElementById("account-input").addEventListener("input", (e) => {
      accountNumber = e.target.value;
      verifiedAccount = null;
    });

    // Ad carousel
    const inner = container.querySelector('#ad-carousel-inner');
    if (inner && adBanners && adBanners.length > 1) {
      let cur = 0;
      const dots = container.querySelectorAll('.ad-dot');
      setInterval(() => {
        cur = (cur + 1) % adBanners.length;
        inner.style.transform = `translateX(-${cur * 100}%)`;
        dots.forEach((d, i) => d.style.background = i === cur ? primaryColor : '#d1d5db');
      }, 3500);
    }

    // Click a recent to prefill
    container.querySelectorAll('[data-recent-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = getRecents()[parseInt(btn.dataset.recentIdx)];
        if (!r) return;
        accountNumber = r.account_number;
        selectedBank = r.bank;
        const bankData = NIGERIAN_BANKS.find(b => b.name === r.bank);
        selectedBankCode = bankData ? bankData.code : '';
        verifiedAccount = { account_name: r.name };
        render();
      });
    });

    document.getElementById("next-btn").addEventListener("click", async () => {
      if (!accountNumber || accountNumber.length < 10) {
        toast.error('Enter a 10-digit account number'); return;
      }
      if (!selectedBank) {
        toast.error('Select a bank'); return;
      }
      if (!verifiedAccount) {
        // Verify
        const btn = document.getElementById("next-btn");
        btn.textContent = 'Verifying...'; btn.disabled = true;
        try {
          const res = await fetch(
            `/api/verify-account?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(selectedBankCode)}`,
            { credentials: 'include' }
          );
          const data = await res.json();
          btn.textContent = 'Next'; btn.disabled = false;
          if (data.ok) {
            verifiedAccount = data;
            accountName = data.account_name;
            render();
          } else {
            toast.error(data.error || 'Could not verify account');
          }
        } catch (e) {
          btn.textContent = 'Next'; btn.disabled = false;
          toast.error('Verification failed. Enter name manually.');
          verifiedAccount = { account_name: accountName || 'Unknown' };
          render();
        }
      } else {
        showAmountStep();
      }
    });
  }

  function showAmountStep() {
    const { primaryColor } = Stores.customization.get();
    const recName = verifiedAccount.account_name;
    container.innerHTML = `
    <div style="display:flex;flex-direction:column;min-height:100vh;background:#f9fafb;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:white;border-bottom:1px solid #e5e7eb;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;color:#111827;cursor:pointer;">${Icon('chevron-left',{size:22})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;">Transfer to Bank Account</h1>
        </div>
        <button style="background:none;border:none;color:${primaryColor};font-weight:600;cursor:pointer;">History</button>
      </div>
      <div style="padding:1.25rem;">
        <div style="background:white;border-radius:0.875rem;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;padding-bottom:0.875rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.875rem;">
            <div style="width:40px;height:40px;border-radius:9999px;background:#e0f2fe;display:flex;align-items:center;justify-content:center;">
              ${Icon('user',{size:20,color:'#0369a1'})}
            </div>
            <div>
              <p style="font-weight:700;font-size:0.9375rem;color:#111827;margin:0;">${recName}</p>
              <p style="font-size:0.8125rem;color:#6b7280;margin:0.2rem 0 0;">${accountNumber} · ${selectedBank}</p>
            </div>
          </div>

          <label style="font-size:0.8125rem;color:#6b7280;font-weight:600;display:block;margin-bottom:0.5rem;">Amount</label>
          <div style="display:flex;align-items:center;border:1.5px solid #e5e7eb;border-radius:0.75rem;padding:0.875rem 1rem;gap:0.5rem;">
            <span style="font-size:1.25rem;font-weight:700;color:#6b7280;">₦</span>
            <input id="amount-input" type="text" inputmode="numeric" placeholder="0"
              value="${amount}"
              style="flex:1;border:none;outline:none;font-size:1.375rem;font-weight:700;color:#111827;font-family:inherit;" />
          </div>
          <div id="amount-err" style="color:#ef4444;font-size:0.8rem;min-height:1.2em;margin-top:0.375rem;"></div>
        </div>

        <button id="send-btn" style="width:100%;background:${primaryColor};color:white;border:none;padding:0.9rem;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;">Send</button>
      </div>
    </div>`;

    document.getElementById('back-btn').addEventListener('click', () => render());

    const amountInput = document.getElementById('amount-input');
    const sendBtn = document.getElementById('send-btn');
    const errEl = document.getElementById('amount-err');

    sendBtn.addEventListener('click', async () => {
      const amt = parseFloat(amountInput.value.replace(/,/g,'') || '0');
      errEl.textContent = '';
      if (!amt || amt <= 0) { errEl.textContent = 'Enter an amount'; return; }
      amount = amountInput.value;
      showBankTransactionSuccess(accountNumber, selectedBank, verifiedAccount.account_name, amt);
    });
  }

  function showBankTransactionSuccess(account, bank, name, amt) {
    const txId = Date.now().toString().slice(-12);
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const bankData = NIGERIAN_BANKS.find(b => b.name === bank);
    const bankLogo = bankData ? bankData.logo : null;

    // Save to recent transfers
    Stores.recentTransfers.addBank({
      name,
      account_number: account,
      bank,
    });

    Stores.transaction.addTransaction({
      type: `Transfer to ${name}`,
      amount: `-₦${formatMoney(amt)}`,
      status: 'Successful',
      icon: 'building-2'
    });
    Stores.balance.set(s => ({ balance: s.balance - parseFloat(amt) }));
    showTransactionReceipt({
      title: `${bank}`,
      amount: `-₦${formatMoney(amt)}`,
      success: true,
      date: new Date().toLocaleString(),
      details: [
        { label: 'Recipient Details', value: `${name}<br/>${bank} | ${account}` },
        { label: 'Transaction No.', value: txId },
        { label: 'Payment Method', value: 'OWealth' },
        { label: 'Transaction Date', value: new Date().toLocaleString() },
        { label: 'Session ID', value: sessionId }
      ],
      variant: 'tracker',
      recipientIcon: bankLogo,
      onClose: () => navigate('/dashboard')
    });
  }

  render();
}

window.renderToBankPage = renderToBankPage;
