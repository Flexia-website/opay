function renderBettingPage(container) {
  const platforms = [
    { id: 'sportybet', name: 'SportyBet', color: '#00a651', textColor: 'white', letter: 'S' },
    { id: 'ilotbet',   name: 'iLOTBet',   color: '#1a1a2e', textColor: 'white', letter: 'i' },
    { id: '1xbet',     name: '1xBET',     color: '#1a5fa1', textColor: 'white', letter: '1' },
  ];

  // Amount grid matching screenshot: ₦100/200/300(Pay ₦270)/400/500/1000
  const quickAmounts = [
    { value: '100',  display: '₦100',  pay: null },
    { value: '200',  display: '₦200',  pay: null },
    { value: '300',  display: '₦300',  pay: '₦270' },
    { value: '400',  display: '₦400',  pay: '₦370' },
    { value: '500',  display: '₦500',  pay: '₦460' },
    { value: '1000', display: '₦1,000', pay: '₦930' },
  ];

  let selectedPlatform = platforms[0].id; // default SportyBet
  let accountId = '';
  let selectedAmount = '';
  let customAmount = '';

  function platformLogo(p, size) {
    return `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${p.color};color:${p.textColor};display:flex;align-items:center;justify-content:center;font-size:${size*0.4}px;font-weight:900;flex-shrink:0;">${p.letter}</div>`;
  }

  function render() {
    const { primaryColor } = Stores.customization.get();
    const activeP = platforms.find(p => p.id === selectedPlatform);
    const amount = selectedAmount || customAmount;
    const canPay = selectedPlatform && accountId.trim() && amount;

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:2rem;">

      <!-- Header -->
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Betting</h1>
        </div>
        <button id="history-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">History</button>
      </div>

      <div style="padding:1rem;">

        <!-- Hot Offers banner card -->
        <div style="background:white;border-radius:0.875rem;padding:1rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
            <div style="display:flex;align-items:center;gap:0.375rem;">
              <span style="font-size:1.125rem;">🔥</span>
              <span style="font-size:0.9375rem;font-weight:700;color:#111827;">Hot Offers</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.375rem;">
              <span style="background:#fef3c7;color:#d97706;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:9999px;">₦70</span>
              <button style="background:none;border:none;font-size:0.875rem;color:#6b7280;cursor:pointer;">All &gt;</button>
            </div>
          </div>
          <div style="display:flex;gap:0.75rem;">
            <!-- iLOTBet ad tile -->
            <div style="flex:2;background:#0a2a1a;border-radius:0.75rem;padding:0.875rem;min-height:80px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
              <div style="position:absolute;top:6px;left:8px;display:flex;align-items:center;gap:4px;">
                <span style="background:#22c55e;color:white;font-size:0.6rem;font-weight:800;padding:1px 5px;border-radius:2px;">iLOTBET</span>
                <span style="background:#00B875;color:white;font-size:0.6rem;font-weight:800;padding:1px 5px;border-radius:2px;">OPay</span>
              </div>
              <div style="margin-top:1.5rem;">
                <p style="color:white;font-size:0.8125rem;font-weight:800;margin:0;line-height:1.3;">Deposit &amp; Claim up to<br/>100% Coupon</p>
                <button style="margin-top:0.5rem;background:white;color:#0a2a1a;border:none;border-radius:9999px;padding:3px 12px;font-size:0.75rem;font-weight:700;cursor:pointer;">Claim Now</button>
              </div>
            </div>
            <!-- voucher tile -->
            <div style="flex:1;border:1.5px solid #e5e7eb;border-radius:0.75rem;padding:0.75rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;">
              <p style="font-size:1.25rem;font-weight:900;color:${primaryColor};margin:0;">₦100</p>
              <p style="font-size:0.7rem;color:#6b7280;margin:0;text-align:center;">iLOTBet Voucher</p>
              <button style="background:none;border:1.5px solid ${primaryColor};border-radius:9999px;padding:3px 14px;font-size:0.8rem;font-weight:700;color:${primaryColor};cursor:pointer;">Get</button>
            </div>
          </div>
        </div>

        <!-- Platform tabs -->
        <div style="background:white;border-radius:0.875rem;padding:1rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;gap:0.875rem;overflow-x:auto;padding-bottom:0.25rem;">
            ${platforms.map(p => `
            <button data-platform="${p.id}" style="display:flex;flex-direction:column;align-items:center;gap:0.375rem;flex-shrink:0;background:none;border:none;cursor:pointer;padding:0 0.25rem;padding-bottom:0.5rem;border-bottom:2.5px solid ${selectedPlatform===p.id?primaryColor:'transparent'};">
              ${platformLogo(p, 44)}
              <span style="font-size:0.75rem;font-weight:600;color:${selectedPlatform===p.id?primaryColor:'#6b7280'};">${p.name}</span>
            </button>`).join('')}
            <!-- More button -->
            <button style="display:flex;flex-direction:column;align-items:center;gap:0.375rem;flex-shrink:0;background:none;border:none;cursor:pointer;padding:0 0.25rem;padding-bottom:0.5rem;border-bottom:2.5px solid transparent;">
              <div style="width:44px;height:44px;border-radius:9999px;border:1.5px solid #e5e7eb;display:flex;align-items:center;justify-content:center;color:#9ca3af;">···</div>
              <span style="font-size:0.75rem;font-weight:600;color:#9ca3af;">More</span>
            </button>
          </div>
        </div>

        <!-- User ID -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <p style="font-size:0.875rem;font-weight:700;color:#374151;margin:0 0 0.75rem;">User ID</p>
          <div style="border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
            <input id="account-input" type="text" inputmode="numeric" placeholder="Enter your User ID"
              value="${accountId}"
              style="border:none;outline:none;font-size:1rem;font-weight:700;color:#111827;font-family:inherit;flex:1;background:transparent;" />
            ${Icon('chevron-down',{size:20,color:'#9ca3af'})}
          </div>
        </div>

        <!-- Select Amount -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <p style="font-size:0.875rem;font-weight:700;color:#374151;margin:0 0 0.875rem;">Select Amount</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.625rem;margin-bottom:1rem;">
            ${quickAmounts.map(a => `
            <button data-amount="${a.value}" style="border:1.5px solid ${selectedAmount===a.value?primaryColor:'#e5e7eb'};background:${selectedAmount===a.value?primaryColor+'12':'white'};border-radius:0.75rem;padding:0.75rem 0.5rem;text-align:center;cursor:pointer;">
              <p style="font-size:0.9375rem;font-weight:800;color:#111827;margin:0;">${a.display}</p>
              ${a.pay ? `<p style="font-size:0.75rem;color:${primaryColor};font-weight:600;margin:2px 0 0;">Pay ${a.pay}</p>` : ''}
            </button>`).join('')}
          </div>

          <!-- Custom amount row -->
          <div style="display:flex;align-items:center;gap:0.75rem;border-top:1px solid #f3f4f6;padding-top:0.875rem;">
            <span style="font-size:1rem;color:#9ca3af;font-weight:600;">₦</span>
            <input id="custom-amount" type="text" inputmode="numeric"
              placeholder="100-1,000,000"
              value="${customAmount}"
              style="flex:1;border:none;border-bottom:1px solid #e5e7eb;outline:none;font-size:0.9375rem;padding:0.375rem 0;font-family:inherit;background:transparent;" />
            <button id="pay-btn" style="background:${canPay?primaryColor:'#d1fae5'};color:${canPay?'white':'#6b7280'};border:none;border-radius:9999px;padding:0.625rem 1.5rem;font-weight:700;font-size:0.9375rem;cursor:pointer;flex-shrink:0;">Pay</button>
          </div>
        </div>

        <!-- More Events -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.875rem;">More Events</p>
          <div style="display:flex;align-items:flex-start;gap:0.875rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6;">
            <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;background:#fef9c3;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.25rem;">☀️</div>
            <div>
              <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0 0 0.25rem;">Exclusive Bonus, New Users Only!</p>
              <p style="font-size:0.8rem;color:#6b7280;margin:0;line-height:1.4;">Check-in 7 days and claim up to ₦7,150 bonus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/dashboard'));
    container.querySelector('#history-btn').addEventListener('click', () => navigate('/transaction-history'));

    container.querySelectorAll('[data-platform]').forEach(btn => {
      btn.addEventListener('click', () => { selectedPlatform = btn.dataset.platform; render(); });
    });

    const acctInput = container.querySelector('#account-input');
    acctInput.addEventListener('input', () => { accountId = acctInput.value; });

    container.querySelectorAll('[data-amount]').forEach(btn => {
      btn.addEventListener('click', () => { selectedAmount = btn.dataset.amount; customAmount = ''; render(); });
    });

    const custInput = container.querySelector('#custom-amount');
    custInput.addEventListener('input', () => { customAmount = custInput.value.replace(/[^\d]/g,''); selectedAmount = ''; });
    attachAmountKeypad(custInput, { decimal: false });

    const payBtn = container.querySelector('#pay-btn');
    payBtn.addEventListener('click', () => {
      if (!canPay) return;
      const amt = parseInt((selectedAmount || customAmount).replace(/,/g,''), 10);
      const { balance } = Stores.balance.get();
      if (amt > balance) { toast.error('Insufficient balance'); return; }
      const pName = platforms.find(p => p.id === selectedPlatform)?.name || '';
      showPinModal({
        amount: amt.toLocaleString(),
        recipientLabel: pName,
        onConfirm: () => {
          Stores.balance.set({ balance: balance - amt });
          const now = new Date();
          const fd = `${now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}`;
          const txId = '25'+Math.floor(Math.random()*1e18).toString().padStart(20,'0');
          Stores.transaction.addTransaction({ type: `${pName} Deposit`, amount: `-₦${amt.toLocaleString()}`, status: 'Successful', icon: 'activity' });
          showTransactionReceipt({
            amount: `₦${amt.toLocaleString()}`, success: true, date: fd,
            details: [
              { label: 'Betting Platform', value: pName },
              { label: 'User ID', value: accountId },
              { label: 'Transaction No.', value: txId },
            ],
            title: `${pName} Deposit`,
            footerText: 'Enjoy a better life with OPay.',
            onClose: () => { selectedAmount=''; customAmount=''; render(); },
          });
        },
      });
    });
  }

  render();
}

window.renderBettingPage = renderBettingPage;
