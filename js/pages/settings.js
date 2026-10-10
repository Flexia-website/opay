function renderSettingsPage(container) {
  function render() {
    const { primaryColor } = Stores.customization.get();

    function row(id, icon, label, right, isNew) {
      return `
      <button data-row="${id}" style="width:100%;display:flex;align-items:center;gap:0.875rem;padding:0.9375rem 1.25rem;background:none;border:none;border-bottom:1px solid #f3f4f6;cursor:pointer;text-align:left;">
        <div style="width:2.25rem;height:2.25rem;border-radius:0.5rem;background:#e8f5ec;display:flex;align-items:center;justify-content:center;color:${primaryColor};">${Icon(icon,{size:18})}</div>
        <span style="flex:1;font-size:0.9375rem;font-weight:600;color:#111827;">${label}</span>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          ${right ? `<span style="font-size:0.875rem;color:#f97316;font-weight:600;">${right}</span>` : ''}
          ${isNew ? `<span style="background:#ef4444;color:white;font-size:0.65rem;font-weight:800;padding:2px 7px;border-radius:9999px;">New</span>` : ''}
          <span style="width:6px;height:6px;border-radius:9999px;background:${id==='homepage-settings'||id==='themes'?'#ef4444':'transparent'};"></span>
          ${Icon('chevron-right',{size:16,color:'#9ca3af'})}
        </div>
      </button>`;
    }

    container.innerHTML = `
    <div style="min-height:100vh;background:#f5f6f8;padding-bottom:2rem;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Settings</h1>
      </div>

      <!-- Group 1 -->
      <div style="background:white;margin:0.875rem 0 0;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('my-profile','user','My Profile')}
        ${row('payment-settings','lock','Payment Settings')}
        ${row('login-settings','key','Login Settings')}
        ${row('savings-settings','hard-drive','Savings Settings')}
      </div>

      <!-- Group 2 -->
      <div style="background:white;margin:0.875rem 0 0;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('homepage-settings','home','Homepage Settings')}
        ${row('security-questions','help-circle','Security Questions','Not Set')}
        ${row('sms-alerts','message-square','SMS Alert Settings')}
        ${row('clipboard','clipboard','Access to Clipboard')}
        ${row('themes','settings','Themes')}
      </div>

      <!-- Group 3 -->
      <div style="background:white;margin:0.875rem 0 0;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('security-center','shield-check','Security Center')}
        ${row('feedback','edit','Feedback and Suggestions')}
      </div>

      <!-- Group 4 -->
      <div style="background:white;margin:0.875rem 0 0;border-top:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
        ${row('close-account','power','Close Account')}
        ${row('about','info','About','8.17.2.494',true)}
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/me'));
    container.querySelectorAll('[data-row]').forEach(btn => {
      btn.addEventListener('click', () => {
        switch(btn.dataset.row) {
          case 'my-profile': navigate('/my-profile'); break;
          case 'themes': navigate('/customization'); break;
          default: toast('Coming soon');
        }
      });
    });
  }
  render();
}
window.renderSettingsPage = renderSettingsPage;
