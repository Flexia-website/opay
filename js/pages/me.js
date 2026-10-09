// Format balance display
function formatBalanceMe(balance) {
  if (typeof balance !== 'number') balance = parseFloat(balance) || 0;
  const isDecimal = balance % 1 !== 0;
  if (isDecimal) return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return Math.floor(balance).toLocaleString();
}

function renderMePage(container, routeState) {
  let isLocked = true;
  let showBalance = false;
  let showBalanceAdjuster = (routeState && routeState.openBalanceAdjuster) || false;

  const ADMIN_PASSCODE = '0000';

  // ── LOCKED STATE (PIN gate) ───────────────────────────────────────────────
  function lockedHtml() {
    return `
    <div style="min-height:100vh;background:#f9fafb;display:flex;align-items:center;justify-content:center;">
      <div class="card" style="padding:2rem;width:100%;max-width:24rem;margin:0 1rem;">
        <h2 style="font-size:1.25rem;font-weight:600;text-align:center;margin:0 0 1.5rem;">Enter Passcode</h2>
        <input id="passcode-input" type="password" placeholder="Enter 4-digit passcode" maxlength="4" class="input" style="margin-bottom:1rem;" />
        <button id="unlock-btn" class="btn" style="width:100%;background:#059669;color:white;" disabled>Unlock</button>
      </div>
    </div>`;
  }

  function bindLocked() {
    const input = container.querySelector('#passcode-input');
    const btn = container.querySelector('#unlock-btn');
    input.addEventListener('input', () => { btn.disabled = input.value.length !== 4; });
    function submit() {
      if (input.value === ADMIN_PASSCODE) {
        isLocked = false;
        toast.success('Access granted');
        renderUnlocked();
      } else {
        toast.error('Invalid passcode');
        input.value = '';
        btn.disabled = true;
      }
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && input.value.length === 4) submit(); });
  }

  // ── ROW HELPER ────────────────────────────────────────────────────────────
  function Row({ icon, label, desc, badge, danger, id, adminOnly }) {
    if (adminOnly && !AuthState.isAdmin) return '';
    return `
    <button data-row="${id}" style="width:100%;display:flex;align-items:center;gap:1rem;padding:1rem;border-bottom:1px solid #f3f4f6;background:none;border-left:none;border-right:none;border-top:none;text-align:left;">
      <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;background:${danger ? '#fef2f2' : adminOnly ? '#eff6ff' : '#d1fae5'};color:${danger ? '#ef4444' : adminOnly ? '#2563eb' : '#059669'};">
        ${Icon(icon, { size: 20 })}
      </div>
      <div style="flex:1;text-align:left;">
        <div style="font-weight:500;color:${danger ? '#ef4444' : '#111827'};">${label}${adminOnly ? ' <span style="font-size:0.65rem;background:#dbeafe;color:#1d4ed8;padding:1px 6px;border-radius:9999px;font-weight:600;">Admin</span>' : ''}</div>
        ${desc ? `<div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">${desc}</div>` : ''}
      </div>
      ${badge ? `<span style="background:#f87171;color:white;font-size:10px;padding:2px 8px;border-radius:9999px;">${badge}</span>` : ''}
      ${Icon('chevron-right', { size: 16 })}
    </button>`;
  }

  // ── ADMIN-ONLY ITEMS ──────────────────────────────────────────────────────
  const adminItems = [
    { id: 'manage-users', icon: 'users', label: 'Manage Users', desc: 'View, add, edit accounts', adminOnly: true },
    { id: 'adjustbalance', icon: 'wallet', label: 'Adjust Balance', desc: 'Add or remove funds', adminOnly: true },
    { id: 'appearance', icon: 'palette', label: 'Appearance', desc: 'Customize the app', adminOnly: true },
  ];

  // ── COMMON ITEMS ──────────────────────────────────────────────────────────
  const primaryItems = [
    { id: 'txhistory', icon: 'file-text', label: 'Transaction History' },
    { id: 'limits', icon: 'gauge', label: 'Account Limits', desc: 'View your transaction limits' },
    { id: 'cards', icon: 'credit-card', label: 'Bank Card/Account', desc: 'Add payment option' },
    { id: 'bizpayment', icon: 'store', label: 'My BizPayment', desc: 'Receive payment for business' },
    { id: 'ojunior', icon: 'users', label: 'OJunior', desc: 'Create an account for your child/ward', badge: 'New' },
  ];

  const secondaryItems = [
    { id: 'security', icon: 'shield-check', label: 'Security Center', desc: 'Protect your funds' },
    { id: 'support', icon: 'headphones', label: 'Customer Service Center' },
    { id: 'invitation', icon: 'party-popper', label: 'Invitation' },
    { id: 'addmoney', icon: 'plus-circle', label: 'Add Money', desc: 'Fund your account' },
    { id: 'signout', icon: 'log-out', label: 'Sign Out', danger: true },
  ];

  function unlockedHtml() {
    const { profilePhoto } = Stores.customization.get();
    const balance = AuthState.isAdmin
      ? Stores.balance.get().balance
      : AuthState.balance;
    const displayName = AuthState.isAdmin
      ? 'CLINTON'
      : (AuthState.fullName || AuthState.username || 'User').toUpperCase();

    return `
    <div class="pb-nav-safe" style="min-height:100vh;background:#f9fafb;">
      <!-- Header / balance card -->
      <div style="background:#e8f5ec;padding:1.5rem 1.25rem;position:relative;overflow:hidden;">
        <div class="flex items-start justify-between" style="margin-bottom:0.75rem;">
          <div class="flex items-center" style="gap:0.75rem;">
            <div style="width:3.5rem;height:3.5rem;border-radius:9999px;background:${profilePhoto ? 'transparent' : '#111827'};display:flex;align-items:center;justify-content:center;">
              ${profilePhoto ? `<img src="${profilePhoto}" style="width:100%;height:100%;object-fit:contain;" />` : `<span style="color:white;">${Icon('user', { size: 20 })}</span>`}
            </div>
            <div>
              <h2 style="font-size:1.25rem;font-weight:700;color:#111827;margin:0;">Hi, ${displayName}</h2>
              <span style="display:inline-flex;align-items:center;gap:4px;margin-top:4px;background:${AuthState.isAdmin ? '#fce7f3' : '#fef3c7'};color:${AuthState.isAdmin ? '#be185d' : '#b45309'};font-size:0.75rem;padding:2px 8px;border-radius:9999px;">
                ${AuthState.isAdmin ? '🔑 Admin' : 'Tier 1'}
              </span>
            </div>
          </div>
          <span style="color:#374151;">${Icon('hexagon', { size: 28 })}</span>
        </div>
        <div style="margin-top:1rem;">
          <button id="toggle-balance-me" style="display:flex;align-items:center;gap:0.5rem;color:#374151;font-size:0.875rem;background:none;border:none;">
            Total Balance ${Icon(showBalance ? 'eye' : 'eye-off', { size: 16 })}
          </button>
          <div style="font-size:1.875rem;font-weight:700;color:#111827;letter-spacing:0.05em;margin-top:4px;">
            ${showBalance ? '₦' + formatBalanceMe(balance) : '****'}
          </div>
          ${!AuthState.isAdmin && AuthState.accountNumber ? `
          <div style="margin-top:0.5rem;font-size:0.8rem;color:#374151;">Account: <strong>${AuthState.accountNumber}</strong></div>` : ''}
        </div>
      </div>

      <!-- Admin tools section (admin only) -->
      ${AuthState.isAdmin ? `
      <div style="margin:1rem 1rem 0;">
        <div style="font-size:0.75rem;font-weight:700;color:#6b7280;letter-spacing:0.1em;margin-bottom:0.5rem;padding-left:0.25rem;">ADMIN TOOLS</div>
        <div style="background:white;border-radius:1rem;overflow:hidden;border:1.5px solid #dbeafe;">
          ${adminItems.map(Row).join('')}
        </div>
      </div>` : ''}

      <div id="ba-wrap" style="margin:1rem 1rem 0;">${showBalanceAdjuster ? BalanceAdjusterHtml() : ''}</div>

      <div style="margin:1rem 1rem 0;background:white;border-radius:1rem;overflow:hidden;">
        ${primaryItems.map(Row).join('')}
      </div>
      <div style="margin:1rem 1rem 0;background:white;border-radius:1rem;overflow:hidden;">
        ${secondaryItems.map(Row).join('')}
      </div>
      ${BottomNav('me')}
    </div>`;
  }

  function bindUnlocked() {
    bindBottomNav(container);
    const toggleBtn = container.querySelector('#toggle-balance-me');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => { showBalance = !showBalance; renderUnlocked(); });
    }
    container.querySelectorAll('[data-row]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.row;
        switch (id) {
          case 'txhistory': navigate('/transaction-history'); break;
          case 'cards': navigate('/cards'); break;
          case 'invitation': navigate('/invitation'); break;
          case 'manage-users':
            if (AuthState.isAdmin) navigate('/admin/users');
            break;
          case 'adjustbalance':
            if (AuthState.isAdmin) { showBalanceAdjuster = !showBalanceAdjuster; renderUnlocked(); }
            break;
          case 'addmoney': showAddMoneyModal(); break;
          case 'appearance':
            if (AuthState.isAdmin) navigate('/customization');
            break;
          case 'signout':
            Auth.logout();
            break;
          default: toast('Coming soon');
        }
      });
    });
    if (showBalanceAdjuster && AuthState.isAdmin) {
      const baWrap = container.querySelector('#ba-wrap');
      if (baWrap && typeof bindBalanceAdjuster === 'function') {
        bindBalanceAdjuster(baWrap, () => { showBalanceAdjuster = false; renderUnlocked(); });
      }
    }
  }

  function renderUnlocked() {
    container.innerHTML = unlockedHtml();
    bindUnlocked();
  }

  // Normal users skip the passcode gate
  if (!AuthState.isAdmin) {
    isLocked = false;
    renderUnlocked();
  } else {
    if (isLocked) {
      container.innerHTML = lockedHtml();
      bindLocked();
    } else {
      renderUnlocked();
    }
  }
}

window.renderMePage = renderMePage;
