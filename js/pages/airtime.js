function renderAirtimePage(container) {
  const amounts = [
    { amount: '100',   cashbackLabel: '₦1 Cashback',   cashbackVal: 1 },
    { amount: '200',   cashbackLabel: '₦2 Cashback',   cashbackVal: 2 },
    { amount: '300',   cashbackLabel: '₦3 Cashback',   cashbackVal: 3 },
    { amount: '500',   cashbackLabel: '₦4.5 Cashback', cashbackVal: 4.5 },
    { amount: '1,000', cashbackLabel: '₦9 Cashback',   cashbackVal: 9 },
    { amount: '2,000', cashbackLabel: '₦18 Cashback',  cashbackVal: 18 },
  ];

  // Inline SVG logos matching real OPay app (screenshot 1)
  const networkSVGs = {
    mtn:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FFCB05"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="10" font-weight="900" fill="#111" font-family="Arial">MTN</text></svg>`,
    airtel:   `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FF0000"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="9" font-weight="900" fill="white" font-family="Arial">airtel</text></svg>`,
    glo:      `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#00A651"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="12" font-weight="900" fill="white" font-family="Arial">glo</text></svg>`,
    t2mobile: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fff3e0"/><path d="M10 14h20M20 14v12" stroke="#F97316" stroke-width="3" stroke-linecap="round"/></svg>`,
    vitel:    `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#0EA5E9"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-size="9" font-weight="900" fill="white" font-family="Arial">VITEL</text></svg>`,
  };

  function netSvg(netId, size) {
    const { networkImages } = Stores.customization.get();
    const img = networkImages && networkImages[netId];
    if (img) return `<img src="${img}" style="width:${size}px;height:${size}px;border-radius:9999px;object-fit:cover;" />`;
    const svg = networkSVGs[netId];
    if (!svg) return `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:#e5e7eb;"></div>`;
    // Scale the 40×40 SVG
    return `<span style="display:inline-flex;width:${size}px;height:${size}px;flex-shrink:0;">${svg.replace('width="40" height="40"', `width="${size}" height="${size}"`)}</span>`;
  }

  let selectedNetwork = 'mtn';
  let showNetworkPicker = false;
  let phoneNumber = '0816 0881 049';
  let selectedAmount = '';
  let customAmount = '';

  function render() {
    const { primaryColor, adBanners } = Stores.customization.get();
    const amount = selectedAmount || customAmount;
    const canPay = selectedNetwork && phoneNumber.trim() && amount;
    const nets = window.NETWORKS || [];

    function adCarouselHtml() {
      if (!adBanners || adBanners.length === 0) return `
        <div style="background:linear-gradient(135deg,#e8f5e9,#f0fdf4);border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:0.875rem;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:0.375rem;margin-bottom:0.375rem;">
              <span style="font-size:0.625rem;color:#6b7280;background:rgba(0,0,0,0.08);padding:1px 5px;border-radius:2px;">AD</span>
              <span style="font-size:0.625rem;color:#6b7280;">OPay × WAJE</span>
            </div>
            <p style="color:#111827;font-weight:800;font-size:0.9375rem;margin:0 0 4px;line-height:1.3;">New here? <span style="color:${primaryColor};">₦600 Sports Offer</span></p>
            <p style="color:#374151;font-size:0.75rem;margin:0 0 0.5rem;">A welcome bonus for new users</p>
            <button style="background:#111827;color:white;border:none;border-radius:0.375rem;padding:5px 12px;font-size:0.75rem;font-weight:700;cursor:pointer;">Get Started</button>
          </div>
          <div style="font-size:2.5rem;opacity:0.6;">⚽</div>
        </div>`;
      return `
        <div style="position:relative;overflow:hidden;border-radius:0.875rem;margin-bottom:0.875rem;">
          <div id="ad-inner" style="display:flex;transition:transform 0.35s ease;">
            ${adBanners.map(url => `<div style="min-width:100%;border-radius:0.875rem;overflow:hidden;"><img src="${url}" style="width:100%;display:block;" /></div>`).join('')}
          </div>
          ${adBanners.length > 1 ? `<div style="display:flex;justify-content:center;gap:5px;margin-top:0.375rem;">${adBanners.map((_,i)=>`<div class="ad-dot" data-i="${i}" style="width:6px;height:6px;border-radius:9999px;background:${i===0?primaryColor:'#d1d5db'};"></div>`).join('')}</div>` : ''}
        </div>`;
    }

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:2rem;">

      <!-- Header -->
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Airtime</h1>
        </div>
        <button id="history-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">History</button>
      </div>

      <div style="padding:1rem;">

        ${adCarouselHtml()}

        <!-- Phone selector row -->
        <div style="background:white;border-radius:0.875rem;padding:0.875rem 1.25rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);position:relative;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <button id="network-toggle" style="display:flex;align-items:center;gap:0.375rem;background:none;border:none;cursor:pointer;flex-shrink:0;padding:0;">
              ${netSvg(selectedNetwork, 38)}
              ${Icon('chevron-down',{size:13,color:'#9ca3af'})}
            </button>
            <span style="color:#d1d5db;font-size:1.5rem;line-height:1;">|</span>
            <input id="phone-input" type="tel"
              value="${phoneNumber}"
              style="flex:1;border:none;outline:none;font-size:1.0625rem;font-weight:700;color:#111827;font-family:inherit;background:transparent;" />
            <button style="width:2rem;height:2rem;border-radius:9999px;background:${primaryColor};display:flex;align-items:center;justify-content:center;border:none;color:white;flex-shrink:0;">
              ${Icon('user',{size:15})}
            </button>
          </div>

          <!-- Network picker dropdown -->
          ${showNetworkPicker ? `
          <div style="position:absolute;left:0;right:0;top:calc(100% + 4px);background:white;border-radius:0.875rem;box-shadow:0 8px 32px -4px rgba(0,0,0,0.18);z-index:20;overflow:hidden;">
            ${nets.map(n => `
            <button data-net="${n.id}" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.25rem;background:none;border:none;border-bottom:1px solid #f3f4f6;cursor:pointer;text-align:left;">
              <div style="display:flex;align-items:center;gap:0.875rem;">
                ${netSvg(n.id, 38)}
                <span style="font-size:0.9375rem;font-weight:600;color:#111827;">${n.name}</span>
              </div>
              ${selectedNetwork===n.id
                ? `<span style="width:26px;height:26px;border-radius:9999px;background:${primaryColor};display:flex;align-items:center;justify-content:center;">${Icon('check',{size:14,color:'white'})}</span>`
                : `<span style="width:26px;height:26px;border-radius:9999px;border:1.5px solid #d1d5db;"></span>`}
            </button>`).join('')}
          </div>` : ''}
        </div>

        <!-- "Simply Dial" ussd banner -->
        <div style="background:linear-gradient(90deg,#0f766e,#14b8a6);border-radius:0.875rem;padding:0.875rem 1.25rem;margin-bottom:0.875rem;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="color:rgba(255,255,255,0.75);font-size:0.75rem;margin:0 0 2px;">Low on Airtime?</p>
            <p style="color:white;font-weight:800;font-size:0.9375rem;margin:0;">Simply Dial <span style="color:#fde68a;">*955*3*amount#</span></p>
          </div>
          <span style="font-size:1.75rem;">⭐</span>
        </div>

        <!-- Top up grid -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:0.875rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.875rem;">Top up</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.625rem;margin-bottom:1rem;">
            ${amounts.map(item => `
            <button data-amount="${item.amount}" style="border:1.5px solid ${selectedAmount===item.amount?primaryColor:'#e5e7eb'};background:${selectedAmount===item.amount?primaryColor+'12':'#f9fafb'};border-radius:0.75rem;padding:0.75rem 0.375rem;text-align:center;cursor:pointer;">
              <p style="font-size:0.7rem;color:${primaryColor};font-weight:700;margin:0 0 4px;white-space:nowrap;">${item.cashbackLabel}</p>
              <p style="font-size:0.9375rem;font-weight:800;color:#111827;margin:0;">₦${item.amount}</p>
            </button>`).join('')}
          </div>

          <!-- Custom amount -->
          <div style="display:flex;align-items:center;gap:0.5rem;border-top:1px solid #f3f4f6;padding-top:0.875rem;">
            <span style="color:#9ca3af;font-weight:600;">₦</span>
            <div style="flex:1;position:relative;">
              <input id="custom-amount" type="text" inputmode="numeric"
                placeholder="50-500,000"
                value="${customAmount}"
                style="width:100%;border:none;border-bottom:1px solid #e5e7eb;outline:none;font-size:0.9375rem;padding:0.375rem 1.5rem 0.375rem 0;font-family:inherit;background:transparent;" />
              ${customAmount ? `<button id="clear-custom" style="position:absolute;right:0;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;padding:0;width:20px;height:20px;border-radius:9999px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">✕</button>` : ''}
            </div>
            <button id="pay-btn" style="background:${canPay?primaryColor:'#a7f3d0'};color:${canPay?'white':'#6b7280'};border:none;border-radius:9999px;padding:0.625rem 1.25rem;font-weight:700;font-size:0.9375rem;cursor:pointer;flex-shrink:0;white-space:nowrap;">
              ${canPay && customAmount ? `Pay ₦${Number(customAmount).toLocaleString()}` : 'Pay'}
            </button>
          </div>
        </div>

        <!-- More Events -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.875rem;">More Events</p>
          <div style="display:flex;align-items:flex-start;gap:0.875rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6;">
            <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.6rem;font-weight:800;color:#166534;text-align:center;line-height:1.3;">iLOT<br/>BET</div>
            <div>
              <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0 0 0.25rem;">Don't Just Watch the World Cup</p>
              <p style="font-size:0.8rem;color:#6b7280;margin:0;line-height:1.4;">Join the promo, stake on iLOTBet, and stand a chance to win a ₦150M house and massive cash prizes.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:0.875rem;padding-top:0.75rem;">
            <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.25rem;">🏷️</div>
            <div>
              <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0 0 0.25rem;">Super Voucher Package</p>
              <p style="font-size:0.8rem;color:#6b7280;margin:0;line-height:1.4;">Claim 15 Discounts with ₦99 on any Bill</p>
            </div>
          </div>
        </div>

      </div>
    </div>`;

    // ── Event binding ────────────────────────────────────────────────────────
    container.querySelector('#back-btn').addEventListener('click', () => navigate('/dashboard'));
    container.querySelector('#history-btn').addEventListener('click', () => navigate('/transaction-history'));

    container.querySelector('#network-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      showNetworkPicker = !showNetworkPicker;
      render();
    });

    if (showNetworkPicker) {
      container.querySelectorAll('[data-net]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedNetwork = btn.dataset.net;
          showNetworkPicker = false;
          render();
        });
      });
      document.addEventListener('click', function closeOnClickOut() {
        showNetworkPicker = false;
        render();
        document.removeEventListener('click', closeOnClickOut);
      }, { once: true });
    }

    const phoneInput = container.querySelector('#phone-input');
    phoneInput.addEventListener('input', () => { phoneNumber = phoneInput.value; });

    container.querySelectorAll('[data-amount]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAmount = btn.dataset.amount;
        customAmount = '';
        render();
      });
    });

    const custInput = container.querySelector('#custom-amount');
    custInput.addEventListener('input', () => {
      customAmount = custInput.value.replace(/[^\d]/g, '');
      selectedAmount = '';
      render();
    });
    attachAmountKeypad(custInput, { decimal: false });

    const clearBtn = container.querySelector('#clear-custom');
    if (clearBtn) clearBtn.addEventListener('click', () => { customAmount = ''; selectedAmount = ''; render(); });

    // Ad carousel
    const adInner = container.querySelector('#ad-inner');
    if (adInner) {
      const dots = container.querySelectorAll('.ad-dot');
      const { adBanners: banners } = Stores.customization.get();
      if (banners && banners.length > 1) {
        let cur = 0;
        setInterval(() => {
          cur = (cur + 1) % banners.length;
          adInner.style.transform = `translateX(-${cur * 100}%)`;
          dots.forEach((d, i) => d.style.background = i === cur ? primaryColor : '#d1d5db');
        }, 3500);
      }
    }

    container.querySelector('#pay-btn').addEventListener('click', () => {
      if (!canPay) return;
      const rawAmt = (selectedAmount || customAmount).replace(/,/g, '');
      const amtNum = parseFloat(rawAmt);
      const { balance } = Stores.balance.get();
      if (amtNum > balance) { toast.error('Insufficient balance'); return; }
      const cashItem = amounts.find(a => a.amount.replace(/,/g,'') === rawAmt);
      const cashbackEarned = cashItem ? cashItem.cashbackVal : +(amtNum * 0.01).toFixed(2);
      const netName = (window.NETWORKS && window.NETWORKS.find(n => n.id === selectedNetwork)?.name) || 'Airtime';
      const { totalCashback } = Stores.cashback.get();

      showConfirmationModal({
        amount: amtNum,
        productName: netName + ' Airtime',
        productIcon: selectedNetwork,
        recipientMobile: phoneNumber,
        cashbackAmount: cashbackEarned,
        useCashback: false,
        availableCashback: totalCashback,
        balance: balance,
        onConfirm: (usedCashback) => {
          const cashbackDeduct = usedCashback ? Math.min(totalCashback, amtNum) : 0;
          const toPay = amtNum - cashbackDeduct;
          showPinModal({
            amount: amtNum.toLocaleString(),
            recipientLabel: phoneNumber,
            onConfirm: () => {
              Stores.balance.set({ balance: balance - toPay });
              if (cashbackDeduct > 0) Stores.cashback.useCashback(cashbackDeduct);
              Stores.cashback.addCashback(cashbackEarned);
              const now = new Date();
              const fd = `${now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} ${now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}`;
              const txId = '25'+Math.floor(Math.random()*1e18).toString().padStart(20,'0');
              Stores.transaction.addTransaction({ type: 'Airtime Purchase', amount: `-₦${amtNum.toLocaleString()}`, status: 'Successful', icon: 'phone' });
              showTransactionReceipt({
                amount: `₦${amtNum.toLocaleString()}`, success: true, date: fd,
                details: [
                  { label: 'Recipient Mobile', value: phoneNumber },
                  { label: 'Network', value: netName },
                  { label: 'Transaction No.', value: txId },
                  { label: 'Cashback Earned', value: `+₦${cashbackEarned.toFixed(2)}` },
                ],
                title: netName,
                footerText: 'Enjoy a better life with OPay.',
                onClose: () => { selectedAmount = ''; customAmount = ''; render(); },
              });
            },
          });
        },
        onCancel: () => {},
      });
    });
  }

  render();
}

window.renderAirtimePage = renderAirtimePage;
