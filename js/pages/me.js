function formatBalanceMe(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderMePage(container, routeState) {
  let showBalance = false;
  let showBalanceAdjuster = (routeState && routeState.openBalanceAdjuster) || false;

  function render() {
    const cust = Stores.customization.get();
    const { primaryColor, meShieldImage } = cust;
    // meIconImages keys stored as meIconImages_<id> in customization
    const meIconImages = {};
    Object.keys(cust).forEach(k => { if (k.startsWith('meIconImages_')) meIconImages[k.replace('meIconImages_','')] = cust[k]; });
    const profilePhoto = AuthState.profilePhoto || Stores.customization.get().profilePhoto || '';
    const balance = AuthState.isAdmin ? Stores.balance.get().balance : (AuthState.balance || 0);
    const displayName = AuthState.isAdmin ? 'CLINTON' : (AuthState.fullName || AuthState.username || 'User').toUpperCase().split(' ')[0];
    const tier = AuthState.isAdmin ? null : (AuthState.tier || 1);
    const upgradeRequested = AuthState.tierUpgradeRequested || false;

    // Row builder
    function row(id, iconKey, label, desc, badge) {
      const iconImg = meIconImages && meIconImages[id];
      const iconHtml = iconImg
        ? `<img src="${iconImg}" style="width:2.25rem;height:2.25rem;object-fit:contain;" />`
        : `<div style="width:2.25rem;height:2.25rem;border-radius:0.5rem;background:#e8f5ec;display:flex;align-items:center;justify-content:center;color:${primaryColor};">${Icon(iconKey,{size:18})}</div>`;
      return `
      <button data-row="${id}" style="width:100%;display:flex;align-items:center;gap:0.875rem;padding:0.9375rem 1.25rem;background:none;border:none;border-bottom:1px solid #f3f4f6;text-align:left;cursor:pointer;">
        ${iconHtml}
        <div style="flex:1;">
          <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">${label}</p>
          ${desc ? `<p style="font-size:0.8rem;color:#6b7280;margin:0.125rem 0 0;">${desc}</p>` : ''}
        </div>
        ${badge ? `<span style="background:#ef4444;color:white;font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:9999px;">${badge}</span>` : ''}
        ${Icon('chevron-right',{size:16,color:'#9ca3af'})}
      </button>`;
    }

    container.innerHTML = `
    <div style="min-height:100vh;background:#f5f6f8;padding-bottom:5rem;">

      <!-- Header card (green gradient) -->
      <div style="background:linear-gradient(160deg,#e8f5ec 0%,#d1fae5 100%);padding:1.5rem 1.25rem 1.25rem;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.875rem;">
            <!-- Profile photo with tier badge -->
            <button id="open-profile-btn" style="position:relative;background:none;border:none;padding:0;cursor:pointer;flex-shrink:0;">
              <div style="width:3.5rem;height:3.5rem;border-radius:9999px;background:${profilePhoto?'transparent':'#111827'};overflow:hidden;display:flex;align-items:center;justify-content:center;">
                ${profilePhoto
                  ? `<img src="${profilePhoto}" style="width:100%;height:100%;object-fit:cover;" />`
                  : `<span style="color:white;">${Icon('user',{size:22})}</span>`}
              </div>
              ${tier ? `<span style="position:absolute;bottom:-4px;right:-4px;">${TierBadge(tier, 22)}</span>` : ''}
            </button>
            <div>
              <h2 style="font-size:1.25rem;font-weight:800;color:#111827;margin:0;">Hi, ${displayName}</h2>
              ${tier && !upgradeRequested ? `
              <button id="upgrade-tier-btn" style="display:inline-flex;align-items:center;gap:4px;margin-top:3px;background:none;border:none;padding:0;cursor:pointer;">
                <span>${TierBadge(tier, 14)}</span>
                <span style="font-size:0.75rem;color:#d97706;font-weight:700;">Upgrade to Tier ${Math.min(tier+1,3)}</span>
              </button>` : ''}
              ${upgradeRequested ? `<p style="font-size:0.75rem;color:${primaryColor};margin:3px 0 0;font-weight:600;">Upgrade Requested ✓</p>` : ''}
              ${AuthState.isAdmin ? `<span style="font-size:0.75rem;background:#fce7f3;color:#be185d;padding:2px 8px;border-radius:9999px;font-weight:700;">Admin</span>` : ''}
            </div>
          </div>
          <!-- Shield icon (admin-uploadable) -->
          <div style="width:3rem;height:3rem;position:relative;">
            ${meShieldImage
              ? `<img src="${meShieldImage}" style="width:100%;height:100%;object-fit:contain;" />`
              : `<div style="width:3rem;height:3rem;border-radius:9999px;background:rgba(255,255,255,0.6);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;color:${primaryColor};">${Icon('shield-check',{size:22})}</div>`}
            <span style="position:absolute;top:0;right:0;width:8px;height:8px;border-radius:9999px;background:#ef4444;border:2px solid white;"></span>
          </div>
        </div>

        <!-- Balance -->
        <div style="margin-top:0.5rem;">
          <button id="toggle-bal" style="display:flex;align-items:center;gap:0.375rem;background:none;border:none;color:#374151;font-size:0.8125rem;cursor:pointer;padding:0;">
            Total Balance ${Icon(showBalance?'eye':'eye-off',{size:14,color:'#9ca3af'})}
          </button>
          <p style="font-size:2rem;font-weight:800;color:#111827;margin:4px 0 0;letter-spacing:0.05em;">
            ${showBalance ? '₦'+formatBalanceMe(balance) : '****'}
          </p>
          <div style="display:inline-flex;align-items:center;gap:0.375rem;background:white;border-radius:9999px;padding:4px 10px;margin-top:6px;">
            <span style="font-size:0.75rem;color:#374151;">Interest Credited Today</span>
            <span style="font-size:0.75rem;color:#111827;font-weight:700;">${showBalance ? '₦0.00' : '****'}</span>
          </div>
        </div>

        <!-- Security check banner -->
        <div style="background:${primaryColor};border-radius:0.875rem;padding:0.875rem 1rem;margin-top:1rem;display:flex;align-items:center;gap:0.75rem;">
          <span style="color:white;">${Icon('shield',{size:18})}</span>
          <div style="flex:1;">
            <p style="font-size:0.875rem;font-weight:700;color:white;margin:0;">Security Check is not turned on</p>
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.8);margin:2px 0 0;">Make your account more secure with extra safety checks.</p>
          </div>
          <button style="background:white;color:${primaryColor};border:none;border-radius:9999px;padding:5px 12px;font-weight:700;font-size:0.8125rem;cursor:pointer;flex-shrink:0;">Turn On</button>
        </div>
      </div>

      <!-- Admin tools -->
      ${AuthState.isAdmin ? `
      <div style="margin:0.875rem 0 0;background:white;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('manage-users','users','Manage Users','View, add, edit accounts')}
        ${row('adjustbalance','wallet','Adjust Balance','Add or remove funds')}
        ${row('appearance','palette','Appearance','Customize the app')}
      </div>` : ''}
      ${AuthState.isAdmin ? `<div id="ba-wrap" style="margin:0;">${showBalanceAdjuster ? BalanceAdjusterHtml() : ''}</div>` : ''}

      <!-- Primary items -->
      <div style="margin:0.875rem 0 0;background:white;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('txhistory','file-text','Transaction History')}
        ${row('limits','gauge','Account Limits','View your transaction limits')}
        ${row('bankcard','credit-card','Bank Card/Account','Add payment option')}
        ${row('bizpayment','store','My BizPayment','Receive payment for business')}
        ${row('ojunior','users','OJunior','Create an account for your child/ward','New')}
      </div>

      <!-- Secondary items -->
      <div style="margin:0.875rem 0 0;background:white;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('security','shield-check','Security Center','Protect your funds')}
        ${row('support','headphones','Customer Service Center')}
        ${row('invitation','gift','Invitation','Invite friends and earn up to ₦5,600 Bonus')}
      </div>

      <!-- Settings + sign out -->
      <div style="margin:0.875rem 0 0;background:white;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('settings','settings','Settings')}
        ${row('signout','log-out','Sign Out')}
      </div>

      ${BottomNav('me')}
    </div>`;

    bindBottomNav(container);

    container.querySelector('#toggle-bal').addEventListener('click', () => { showBalance = !showBalance; render(); });
    container.querySelector('#open-profile-btn').addEventListener('click', () => navigate('/my-profile'));

    const upgradeBtn = container.querySelector('#upgrade-tier-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', async () => {
        const res = await fetch('/api/user/tier/request', { method:'POST', credentials:'include' });
        const data = await res.json();
        if (data.ok) { AuthState.tierUpgradeRequested = true; toast.success('Upgrade request sent!'); render(); }
        else toast.error(data.error);
      });
    }

    container.querySelectorAll('[data-row]').forEach(btn => {
      const id = btn.dataset.row;
      btn.addEventListener('click', () => {
        switch(id) {
          case 'txhistory': navigate('/transaction-history'); break;
          case 'limits': navigate('/account-limits'); break;
          case 'bankcard': navigate('/cards'); break;
          case 'security': toast('Coming soon'); break;
          case 'support': toast('Coming soon'); break;
          case 'invitation': navigate('/invitation'); break;
          case 'settings': navigate('/settings'); break;
          case 'manage-users': if (AuthState.isAdmin) navigate('/admin/users'); break;
          case 'adjustbalance': if (AuthState.isAdmin) { showBalanceAdjuster = !showBalanceAdjuster; render(); } break;
          case 'appearance': if (AuthState.isAdmin) navigate('/customization'); break;
          case 'signout': Auth.logout(); break;
          default: toast('Coming soon');
        }
      });
    });

    if (showBalanceAdjuster && AuthState.isAdmin) {
      const baWrap = container.querySelector('#ba-wrap');
      if (baWrap && typeof bindBalanceAdjuster === 'function') {
        bindBalanceAdjuster(baWrap, () => { showBalanceAdjuster = false; render(); });
      }
    }
  }

  render();
}

window.renderMePage = renderMePage;
