function renderMyProfilePage(container) {
  let saving = false;

  function render() {
    const { primaryColor } = Stores.customization.get();
    const profilePhoto = AuthState.profilePhoto || Stores.customization.get().profilePhoto || '';
    const tier = AuthState.tier || 1;
    const acctNo = AuthState.accountNumber || '';

    container.innerHTML = `
    <div style="min-height:100vh;background:#f5f6f8;padding-bottom:2rem;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">My Profile</h1>
      </div>

      <!-- Email promo banner -->
      <div style="background:white;padding:0.875rem 1.25rem;display:flex;align-items:center;gap:0.875rem;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:1.5rem;">📧</span>
        <div>
          <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0;">Take Control, Stay Informed</p>
          <p style="font-size:0.8rem;color:#6b7280;margin:0.125rem 0 0;">Add your email to get the latest from OPay</p>
        </div>
      </div>

      <!-- Avatar -->
      <div style="background:white;padding:1.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;border-bottom:8px solid #f5f6f8;">
        <label style="position:relative;cursor:pointer;">
          <div style="width:80px;height:80px;border-radius:9999px;background:${profilePhoto?'transparent':'#111827'};overflow:hidden;display:flex;align-items:center;justify-content:center;">
            ${profilePhoto ? `<img id="profile-img" src="${profilePhoto}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="color:white;">${Icon('user',{size:32})}</span>`}
          </div>
          <div style="position:absolute;bottom:0;left:0;right:0;height:32px;background:rgba(0,0,0,0.4);border-radius:0 0 9999px 9999px;display:flex;align-items:center;justify-content:center;">
            ${Icon('camera',{size:16,color:'white'})}
          </div>
          <input id="photo-upload" type="file" accept="image/*" style="display:none;" />
        </label>
        <h2 style="font-size:1rem;font-weight:800;color:#111827;margin:0.875rem 0 0;letter-spacing:0.05em;">${(AuthState.fullName||AuthState.username||'').toUpperCase().split(' ')[0]}</h2>
      </div>

      <!-- Account info section -->
      <div style="background:white;margin-top:0.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9375rem 1.25rem;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:0.9375rem;color:#374151;">OPay Account Number</span>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span style="font-size:0.9375rem;font-weight:600;color:#111827;">${acctNo}</span>
            <button id="copy-acct" style="background:none;border:none;cursor:pointer;color:#6b7280;padding:0;">${Icon('copy',{size:16})}</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9375rem 1.25rem;">
          <span style="font-size:0.9375rem;color:#374151;">Account Tier</span>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span>${TierBadge(tier, 20)}</span>
            <span style="font-size:0.875rem;font-weight:700;color:#374151;">Tier ${tier}</span>
            <button id="upgrade-btn" style="background:#fce7f3;color:#be185d;border:none;border-radius:9999px;padding:3px 10px;font-size:0.75rem;font-weight:700;cursor:pointer;">Upgrade &gt;</button>
          </div>
        </div>
      </div>

      <!-- Profile fields -->
      <div style="background:white;margin-top:0.5rem;">
        ${profileField('full_name','Full Name', (AuthState.fullName||'').toUpperCase(), false)}
        ${profileField('phone','Mobile Number', '+234'+(AuthState.accountNumber||''), true)}
        ${profileField('nickname','Nickname', AuthState.nickname||'', false, 'Enter Nickname')}
        ${profileField('gender','Gender', AuthState.gender||'Male', false)}
        ${profileField('dob','Date of Birth', AuthState.dob||'', false, '**-**-02')}
        ${profileField('email','Email', '', false, 'Enter email')}
        ${profileField('address','Address', AuthState.address||'', false)}
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/me'));

    container.querySelector('#copy-acct').addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(acctNo);
      toast.success('Copied!');
    });

    container.querySelector('#upgrade-btn').addEventListener('click', async () => {
      if (AuthState.tier >= 3) { toast('Already at highest tier'); return; }
      const res = await fetch('/api/user/tier/request', { method:'POST', credentials:'include' });
      const data = await res.json();
      if (data.ok) { AuthState.tierUpgradeRequested = true; toast.success('Upgrade request sent!'); }
      else toast.error(data.error);
    });

    const photoUpload = container.querySelector('#photo-upload');
    photoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'profile');
      const res = await fetch('/api/upload', { method:'POST', credentials:'include', body: fd });
      const data = await res.json();
      if (data.ok && data.url) {
        AuthState.profilePhoto = data.url;
        Stores.customization.set({ ...Stores.customization.get(), profilePhoto: data.url });
        toast.success('Profile photo updated');
        render();
      } else {
        toast.error(data.error || 'Upload failed');
      }
    });

    container.querySelectorAll('[data-field]').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        if (field === 'phone') { toast('Phone number cannot be changed here'); return; }
        showFieldEditor(field);
      });
    });
  }

  function profileField(id, label, value, readonly, placeholder) {
    const { primaryColor } = Stores.customization.get();
    return `
    <button data-field="${id}" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:0.9375rem 1.25rem;background:none;border:none;border-bottom:1px solid #f3f4f6;text-align:left;cursor:${readonly?'default':'pointer'};">
      <span style="font-size:0.9375rem;color:#374151;">${label}</span>
      <div style="display:flex;align-items:center;gap:0.375rem;">
        <span style="font-size:0.9375rem;color:${value?'#111827':'#9ca3af'};">${value || placeholder || ''}</span>
        ${!readonly ? Icon('chevron-right',{size:16,color:'#9ca3af'}) : ''}
      </div>
    </button>`;
  }

  function showFieldEditor(field) {
    const { primaryColor } = Stores.customization.get();
    const labels = { full_name:'Full Name', nickname:'Nickname', gender:'Gender', dob:'Date of Birth', email:'Email', address:'Address' };
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;';
    overlay.innerHTML = `
    <div id="field-sheet" style="background:white;border-radius:1.25rem 1.25rem 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:420px;transform:translateY(100%);transition:transform 0.28s cubic-bezier(.22,.8,.28,1);">
      <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;">${labels[field]||field}</h3>
      ${field === 'gender'
        ? `<div style="display:flex;gap:0.75rem;margin-bottom:1.25rem;">
            <button class="gender-opt" data-val="Male" style="flex:1;padding:0.75rem;border:1.5px solid ${AuthState.gender==='Male'?primaryColor:'#e5e7eb'};border-radius:0.75rem;background:${AuthState.gender==='Male'?primaryColor+'12':'white'};font-weight:600;cursor:pointer;">Male</button>
            <button class="gender-opt" data-val="Female" style="flex:1;padding:0.75rem;border:1.5px solid ${AuthState.gender==='Female'?primaryColor:'#e5e7eb'};border-radius:0.75rem;background:${AuthState.gender==='Female'?primaryColor+'12':'white'};font-weight:600;cursor:pointer;">Female</button>
           </div>`
        : `<input id="field-input" type="${field==='email'?'email':field==='dob'?'date':'text'}"
            value="${AuthState[field===('full_name')?'fullName':field]||''}"
            placeholder="${labels[field]}"
            style="width:100%;border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.875rem 1rem;font-size:0.9375rem;outline:none;box-sizing:border-box;font-family:inherit;margin-bottom:1.25rem;" />`}
      <button id="save-field" style="width:100%;background:${primaryColor};color:white;border:none;border-radius:9999px;padding:0.875rem;font-weight:700;font-size:1rem;cursor:pointer;">Save</button>
    </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.querySelector('#field-sheet').style.transform = 'translateY(0)'; });
    const close = () => { overlay.querySelector('#field-sheet').style.transform='translateY(100%)'; setTimeout(()=>overlay.remove(),280); };
    overlay.addEventListener('click', (e) => { if(e.target===overlay) close(); });

    overlay.querySelectorAll('.gender-opt').forEach(btn => {
      btn.addEventListener('click', async () => {
        const val = btn.dataset.val;
        await saveField('gender', val);
        close(); render();
      });
    });

    const saveBtn = overlay.querySelector('#save-field');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const input = overlay.querySelector('#field-input');
        if (!input) return;
        const val = input.value.trim();
        await saveField(field, val);
        close(); render();
      });
    }
  }

  async function saveField(field, value) {
    const map = { full_name:'fullName', nickname:'nickname', gender:'gender', dob:'dob', email:'email', address:'address' };
    const body = { [field]: value };
    const res = await fetch('/api/user/profile', { method:'PATCH', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(body) });
    const data = await res.json();
    if (data.ok) {
      if (map[field]) AuthState[map[field]] = value;
      toast.success('Saved');
    } else {
      toast.error(data.error || 'Save failed');
    }
  }

  render();
}

window.renderMyProfilePage = renderMyProfilePage;
