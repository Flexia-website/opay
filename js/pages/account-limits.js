function renderAccountLimitsPage(container) {
  function render() {
    const { primaryColor } = Stores.customization.get();
    const tier = AuthState.tier || 1;
    const acctNo = AuthState.accountNumber || '';
    const fmtAcct = acctNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    const fullName = (AuthState.fullName || AuthState.username || '').toUpperCase();

    const tiers = [
      { n: 1, daily: '₦50,000', max: '₦300,000' },
      { n: 2, daily: '₦200,000', max: '₦500,000' },
      { n: 3, daily: '₦5,000,000', max: 'Unlimited' },
    ];

    container.innerHTML = `
    <div style="min-height:100vh;background:#f5f6f8;padding-bottom:2rem;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Account Limits</h1>
      </div>

      <!-- Account Info card (peach) -->
      <div style="background:#fff5ef;border-radius:0.875rem;margin:1rem;padding:1.25rem;position:relative;overflow:hidden;">
        <p style="font-size:0.8rem;color:#9a6a50;margin:0 0 0.5rem;font-weight:600;">Account Info</p>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
          <span style="font-size:1.375rem;font-weight:800;color:#111827;letter-spacing:0.05em;">${fmtAcct || '--- --- ----'}</span>
          <button id="copy-acct" style="background:none;border:1px solid #d1d5db;border-radius:0.375rem;padding:2px 6px;cursor:pointer;color:#6b7280;">${Icon('copy',{size:14})}</button>
        </div>
        <div style="display:inline-block;background:#f3ede8;border-radius:0.375rem;padding:4px 10px;">
          <span style="font-size:0.8125rem;font-weight:700;color:#7a4500;font-family:monospace;letter-spacing:0.03em;">${fullName}</span>
        </div>
        <!-- Tier badge top-right -->
        <div style="position:absolute;top:1rem;right:1rem;">
          ${TierBadge(tier, 44)}
        </div>
      </div>

      <!-- Linked ID -->
      <div style="background:white;border-radius:0.875rem;margin:0 1rem 0.75rem;padding:0 1rem;">
        <button style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:1rem 0;background:none;border:none;cursor:pointer;">
          <span style="font-size:0.9375rem;font-weight:700;color:#111827;">Linked ID</span>
          <div style="display:flex;align-items:center;gap:0.375rem;">
            <span style="font-size:0.9375rem;font-weight:600;color:#374151;">NIN</span>
            ${Icon('chevron-right',{size:16,color:'#9ca3af'})}
          </div>
        </button>
      </div>

      <!-- Limit Info -->
      <div style="background:white;border-radius:0.875rem;margin:0 1rem 0.75rem;padding:1rem;">
        <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.75rem;">Limit Info</p>
        <div style="background:#f9fafb;border-radius:0.75rem;padding:0.875rem 1rem;">
          <p style="font-size:0.875rem;color:#9ca3af;margin:0;text-align:center;">The higher your account tier, the higher your transaction limit.</p>
        </div>
      </div>

      <!-- Level Benefit table -->
      <div style="background:white;border-radius:0.875rem;margin:0 1rem 1.5rem;padding:1rem;">
        <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.875rem;">Level Benefit</p>
        <div style="border:1px solid #e5e7eb;border-radius:0.75rem;overflow:hidden;">
          <!-- Header -->
          <div style="display:flex;padding:0.75rem 1rem;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
            <span style="flex:1.2;font-size:0.8125rem;font-weight:700;color:#374151;">Tier</span>
            <span style="flex:1.2;font-size:0.8125rem;font-weight:700;color:#374151;text-align:center;">Daily transaction limit</span>
            <span style="flex:1;font-size:0.8125rem;font-weight:700;color:#374151;text-align:right;">Maximum account balance</span>
          </div>
          ${tiers.map(t => `
          <div style="display:flex;align-items:center;padding:0.875rem 1rem;border-bottom:1px solid #f3f4f6;">
            <div style="flex:1.2;display:flex;align-items:center;gap:0.5rem;">
              <span style="font-size:0.9375rem;font-weight:700;color:#111827;">Tier ${t.n}</span>
              ${t.n === tier ? `<span style="background:#e8f5ec;color:${primaryColor};font-size:0.6875rem;font-weight:700;padding:2px 8px;border-radius:9999px;">Current</span>` : ''}
              ${t.n === tier + 1 ? `<span style="background:${primaryColor};color:white;font-size:0.6875rem;font-weight:700;padding:2px 8px;border-radius:9999px;">Up Next</span>` : ''}
            </div>
            <span style="flex:1.2;font-size:0.9375rem;font-weight:700;color:#111827;text-align:center;">${t.daily}</span>
            <span style="flex:1;font-size:0.9375rem;font-weight:700;color:#111827;text-align:right;">${t.max}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Upgrade button (if not tier 3) -->
      ${tier < 3 ? `
      <div style="padding:0 1rem;">
        <button id="upgrade-btn" style="width:100%;background:${primaryColor};color:white;border:none;border-radius:9999px;padding:1rem;font-weight:700;font-size:1rem;cursor:pointer;">
          Upgrade to Tier ${tier + 1}
        </button>
      </div>` : ''}
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/me'));
    const copyBtn = container.querySelector('#copy-acct');
    if (copyBtn) copyBtn.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(acctNo); toast.success('Copied!'); });
    const upBtn = container.querySelector('#upgrade-btn');
    if (upBtn) {
      upBtn.addEventListener('click', async () => {
        const res = await fetch('/api/user/tier/request', { method:'POST', credentials:'include' });
        const data = await res.json();
        if (data.ok) { AuthState.tierUpgradeRequested = true; toast.success('Upgrade request sent! Admin will review.'); upBtn.disabled = true; upBtn.textContent = 'Request Sent'; }
        else toast.error(data.error);
      });
    }
  }
  render();
}
window.renderAccountLimitsPage = renderAccountLimitsPage;
