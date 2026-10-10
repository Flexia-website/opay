function renderTvPage(container) {
  let activeTab = 'hot';
  let smartcardNumber = '';
  let selectedPlan = null;

  const dstvPlans = {
    hot: [
      { id: 'renewal', name: 'DStv Renewal', price: null, period: null, isCustom: true, placeholder: 'Enter amount' },
      { id: 'yanga', name: 'DStv Yanga', price: '₦6,000', period: '1 Month' },
      { id: 'compact', name: 'DStv Compact', price: '₦19,000', period: '1 Month' },
      { id: 'stream', name: 'DStv Stream Premium', price: '₦44,500', period: '1 Month' },
    ],
    premium: [
      { id: 'padi', name: 'DStv Padi', price: '₦4,400', period: '1 Month' },
      { id: 'confam', name: 'DStv Confam', price: '₦11,000', period: '1 Month' },
      { id: 'compact_plus', name: 'DStv Compact Plus', price: '₦30,000', period: '1 Month' },
    ],
  };

  function render() {
    const { primaryColor } = Stores.customization.get();
    const plans = dstvPlans[activeTab];

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:2rem;">
      <!-- Header -->
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;border-bottom:1px solid #f3f4f6;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">TV</h1>
        </div>
        <button id="history-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">History</button>
      </div>

      <div style="padding:1rem;">

        <!-- DStv card -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:0;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:0.875rem;">
              <div style="width:3.25rem;height:3.25rem;border-radius:9999px;background:#1e3a8a;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                <svg width="38" height="20" viewBox="0 0 38 20" fill="none"><text x="1" y="16" font-size="13" font-weight="900" fill="white" font-family="Arial">DStv</text></svg>
              </div>
              <span style="font-size:1.0625rem;font-weight:700;color:#111827;">DStv</span>
            </div>
            ${Icon('chevron-right',{size:18,color:'#9ca3af'})}
          </div>
          <p style="font-size:0.875rem;color:${primaryColor};margin:0.75rem 0 0;line-height:1.5;font-weight:500;">Share the joy this season with DStv - your home of drama series and football!</p>
        </div>

        <!-- Smartcard input -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;margin-top:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
            <span style="font-size:0.9375rem;font-weight:600;color:#374151;">Smartcard Number</span>
            <div style="display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
              <span style="font-size:0.875rem;color:#6b7280;">Beneficiaries</span>
              ${Icon('chevron-right',{size:16,color:'#9ca3af'})}
            </div>
          </div>
          <input id="smartcard-input" type="text" inputmode="numeric" pattern="[0-9]*"
            placeholder="Enter Your Smartcard Number"
            value="${smartcardNumber}"
            style="width:100%;padding:0.875rem 0;border:none;border-bottom:1px solid #e5e7eb;outline:none;font-size:0.9375rem;font-family:inherit;color:#111827;box-sizing:border-box;background:transparent;" />
        </div>

        <!-- Hot offers / Premium tabs + plans -->
        <div style="background:white;border-radius:0.875rem;margin-top:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
          <!-- Tabs -->
          <div style="display:flex;border-bottom:1px solid #f3f4f6;padding:0 1rem;">
            <button id="tab-hot" style="padding:1rem 0;margin-right:1.5rem;background:none;border:none;border-bottom:2.5px solid ${activeTab==='hot'?primaryColor:'transparent'};color:${activeTab==='hot'?'#111827':'#6b7280'};font-weight:${activeTab==='hot'?'800':'600'};font-size:0.9375rem;cursor:pointer;">Hot offers</button>
            <button id="tab-premium" style="padding:1rem 0;background:none;border:none;border-bottom:2.5px solid ${activeTab==='premium'?primaryColor:'transparent'};color:${activeTab==='premium'?'#111827':'#6b7280'};font-weight:${activeTab==='premium'?'800':'600'};font-size:0.9375rem;cursor:pointer;">Premium</button>
          </div>

          <!-- Plans grid -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;padding:1rem;">
            ${plans.map(plan => `
            <button data-plan="${plan.id}" style="text-align:left;background:${selectedPlan===plan.id?'#f0fdf4':'white'};border:1.5px solid ${selectedPlan===plan.id?primaryColor:'#e5e7eb'};border-radius:0.75rem;padding:1rem;cursor:pointer;">
              <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.5rem;">${plan.name}</p>
              ${plan.period ? `<span style="display:inline-block;background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:0.25rem;font-size:0.75rem;font-weight:600;">${plan.period}</span>` : ''}
              ${plan.isCustom
                ? `<input type="text" inputmode="numeric" placeholder="${plan.placeholder}" onclick="event.stopPropagation();" style="width:100%;margin-top:0.625rem;border:none;border-bottom:1px solid #e5e7eb;outline:none;font-size:0.875rem;padding:0.25rem 0;font-family:inherit;background:transparent;" />`
                : (plan.price ? `<p style="font-size:1.0625rem;font-weight:800;color:#111827;margin:0.625rem 0 0;">${plan.price}</p>` : '')
              }
            </button>`).join('')}
          </div>
        </div>

      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/dashboard'));
    container.querySelector('#history-btn').addEventListener('click', () => navigate('/transaction-history'));
    container.querySelector('#tab-hot').addEventListener('click', () => { activeTab = 'hot'; render(); });
    container.querySelector('#tab-premium').addEventListener('click', () => { activeTab = 'premium'; render(); });
    container.querySelector('#smartcard-input').addEventListener('input', (e) => { smartcardNumber = e.target.value; });

    container.querySelectorAll('[data-plan]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPlan = btn.dataset.plan;
        render();
      });
    });
  }

  render();
}

window.renderTvPage = renderTvPage;
