// ── Transfer to OPay User (P2P) ───────────────────────────────────────────────
function renderToOpayPage(container) {
  let step = 'find';      // 'find' | 'amount' | 'confirm' | 'success'
  let recipient = null;
  let amount = 0;
  let note = '';

  function getBalance() {
    if (AuthState.isAdmin) return Stores.balance.get().balance;
    return AuthState.balance;
  }

  function fmt(n) {
    return '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ── STEP 1: Find recipient ────────────────────────────────────────────────
  function renderFind() {
    const { primaryColor, adBanners } = Stores.customization.get();
    const recents = (Stores.recentTransfers.get().opay || []);

    // Build ad carousel html
    function adCarouselHtml() {
      const banners = adBanners && adBanners.length > 0 ? adBanners : [];
      if (banners.length === 0) return '';
      return `
      <div style="margin:0 0 0;position:relative;overflow:hidden;border-radius:0.875rem;">
        <div id="ad-carousel-inner" style="display:flex;transition:transform 0.35s ease;will-change:transform;">
          ${banners.map(url => `
          <div style="min-width:100%;border-radius:0.875rem;overflow:hidden;">
            <img src="${url}" style="width:100%;height:auto;display:block;border-radius:0.875rem;" />
          </div>`).join('')}
        </div>
        ${banners.length > 1 ? `<div style="display:flex;justify-content:center;gap:5px;margin-top:0.5rem;">
          ${banners.map((_, i) => `<div class="ad-dot" data-idx="${i}" style="width:6px;height:6px;border-radius:9999px;background:${i === 0 ? primaryColor : '#d1d5db'};transition:background 0.2s;"></div>`).join('')}
        </div>` : ''}
      </div>`;
    }

    function recentItemHtml(r) {
      const initial = (r.full_name || r.username || '?')[0].toUpperCase();
      const bgColors = ['#00B875','#3b82f6','#8b5cf6','#ef4444','#f59e0b'];
      const bg = bgColors[initial.charCodeAt(0) % bgColors.length];
      return `
      <button data-recent-id="${r.id}" style="width:100%;display:flex;align-items:center;gap:0.75rem;padding:0.875rem 0;border:none;background:none;cursor:pointer;border-bottom:1px solid #f3f4f6;text-align:left;">
        <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:${bg};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;overflow:hidden;">
          ${r.profile_photo ? `<img src="${r.profile_photo}" style="width:100%;height:100%;object-fit:cover;" />` : initial}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;font-size:0.9375rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.full_name || r.username}</div>
          <div style="font-size:0.8125rem;color:#6b7280;margin-top:2px;">${r.phone || r.account_number || ''}</div>
        </div>
      </button>`;
    }

    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;border-bottom:1px solid #f3f4f6;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
          <h2 style="margin:0;font-size:1.05rem;font-weight:700;">Transfer to OPay Account</h2>
        </div>
        <button style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">History</button>
      </div>

      <div style="padding:1rem 1.25rem;">

        ${adBanners && adBanners.length > 0 ? `<div style="margin-bottom:1rem;">${adCarouselHtml()}</div>` : ''}

        <!-- Instant transfer badge -->
        <div style="background:#f0fdf4;border-radius:0.75rem;padding:0.875rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:0.625rem;">
          <div style="width:28px;height:28px;border-radius:9999px;background:${primaryColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('zap',{size:14,color:'white'})}
          </div>
          <span style="font-size:0.875rem;font-weight:600;color:#166534;">Instant, Zero Issues, Free</span>
        </div>

        <!-- Search field -->
        <div style="background:white;border-radius:0.875rem;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1rem;">
          <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.5rem;">Recipient Account</label>
          <div style="display:flex;gap:0.5rem;align-items:center;border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.625rem 0.75rem;">
            <input id="recipient-input" type="text"
              placeholder="Phone No./OPay Account No./Name"
              style="flex:1;border:none;outline:none;font-size:0.9375rem;font-family:inherit;background:transparent;"
              autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" inputmode="text" />
            <button id="scan-btn" style="background:none;border:none;padding:0;cursor:pointer;color:#6b7280;">
              ${Icon('qr-code',{size:20})}
            </button>
          </div>
          <div id="search-err" style="color:#ef4444;font-size:0.8rem;margin-top:0.5rem;min-height:1.2em;"></div>
          <div id="search-result" style="margin-top:0.75rem;"></div>
          <p style="font-size:0.8125rem;color:#6b7280;margin:0.5rem 0 0;">Don't know the recipient's OPay account number? <button id="ask-them-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.8125rem;cursor:pointer;padding:0;">Ask them &gt;</button></p>
        </div>

        <!-- Recents / Favourites tabs -->
        <div style="background:white;border-radius:0.875rem;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1rem;">
          <div style="display:flex;gap:1.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0;">
            <button id="tab-recents" style="background:none;border:none;font-weight:700;font-size:0.9375rem;color:${primaryColor};padding:0 0 0.75rem;border-bottom:2px solid ${primaryColor};cursor:pointer;">Recents</button>
            <button id="tab-favs" style="background:none;border:none;font-weight:600;font-size:0.9375rem;color:#6b7280;padding:0 0 0.75rem;cursor:pointer;">Favourites</button>
          </div>
          <div id="recents-list">
            ${recents.length === 0
              ? `<p style="color:#9ca3af;font-size:0.875rem;text-align:center;padding:1.5rem 0;margin:0;">No recent transfers yet</p>`
              : recents.slice(0, 3).map(r => recentItemHtml(r)).join('')
            }
            ${recents.length > 3 ? `<button id="view-all-btn" style="width:100%;padding:0.75rem;background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.875rem;cursor:pointer;text-align:center;">View All &gt;</button>` : ''}
          </div>
        </div>

        <!-- See who else is on OPay -->
        <div style="background:white;border-radius:0.875rem;padding:1rem 1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;align-items:center;gap:0.875rem;margin-bottom:1rem;cursor:pointer;">
          <div style="width:40px;height:40px;border-radius:9999px;background:#e8f5ec;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('users',{size:20,color:primaryColor})}
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.9375rem;color:#111827;">See who else is using OPay</div>
            <div style="font-size:0.8125rem;color:#6b7280;margin-top:2px;">Send money to your contacts for free</div>
          </div>
          ${Icon('chevron-right',{size:18,color:'#9ca3af'})}
        </div>

      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/dashboard'));

    const input = container.querySelector('#recipient-input');
    const errEl = container.querySelector('#search-err');
    const resultEl = container.querySelector('#search-result');

    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    input.addEventListener('input', () => { if (input.value.trim()) doSearch(); });

    // Recent item click
    container.querySelectorAll('[data-recent-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = recents.find(x => String(x.id) === btn.dataset.recentId);
        if (r) { recipient = r; step = 'amount'; renderAmount(); }
      });
    });

    // Ad carousel auto-slide
    const inner = container.querySelector('#ad-carousel-inner');
    if (inner && adBanners && adBanners.length > 1) {
      let cur = 0;
      const dots = container.querySelectorAll('.ad-dot');
      setInterval(() => {
        cur = (cur + 1) % adBanners.length;
        inner.style.transform = \`translateX(-\${cur * 100}%)\`;
        dots.forEach((d, i) => d.style.background = i === cur ? primaryColor : '#d1d5db');
      }, 3500);
    }

    async function doSearch() {
      const q = input.value.trim();
      errEl.textContent = '';
      resultEl.innerHTML = '';
      if (!q) return;

    async function doSearch() {
      const q = input.value.trim();
      errEl.textContent = '';
      resultEl.innerHTML = '';
      if (!q) { errEl.textContent = 'Enter a username, account number, or phone'; return; }

      searchBtn.textContent = 'Searching...';

      try {
        const res = await fetch(`/api/users/lookup?q=${encodeURIComponent(q)}`, { credentials: 'include' });
        const data = await res.json();
                searchBtn.disabled = false;

        if (data.ok) {
          const u = data.user;
          resultEl.innerHTML = `
          <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:0.75rem;padding:1rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
              <div style="width:44px;height:44px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${Icon('user',{size:22,color:'white'})}
              </div>
              <div>
                <div style="font-weight:700;color:#111827;">${u.full_name}</div>
                <div style="font-size:0.75rem;color:#6b7280;">@${u.username}</div>
                ${u.account_number ? `<div style="font-size:0.75rem;color:#6b7280;margin-top:1px;">Acct: ${u.account_number}</div>` : ''}
              </div>
              <div style="margin-left:auto;">${Icon('check-circle',{size:20,color:'#059669'})}</div>
            </div>
            <button id="select-recipient" style="width:100%;padding:0.7rem;background:#00B875;color:white;border:none;border-radius:0.6rem;font-weight:700;font-size:0.9rem;cursor:pointer;">Continue to Amount</button>
          </div>`;

          resultEl.querySelector('#select-recipient').addEventListener('click', () => {
            recipient = u;
            step = 'amount';
            renderAmount();
          });
        } else {
          errEl.textContent = data.error || 'User not found';
        }
      } catch (e) {
                searchBtn.disabled = false;
        errEl.textContent = 'Network error. Please try again.';
      }
    }
  }

  // ── STEP 2: Enter amount ─────────────────────────────────────────────────
  function renderAmount() {
  // ── STEP 2: Enter amount ─────────────────────────────────────────────────
  function renderAmount() {
    const { primaryColor } = Stores.customization.get();
    const balance = getBalance();
    const quickAmts = [500, 1000, 2000, 5000, 10000, 9999];
    let selectedQuick = null;
    let inputVal = amount > 0 ? String(amount) : '';

    function renderInner() {
      const canConfirm = parseFloat(inputVal || '0') > 0;
      const recipientPhone = recipient.phone || recipient.account_number || '';
      container.innerHTML = `
      <div style="min-height:100vh;background:#f5f6f8;display:flex;flex-direction:column;">
        <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
            <h2 style="margin:0;font-size:1.05rem;font-weight:700;">Transfer to OPay Account</h2>
          </div>
          <button id="records-btn" style="background:none;border:none;color:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">Records</button>
        </div>
        <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.875rem;border-bottom:1px solid #f3f4f6;">
          <div style="width:44px;height:44px;border-radius:9999px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
            ${recipient.profile_photo ? `<img src="${recipient.profile_photo}" style="width:100%;height:100%;object-fit:cover;" />` : `${Icon('user',{size:22,color:'#9ca3af'})}`}
          </div>
          <div>
            <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">${(recipient.full_name||'').toUpperCase()}</p>
            <p style="font-size:0.8125rem;color:#6b7280;margin:0.125rem 0 0;">${recipientPhone.replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3')}</p>
          </div>
        </div>
        <div style="background:white;margin:0.75rem 0 0;padding:1.25rem 1.25rem 1.5rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.875rem;">
            <span style="font-size:0.9375rem;font-weight:700;color:#111827;">Amount</span>
            <span style="background:#e8f5ec;color:${primaryColor};font-size:0.75rem;font-weight:600;padding:3px 10px;border-radius:9999px;">No Transaction Fees</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;padding-bottom:0.875rem;border-bottom:1px solid #e5e7eb;margin-bottom:1rem;">
            <span style="font-size:1.25rem;font-weight:700;color:#111827;">₦</span>
            <div style="position:relative;flex:1;display:flex;align-items:center;">
              <input id="amount-input" type="text" inputmode="none" readonly
                value="${inputVal ? Number(inputVal).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) : ''}"
                placeholder="10.00 - 5,000,000.00"
                style="flex:1;border:none;outline:none;font-size:${inputVal?'1.75rem':'1rem'};font-weight:${inputVal?'800':'400'};color:${inputVal?'#111827':'#9ca3af'};font-family:inherit;background:transparent;padding:0;" />
              ${inputVal ? `<button id="clear-amt" style="background:#d1d5db;border:none;width:22px;height:22px;border-radius:9999px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;font-size:0.75rem;flex-shrink:0;">x</button>` : ''}
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.625rem;">
            ${quickAmts.map(v => `
            <button class="quick-amt" data-val="${v}" style="padding:0.75rem 0.5rem;border-radius:0.625rem;border:1px solid #e5e7eb;background:${selectedQuick===v?'rgba(0,184,117,0.1)':'white'};text-align:center;cursor:pointer;">
              <span style="font-size:0.875rem;font-weight:600;color:${selectedQuick===v?primaryColor:'#374151'};">&#x20A6;${v.toLocaleString()}</span>
            </button>`).join('')}
          </div>
        </div>
        <div style="background:white;margin-top:0.75rem;padding:1.25rem;">
          <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.75rem;">Remark</p>
          <input id="remark-input" type="text" placeholder="What's this for?(Optional)" value="${note}" maxlength="100"
            style="width:100%;border:none;border-bottom:1px solid #e5e7eb;outline:none;font-size:0.9375rem;padding:0 0 0.75rem;font-family:inherit;color:#374151;background:transparent;box-sizing:border-box;" />
          <div style="display:flex;gap:0.625rem;margin-top:0.875rem;">
            <button class="remark-chip" data-remark="Purchase" style="flex:1;padding:0.625rem;border:1px solid #e5e7eb;border-radius:0.5rem;background:white;font-size:0.875rem;color:#374151;cursor:pointer;">Purchase</button>
            <button class="remark-chip" data-remark="Personal" style="flex:1;padding:0.625rem;border:1px solid #e5e7eb;border-radius:0.5rem;background:white;font-size:0.875rem;color:#374151;cursor:pointer;">Personal</button>
          </div>
        </div>
        <div style="flex:1;"></div>
        <div style="padding:1rem 1.25rem;">
          <button id="confirm-btn" style="width:100%;padding:1rem;background:${canConfirm?primaryColor:'#a7f3d0'};color:white;border:none;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;">Confirm</button>
        </div>
      </div>`;

      container.querySelector('#back-btn').addEventListener('click', () => { step='find'; renderFind(); });
      container.querySelector('#records-btn').addEventListener('click', () => navigate('/transaction-history'));
      const amtInput = container.querySelector('#amount-input');
      attachAmountKeypad(amtInput, { decimal: true });
      amtInput.addEventListener('input', (e) => { inputVal = e.target.value.replace(/,/g,''); selectedQuick = null; renderInner(); });
      const clearBtn = container.querySelector('#clear-amt');
      if (clearBtn) clearBtn.addEventListener('click', () => { inputVal=''; selectedQuick=null; renderInner(); });
      container.querySelectorAll('.quick-amt').forEach(btn => {
        btn.addEventListener('click', () => { selectedQuick = parseInt(btn.dataset.val); inputVal = String(selectedQuick); renderInner(); });
      });
      container.querySelector('#remark-input').addEventListener('input', (e) => { note = e.target.value; });
      container.querySelectorAll('.remark-chip').forEach(btn => {
        btn.addEventListener('click', () => { note = btn.dataset.remark; container.querySelector('#remark-input').value = note; });
      });
      container.querySelector('#confirm-btn').addEventListener('click', () => {
        const val = parseFloat(inputVal || '0');
        if (!val || val <= 0) { toast.error('Enter an amount'); return; }
        if (val > balance) { toast.error('Insufficient balance'); return; }
        amount = val;
        showReminderSheet();
      });
    }

    function showReminderSheet() {
      const pc = primaryColor;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;';
      const acctNo = (recipient.account_number || recipient.phone || '').replace(/\s/g,'');
      overlay.innerHTML = `
      <div id="rem-sheet" style="background:white;border-radius:1.25rem 1.25rem 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:420px;transform:translateY(100%);transition:transform 0.28s cubic-bezier(.22,.8,.28,1);">
        <div style="display:flex;justify-content:flex-end;"><button id="rem-x" style="background:none;border:none;font-size:1.25rem;color:#9ca3af;cursor:pointer;">&#10005;</button></div>
        <h2 style="font-size:1.125rem;font-weight:800;color:#111827;text-align:center;margin:0 0 0.75rem;">Reminder</h2>
        <p style="font-size:0.875rem;color:#6b7280;text-align:center;line-height:1.5;margin:0 0 1.25rem;">Double check the transfer details before you proceed. Please note that successful transfers cannot be reversed.</p>
        <div style="background:#f9fafb;border-radius:0.875rem;padding:1rem 1.25rem;margin-bottom:1.5rem;">
          <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0 0 0.875rem;">Transaction Details</p>
          ${[['Name',(recipient.full_name||'').toUpperCase()],['Account No.',acctNo],['Bank','OPay'],['Amount',`&#x20A6;${amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`]].map(([l,v])=>`
          <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #f3f4f6;">
            <span style="font-size:0.875rem;color:#9ca3af;">${l}</span>
            <span style="font-size:0.875rem;font-weight:700;color:#111827;">${v}</span>
          </div>`).join('')}
        </div>
        <div style="display:flex;gap:0.75rem;">
          <button id="rem-recheck" style="flex:1;padding:0.875rem;background:white;border:1.5px solid ${pc};color:${pc};border-radius:9999px;font-weight:700;cursor:pointer;">Recheck</button>
          <button id="rem-continue" style="flex:2;padding:0.875rem;background:${pc};color:white;border:none;border-radius:9999px;font-weight:700;cursor:pointer;">Continue</button>
        </div>
      </div>`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => { overlay.querySelector('#rem-sheet').style.transform='translateY(0)'; });
      const close = (cb) => { overlay.querySelector('#rem-sheet').style.transform='translateY(100%)'; setTimeout(() => { overlay.remove(); if(cb) cb(); }, 280); };
      overlay.addEventListener('click', (e) => { if(e.target===overlay) close(); });
      overlay.querySelector('#rem-x').addEventListener('click', () => close());
      overlay.querySelector('#rem-recheck').addEventListener('click', () => close());
      overlay.querySelector('#rem-continue').addEventListener('click', () => close(() => showPaySheet()));
    }

    function showPaySheet() {
      const pc = primaryColor;
      const bal = getBalance();
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;';
      const acctNo = (recipient.account_number || recipient.phone || '').replace(/\s/g,'');
      const fmtAcct = acctNo.replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3');
      overlay.innerHTML = `
      <div id="pay-sheet" style="background:white;border-radius:1.25rem 1.25rem 0 0;padding:1.5rem 1.25rem 2rem;width:100%;max-width:420px;transform:translateY(100%);transition:transform 0.28s cubic-bezier(.22,.8,.28,1);">
        <button id="pay-x" style="background:none;border:none;font-size:1.125rem;color:#9ca3af;cursor:pointer;padding:0;margin-bottom:0.75rem;">&#10005;</button>
        <p style="font-size:2rem;font-weight:800;color:#111827;margin:0 0 1.25rem;text-align:center;">&#x20A6;${amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
        <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:0.875rem;color:#9ca3af;">Account Number</span>
          <span style="font-size:0.875rem;font-weight:600;color:#111827;">${fmtAcct}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:0.875rem;color:#9ca3af;">Name</span>
          <div style="display:flex;align-items:center;gap:0.375rem;">
            <div style="width:20px;height:20px;border-radius:9999px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;overflow:hidden;">${recipient.profile_photo?`<img src="${recipient.profile_photo}" style="width:100%;height:100%;object-fit:cover;">`:`${Icon('user',{size:12,color:'#9ca3af'})}`}</div>
            <span style="font-size:0.875rem;font-weight:600;color:#111827;">${(recipient.full_name||'').toUpperCase()}</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:0.875rem;color:#9ca3af;">Amount</span>
          <span style="font-size:0.875rem;font-weight:700;color:#111827;">&#x20A6;${amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
        </div>
        <div style="margin-top:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.625rem;">
            <span style="font-size:0.9375rem;font-weight:700;color:#111827;">Payment Method</span>
            <span style="font-size:0.875rem;color:#9ca3af;">All &gt;</span>
          </div>
          <div style="border:1px solid #e5e7eb;border-radius:0.875rem;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem 1rem;border-bottom:1px dashed #e5e7eb;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span style="font-size:0.875rem;font-weight:700;color:#111827;">Available Balance</span>
                <span style="font-size:0.875rem;color:#374151;">(&#x20A6;${bal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})})</span>
              </div>
              <span style="color:${pc};">${Icon('check',{size:18})}</span>
            </div>
            <div style="padding:0.625rem 1rem;border-bottom:1px solid #f3f4f6;"><span style="font-size:0.8125rem;color:#9ca3af;">Wallet (&#x20A6;0.00)</span></div>
            <div style="display:flex;justify-content:space-between;padding:0.625rem 1rem;">
              <span style="font-size:0.8125rem;color:#374151;">OWealth (&#x20A6;${bal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})})</span>
              <span style="font-size:0.8125rem;font-weight:600;color:#111827;">-&#x20A6;${amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
        <button id="do-pay" style="width:100%;background:${pc};color:white;border:none;border-radius:9999px;padding:1rem;font-weight:700;font-size:1.0625rem;cursor:pointer;margin-top:1.5rem;">Pay</button>
      </div>`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => { overlay.querySelector('#pay-sheet').style.transform='translateY(0)'; });
      const close = (cb) => { overlay.querySelector('#pay-sheet').style.transform='translateY(100%)'; setTimeout(() => { overlay.remove(); if(cb) cb(); }, 280); };
      overlay.addEventListener('click', (e) => { if(e.target===overlay) close(); });
      overlay.querySelector('#pay-x').addEventListener('click', () => close());
      overlay.querySelector('#do-pay').addEventListener('click', () => {
        close(() => {
          showPinModal({ amount: amount.toLocaleString(), recipientLabel: recipient.full_name, onConfirm: async () => {
            try {
              const res = await fetch('/api/transfer/opay', { method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify({ recipient_id: recipient.id, amount, note }) });
              const data = await res.json();
              if (data.ok) {
                if (AuthState.isAdmin) { Stores.balance.set({ balance: data.new_balance }); } else { AuthState.balance = data.new_balance; Stores.balance.set({ balance: data.new_balance }); }
                Stores.recentTransfers.addOpay({ id: recipient.id, full_name: recipient.full_name, username: recipient.username, account_number: recipient.account_number||'', phone: recipient.phone||'', profile_photo: recipient.profile_photo||'' });
                Stores.transaction.addTransaction({ type: `Transfer to ${recipient.full_name}`, amount: `-&#x20A6;${amount.toLocaleString()}`, status: 'Successful', icon: 'send' });
                step = 'success'; renderSuccess(data);
              } else { toast.error(data.error || 'Transfer failed'); }
            } catch(e) { toast.error('Network error. Please try again.'); }
          }});
        });
      });
    }

    renderInner();
  }

  // ── STEP 4: Success ──────────────────────────────────────────────────────
  function renderSuccess(data) {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;">
      <div style="width:100%;max-width:20rem;text-align:center;">
        <div style="width:80px;height:80px;border-radius:9999px;background:#d1fae5;border:3px solid #34d399;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
          ${Icon('check',{size:40,color:'#059669'})}
        </div>
        <h2 style="font-size:1.5rem;font-weight:800;color:#111827;margin:0 0 0.5rem;">Transfer Successful</h2>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 2rem;">Your transfer has been sent successfully.</p>

        <div style="background:white;border-radius:1rem;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:left;margin-bottom:1.5rem;">
          <div style="font-size:2rem;font-weight:800;color:#059669;text-align:center;margin-bottom:1rem;">${fmt(amount)}</div>
          ${[
            ['Sent to', data.recipient.full_name],
            ['Account', data.recipient.account_number || 'OPay Account'],
            ['Status', 'Successful'],
            ['New Balance', fmt(data.new_balance)],
            ...(note ? [['Note', note]] : []),
          ].map(([label, value]) => `
          <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f4f6;font-size:0.875rem;">
            <span style="color:#6b7280;">${label}</span>
            <span style="font-weight:600;color:${label === 'Status' ? '#059669' : '#111827'};">${value}</span>
          </div>`).join('')}
        </div>

        <button id="home-btn" style="width:100%;padding:0.85rem;background:#00B875;color:white;border:none;border-radius:0.6rem;font-weight:700;font-size:0.95rem;cursor:pointer;margin-bottom:0.75rem;">Back to Home</button>
        <button id="send-again-btn" style="width:100%;padding:0.85rem;background:white;color:#00B875;border:1.5px solid #00B875;border-radius:0.6rem;font-weight:600;font-size:0.9rem;cursor:pointer;">Send to Another User</button>
      </div>
    </div>`;

    container.querySelector('#home-btn').addEventListener('click', () => navigate('/dashboard'));
    container.querySelector('#send-again-btn').addEventListener('click', () => {
      step = 'find'; recipient = null; amount = 0; note = '';
      renderFind();
    });
  }

  // Start
  renderFind();
}

window.renderToOpayPage = renderToOpayPage;
