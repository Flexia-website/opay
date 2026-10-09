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
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h2 style="margin:0;font-size:1.05rem;font-weight:700;flex:1;">Send to OPay User</h2>
      </div>

      <div style="padding:1.5rem 1.25rem;">
        <div style="background:#e8f5ec;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.75rem;">
          <div style="width:36px;height:36px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('send',{size:16,color:'white'})}
          </div>
          <div>
            <div style="font-weight:600;font-size:0.9rem;color:#111827;">Instant OPay Transfer</div>
            <div style="font-size:0.75rem;color:#374151;margin-top:2px;">Send money instantly to any registered OPay user</div>
          </div>
        </div>

        <div style="background:white;border-radius:1rem;padding:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.5rem;">Username, Account Number or Phone</label>
          <div style="display:flex;gap:0.5rem;">
            <input id="recipient-input" type="text"
              placeholder="e.g. john123 or 08012345678"
              class="input"
              style="flex:1;"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="none"
              spellcheck="false"
              inputmode="text" />
            <button id="search-btn" style="padding:0 1rem;background:#00B875;color:white;border:none;border-radius:0.6rem;font-weight:600;cursor:pointer;white-space:nowrap;font-size:0.85rem;">Search</button>
          </div>
          <div id="search-err" style="color:#ef4444;font-size:0.8rem;margin-top:0.5rem;min-height:1.2em;"></div>
          <div id="search-result" style="margin-top:0.75rem;"></div>
        </div>

        <div style="margin-top:1.5rem;">
          <div style="font-size:0.8rem;font-weight:600;color:#6b7280;letter-spacing:0.05em;margin-bottom:0.75rem;">HOW IT WORKS</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${[
              ['search', 'Find by username, account number, or phone'],
              ['check-circle', 'Confirm the recipient details'],
              ['send', 'Enter amount and send instantly'],
            ].map(([icon, text]) => `
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div style="width:32px;height:32px;border-radius:9999px;background:#d1fae5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${Icon(icon, {size:15,color:'#059669'})}
              </div>
              <span style="font-size:0.875rem;color:#374151;">${text}</span>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/dashboard'));

    const input = container.querySelector('#recipient-input');
    const searchBtn = container.querySelector('#search-btn');
    const errEl = container.querySelector('#search-err');
    const resultEl = container.querySelector('#search-result');

    // Search on Enter key — does NOT blur the input first
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch();
    });

    searchBtn.addEventListener('click', () => doSearch());

    async function doSearch() {
      const q = input.value.trim();
      errEl.textContent = '';
      resultEl.innerHTML = '';
      if (!q) { errEl.textContent = 'Enter a username, account number, or phone'; return; }

      searchBtn.textContent = 'Searching...';
      searchBtn.disabled = true;

      try {
        const res = await fetch(`/api/users/lookup?q=${encodeURIComponent(q)}`, { credentials: 'include' });
        const data = await res.json();
        searchBtn.textContent = 'Search';
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
        searchBtn.textContent = 'Search';
        searchBtn.disabled = false;
        errEl.textContent = 'Network error. Please try again.';
      }
    }
  }

  // ── STEP 2: Enter amount ─────────────────────────────────────────────────
  function renderAmount() {
    const balance = getBalance();
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h2 style="margin:0;font-size:1.05rem;font-weight:700;flex:1;">Enter Amount</h2>
      </div>

      <div style="padding:1.5rem 1.25rem;">
        <!-- Recipient summary -->
        <div style="background:white;border-radius:0.75rem;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1.25rem;display:flex;align-items:center;gap:0.75rem;">
          <div style="width:40px;height:40px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${Icon('user',{size:18,color:'white'})}
          </div>
          <div>
            <div style="font-weight:700;color:#111827;font-size:0.9rem;">${recipient.full_name}</div>
            <div style="font-size:0.75rem;color:#6b7280;">@${recipient.username}</div>
          </div>
          <button id="change-recipient" style="margin-left:auto;background:none;border:none;color:#00B875;font-weight:600;font-size:0.8rem;cursor:pointer;padding:0;">Change</button>
        </div>

        <!-- Amount input -->
        <div style="background:white;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);text-align:center;margin-bottom:1rem;">
          <div style="font-size:0.8rem;color:#6b7280;margin-bottom:0.5rem;">Amount to Send</div>
          <div style="display:flex;align-items:center;justify-content:center;gap:0.25rem;">
            <span style="font-size:2rem;font-weight:700;color:#9ca3af;">₦</span>
            <input id="amount-input" type="text"
              placeholder="0.00"
              class="input"
              style="border:none;outline:none;font-size:2.5rem;font-weight:800;color:#111827;text-align:center;width:100%;padding:0;background:transparent;"
              readonly
              inputmode="none" />
          </div>
          <div style="margin-top:0.5rem;font-size:0.8rem;color:#6b7280;">Balance: <strong style="color:#059669;">${fmt(balance)}</strong></div>
          <div id="amount-err" style="color:#ef4444;font-size:0.8rem;margin-top:0.4rem;min-height:1.2em;"></div>
        </div>

        <!-- Note field -->
        <div style="background:white;border-radius:0.75rem;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1rem;">
          <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Note (optional)</label>
          <input id="note-input" type="text"
            placeholder="What is this for?"
            class="input"
            style="font-size:0.9rem;"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            maxlength="100" />
        </div>

        <!-- Quick amounts -->
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.25rem;">
          ${[500,1000,2000,5000,10000].map(v => `
          <button class="quick-amt" data-val="${v}" style="padding:0.4rem 0.75rem;border-radius:9999px;border:1.5px solid #d1d5db;background:white;font-size:0.8rem;font-weight:600;cursor:pointer;color:#374151;">₦${v.toLocaleString()}</button>`).join('')}
        </div>

        <button id="proceed-btn" style="width:100%;padding:0.85rem;background:#00B875;color:white;border:none;border-radius:0.6rem;font-weight:700;font-size:0.95rem;cursor:pointer;">Continue</button>
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => { step = 'find'; renderFind(); });
    container.querySelector('#change-recipient').addEventListener('click', () => { step = 'find'; renderFind(); });

    // Attach sliding keypad to amount input
    const amountInput = container.querySelector('#amount-input');
    attachAmountKeypad(amountInput, { decimal: true });

    // Quick amount buttons
    container.querySelectorAll('.quick-amt').forEach(btn => {
      btn.addEventListener('click', () => {
        amountInput.value = btn.dataset.val;
        amountInput.dispatchEvent(new Event('input', { bubbles: true }));
        container.querySelectorAll('.quick-amt').forEach(b => {
          b.style.background = b === btn ? '#00B875' : 'white';
          b.style.color = b === btn ? 'white' : '#374151';
          b.style.borderColor = b === btn ? '#00B875' : '#d1d5db';
        });
      });
    });

    container.querySelector('#proceed-btn').addEventListener('click', () => {
      const errEl = container.querySelector('#amount-err');
      const val = parseFloat(amountInput.value.replace(/,/g, '') || '0');
      note = container.querySelector('#note-input').value.trim();
      errEl.textContent = '';
      if (!val || val <= 0) { errEl.textContent = 'Enter an amount'; return; }
      if (val > balance) { errEl.textContent = 'Insufficient balance'; return; }
      if (val < 1) { errEl.textContent = 'Minimum transfer is ₦1'; return; }
      amount = val;
      step = 'confirm';
      renderConfirm();
    });
  }

  // ── STEP 3: Confirm ──────────────────────────────────────────────────────
  function renderConfirm() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;padding:0;">${Icon('arrow-left',{size:22})}</button>
        <h2 style="margin:0;font-size:1.05rem;font-weight:700;flex:1;">Confirm Transfer</h2>
      </div>

      <div style="padding:1.5rem 1.25rem;">
        <div style="background:white;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:1.25rem;">
          <div style="text-align:center;margin-bottom:1.5rem;">
            <div style="font-size:2.5rem;font-weight:800;color:#111827;">${fmt(amount)}</div>
            <div style="font-size:0.85rem;color:#6b7280;margin-top:4px;">to ${recipient.full_name}</div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            ${[
              ['Recipient', recipient.full_name],
              ['Username', '@' + recipient.username],
              ['Account', recipient.account_number || 'OPay Account'],
              ['Amount', fmt(amount)],
              ['Fee', 'Free'],
              ...(note ? [['Note', note]] : []),
            ].map(([label, value]) => `
            <div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid #f3f4f6;font-size:0.875rem;">
              <span style="color:#6b7280;">${label}</span>
              <span style="font-weight:600;color:#111827;">${value}</span>
            </div>`).join('')}
          </div>
        </div>

        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:0.75rem;padding:0.875rem;margin-bottom:1.25rem;font-size:0.8rem;color:#92400e;display:flex;gap:0.5rem;align-items:flex-start;">
          ${Icon('alert-triangle',{size:16,color:'#d97706'})}
          <span>Please confirm all details. OPay transfers are instant and cannot be reversed.</span>
        </div>

        <button id="confirm-btn" style="width:100%;padding:0.85rem;background:#00B875;color:white;border:none;border-radius:0.6rem;font-weight:700;font-size:0.95rem;cursor:pointer;margin-bottom:0.75rem;">Send ${fmt(amount)}</button>
        <button id="cancel-btn" style="width:100%;padding:0.85rem;background:white;color:#374151;border:1.5px solid #d1d5db;border-radius:0.6rem;font-weight:600;font-size:0.9rem;cursor:pointer;">Cancel</button>
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => { step = 'amount'; renderAmount(); });
    container.querySelector('#cancel-btn').addEventListener('click', () => navigate('/dashboard'));

    container.querySelector('#confirm-btn').addEventListener('click', async () => {
      const btn = container.querySelector('#confirm-btn');
      btn.textContent = 'Sending...'; btn.disabled = true;

      try {
        const res = await fetch('/api/transfer/opay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            recipient_id: recipient.id,
            amount,
            note,
          })
        });
        const data = await res.json();
        if (data.ok) {
          // Update local balance
          if (AuthState.isAdmin) {
            Stores.balance.set({ balance: data.new_balance });
          } else {
            AuthState.balance = data.new_balance;
            Stores.balance.set({ balance: data.new_balance });
          }
          // Add transaction to history
          transactionStore.addTransaction({
            type: `Transfer to ${recipient.full_name}`,
            amount: `-${fmt(amount)}`,
            status: 'Successful',
            icon: 'send',
          });
          step = 'success';
          renderSuccess(data);
        } else {
          toast.error(data.error || 'Transfer failed');
          btn.textContent = `Send ${fmt(amount)}`; btn.disabled = false;
        }
      } catch (e) {
        toast.error('Network error. Please try again.');
        btn.textContent = `Send ${fmt(amount)}`; btn.disabled = false;
      }
    });
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
