// ── Login Page — matches OPay app UI precisely ────────────────────────────────
async function renderLoginPage(container) {
  const loggedIn = await Auth.init();
  if (loggedIn) { navigate('/dashboard'); return; }

  let mode = 'fingerprint'; // entry mode matching screenshot: fingerprint login screen

  function render() {
    if (mode === 'fingerprint') renderFingerprint();
    else if (mode === 'password') renderPasswordLogin();
    else if (mode === 'user-login') renderUserLogin();
    else if (mode === 'user-register') renderUserRegister();
  }

  // ── FINGERPRINT / BIOMETRIC (default entry — matches Image 11) ───────────────
  function renderFingerprint() {
    const { profilePhoto } = Stores.customization.get();
    const { accountName } = Stores.balance.get();
    const displayName = accountName || 'CLINTON';
    const maskedPhone = '816****049';

    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;">
      <div style="width:100%;max-width:20rem;text-align:center;">
        <div style="margin-bottom:2rem;">
          <img src="./assets/opay-logo.png" alt="OPay" style="width:80px;height:auto;object-fit:contain;" />
          <span style="font-size:1.75rem;font-weight:800;color:#1B1464;margin-left:0.25rem;vertical-align:middle;">Pay</span>
        </div>

        <div style="width:88px;height:88px;border-radius:9999px;background:#111;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;overflow:hidden;">
          ${profilePhoto
            ? `<img src="${profilePhoto}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div style="width:88px;height:88px;background:#222;border-radius:9999px;"></div>`}
        </div>

        <p style="font-size:1.0625rem;font-weight:600;color:#111827;margin:0 0 2.5rem;">${displayName}(${maskedPhone})</p>

        <div style="width:68px;height:68px;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;">
          ${Icon('fingerprint', { size: 64, color: '#00B875' })}
        </div>
        <p style="font-size:0.875rem;color:#6b7280;margin:0 0 2rem;">Click to log in with Fingerprint</p>

        <button id="btn-fingerprint" style="width:100%;padding:0.9rem;background:#00B875;color:white;border:none;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;margin-bottom:2.5rem;">Verify Fingerprint</button>

        <div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;">
          <button id="btn-switch-account" style="background:none;border:none;color:#00B875;font-weight:600;font-size:0.9rem;cursor:pointer;">Switch Account</button>
          <span style="color:#d1d5db;">|</span>
          <button id="btn-password" style="background:none;border:none;color:#00B875;font-weight:600;font-size:0.9rem;cursor:pointer;">Login with Password</button>
        </div>
      </div>
    </div>`;

    container.querySelector('#btn-fingerprint').addEventListener('click', async () => {
      await doAdminLogin('fingerprint', {});
    });
    container.querySelector('#btn-switch-account').addEventListener('click', () => { mode = 'user-login'; render(); });
    container.querySelector('#btn-password').addEventListener('click', () => { mode = 'password'; render(); });
  }

  // ── PASSWORD LOGIN (matches Image 9 — "Log in to your account") ─────────────
  function renderPasswordLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;padding:1.5rem;">
      <button id="btn-back" style="display:flex;align-items:center;gap:0.5rem;background:none;border:none;color:#374151;font-size:0.9rem;cursor:pointer;margin-bottom:2.5rem;padding:0;align-self:flex-start;">
        ${Icon('arrow-left', { size: 20 })}
      </button>

      <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;max-width:24rem;width:100%;margin:0 auto;">
        <div>
          <div style="text-align:center;margin-bottom:2.5rem;">
            <img src="./assets/opay-logo.png" alt="OPay" style="width:72px;height:auto;object-fit:contain;" />
            <span style="font-size:1.5rem;font-weight:800;color:#1B1464;margin-left:0.25rem;vertical-align:middle;">Pay</span>
          </div>

          <h2 style="font-size:1.625rem;font-weight:800;color:#111827;margin:0 0 0.25rem;">Log in to your account</h2>

          <div style="margin-top:1.75rem;">
            <div style="border:2px solid #00B875;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:1rem;background:white;">
              <label style="font-size:0.72rem;color:#00B875;font-weight:600;display:block;margin-bottom:2px;">Enter your Mobile No./Email</label>
              <input id="login-identifier" type="text" placeholder=""
                autocomplete="username" autocorrect="off" autocapitalize="none" spellcheck="false"
                style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;background:transparent;color:#111827;" />
            </div>

            <button style="background:none;border:none;padding:0;color:#00B875;font-size:0.875rem;font-weight:600;cursor:pointer;margin-bottom:1rem;">Lost Your Mobile Number, <span style="text-decoration:underline;">Change Now</span></button>
          </div>
        </div>

        <div>
          <button id="btn-login-next" style="width:100%;padding:0.9rem;background:#a0e0c4;color:white;border:none;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;margin-bottom:1.25rem;">NEXT</button>

          <div id="login-err" style="color:#ef4444;font-size:0.8rem;text-align:center;min-height:1.4em;margin-bottom:0.75rem;"></div>

          <p style="text-align:center;font-size:0.875rem;color:#6b7280;">
            Don't have an OPay Account yet? <button id="btn-go-register" style="background:none;border:none;color:#00B875;font-weight:600;cursor:pointer;padding:0;font-size:0.875rem;">Click here to get one</button>
          </p>
        </div>
      </div>
    </div>`;

    container.querySelector('#btn-back').addEventListener('click', () => { mode = 'fingerprint'; render(); });
    container.querySelector('#btn-go-register').addEventListener('click', () => { mode = 'user-register'; render(); });

    const idInput = container.querySelector('#login-identifier');
    const btn = container.querySelector('#btn-login-next');
    const errEl = container.querySelector('#login-err');

    // Activate button when typing
    idInput.addEventListener('input', () => {
      btn.style.background = idInput.value.trim() ? '#00B875' : '#a0e0c4';
    });

    btn.addEventListener('click', () => showPasswordStep(idInput.value.trim(), errEl, btn));
    idInput.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

    async function showPasswordStep(identifier, errEl, nextBtn) {
      if (!identifier) { errEl.textContent = 'Enter your phone or email'; return; }
      // Show password field below
      const pwWrap = document.createElement('div');
      pwWrap.innerHTML = `
        <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-top:0.75rem;background:white;">
          <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Password</label>
          <input id="login-password" type="password" placeholder=""
            autocomplete="current-password"
            style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;background:transparent;color:#111827;" />
        </div>`;
      const existingPw = container.querySelector('#login-password');
      if (!existingPw) {
        idInput.closest('div[style*="border:2px"]').after(pwWrap);
        container.querySelector('#login-password').focus();
      }
      nextBtn.textContent = 'Sign In';
      nextBtn.onclick = async () => {
        const pw = container.querySelector('#login-password')?.value;
        errEl.textContent = '';
        if (!pw) { errEl.textContent = 'Enter your password'; return; }
        nextBtn.textContent = 'Signing in...'; nextBtn.disabled = true;
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ method: 'password', email: identifier, password: pw })
          });
          const data = await res.json();
          if (data.ok) {
            AuthState.isLoggedIn = true;
            AuthState.isAdmin = data.is_admin;
            AuthState.username = data.username || '';
            AuthState.userId = data.user_id || null;
            await Auth.init();
            navigate('/dashboard');
          } else {
            errEl.textContent = data.error || 'Invalid credentials';
            nextBtn.textContent = 'Sign In'; nextBtn.disabled = false;
          }
        } catch (e) {
          errEl.textContent = 'Network error';
          nextBtn.textContent = 'Sign In'; nextBtn.disabled = false;
        }
      };
    }
  }

  // ── USER LOGIN (alternative — email/phone + password) ────────────────────────
  function renderUserLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;padding:1.5rem;">
      <button id="btn-back" style="display:flex;align-items:center;gap:0.5rem;background:none;border:none;color:#374151;font-size:0.9rem;cursor:pointer;margin-bottom:2.5rem;padding:0;align-self:flex-start;">
        ${Icon('arrow-left', { size: 20 })}
      </button>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;max-width:24rem;width:100%;margin:0 auto;">
        <div>
          <h2 style="font-size:1.625rem;font-weight:800;color:#111827;margin:0 0 1.75rem;">Sign in</h2>
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:0.875rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Email or Phone</label>
            <input id="user-email" type="text" autocomplete="username" autocorrect="off" autocapitalize="none" spellcheck="false"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;background:transparent;" />
          </div>
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:1rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Password</label>
            <input id="user-password" type="password" autocomplete="current-password"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;background:transparent;" />
          </div>
          <div id="login-err" style="color:#ef4444;font-size:0.8rem;min-height:1.2em;margin-bottom:0.5rem;"></div>
        </div>
        <div>
          <button id="btn-user-login" style="width:100%;padding:0.9rem;background:#00B875;color:white;border:none;border-radius:9999px;font-weight:700;font-size:1rem;cursor:pointer;margin-bottom:1rem;">Sign In</button>
          <p style="text-align:center;font-size:0.875rem;color:#6b7280;">
            No account? <button id="btn-go-register" style="background:none;border:none;color:#00B875;font-weight:600;cursor:pointer;padding:0;">Create one</button>
          </p>
        </div>
      </div>
    </div>`;

    container.querySelector('#btn-back').addEventListener('click', () => { mode = 'fingerprint'; render(); });
    container.querySelector('#btn-go-register').addEventListener('click', () => { mode = 'user-register'; render(); });

    const emailEl = container.querySelector('#user-email');
    const pwEl = container.querySelector('#user-password');
    pwEl.addEventListener('keydown', e => { if (e.key === 'Enter') container.querySelector('#btn-user-login').click(); });

    container.querySelector('#btn-user-login').addEventListener('click', async () => {
      const email = emailEl.value.trim();
      const pw = pwEl.value;
      const errEl = container.querySelector('#login-err');
      errEl.textContent = '';
      if (!email || !pw) { errEl.textContent = 'Enter email and password'; return; }
      const btn = container.querySelector('#btn-user-login');
      btn.textContent = 'Signing in...'; btn.disabled = true;
      try {
        const res = await fetch('/api/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ method: 'password', email, password: pw })
        });
        const data = await res.json();
        if (data.ok) {
          AuthState.isLoggedIn = true; AuthState.isAdmin = false;
          AuthState.username = data.username; AuthState.userId = data.user_id;
          await Auth.init(); navigate('/dashboard');
        } else {
          errEl.textContent = data.error || 'Invalid credentials';
          btn.textContent = 'Sign In'; btn.disabled = false;
        }
      } catch (e) {
        errEl.textContent = 'Network error';
        btn.textContent = 'Sign In'; btn.disabled = false;
      }
    });
  }

  // ── REGISTER (matches Image 8 — "Get an OPay Account") ──────────────────────
  function renderUserRegister() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;padding:1.5rem;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <button id="btn-back" style="background:none;border:none;color:#374151;cursor:pointer;padding:0;">
          ${Icon('arrow-left', { size: 22 })}
        </button>
        <button id="btn-help" style="background:none;border:none;color:#00B875;font-weight:600;font-size:0.9rem;cursor:pointer;">Help</button>
      </div>

      <div style="width:100%;max-width:24rem;margin:0 auto;">
        <h2 style="font-size:1.625rem;font-weight:800;color:#111827;margin:0 0 1.75rem;">Get an OPay Account</h2>

        <!-- Phone field with Nigeria flag -->
        <div style="border:2px solid #00B875;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:1rem;display:flex;align-items:center;gap:0.625rem;background:white;">
          <div style="display:flex;align-items:center;gap:0.375rem;flex-shrink:0;">
            <span style="font-size:1.25rem;">🇳🇬</span>
            <span style="font-weight:600;color:#374151;font-size:0.875rem;">+234</span>
            ${Icon('chevron-down', { size: 14, color: '#6b7280' })}
          </div>
          <div style="width:1px;height:1.25rem;background:#d1d5db;"></div>
          <input id="reg-phone" type="tel" placeholder="0816 0881 049"
            autocomplete="tel" inputmode="numeric"
            style="flex:1;border:none;outline:none;font-size:1rem;font-family:inherit;background:transparent;" />
        </div>

        <!-- Invitation code -->
        <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;overflow:hidden;margin-bottom:1.25rem;">
          <button id="toggle-invite" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1rem;background:#f0fdf4;border:none;cursor:pointer;">
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <span style="font-size:1.25rem;">🎁</span>
              <span style="font-size:0.875rem;color:#374151;font-weight:500;">Have an Invitation Code? (Optional)</span>
            </div>
            ${Icon('chevron-down', { size: 16, color: '#6b7280' })}
          </button>
          <div id="invite-body" style="display:none;padding:0 1rem 0.875rem;">
            <input id="reg-invite" type="text" placeholder="Invitation code"
              style="width:100%;border:none;border-top:1px solid #e5e7eb;padding:0.75rem 0;outline:none;font-size:0.9rem;font-family:inherit;" />
          </div>
        </div>

        <!-- Sign-up promo -->
        <div style="display:flex;align-items:center;gap:0.625rem;background:#f0fdf4;border-radius:0.75rem;padding:0.75rem 1rem;margin-bottom:1.25rem;">
          <span style="font-size:1.125rem;">💰</span>
          <p style="margin:0;font-size:0.8125rem;color:#166534;">Sign up to get <strong>₦300</strong> airtime voucher</p>
        </div>

        <!-- Additional fields (collapsed by default, shown after phone entry) -->
        <div id="extra-fields" style="display:none;">
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:0.75rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Full Name</label>
            <input id="reg-fullname" type="text" placeholder="Your full name" autocomplete="name"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;" />
          </div>
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:0.75rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Username</label>
            <input id="reg-username" type="text" placeholder="e.g. john123" autocomplete="username" autocapitalize="none"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;" />
          </div>
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:0.75rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Email Address</label>
            <input id="reg-email" type="email" placeholder="you@email.com" autocomplete="email"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;" />
          </div>
          <div style="border:1.5px solid #e5e7eb;border-radius:0.625rem;padding:0.75rem 1rem;margin-bottom:1rem;">
            <label style="font-size:0.72rem;color:#6b7280;font-weight:600;display:block;margin-bottom:2px;">Password</label>
            <input id="reg-password" type="password" placeholder="Min 6 characters" autocomplete="new-password"
              style="width:100%;border:none;outline:none;font-size:1rem;font-family:inherit;" />
          </div>
        </div>

        <div id="reg-err" style="color:#ef4444;font-size:0.8rem;min-height:1.2em;margin-bottom:0.75rem;"></div>

        <button id="btn-register" style="width:100%;padding:0.9rem;background:#00B875;color:white;border:none;border-radius:9999px;font-weight:800;font-size:1rem;cursor:pointer;letter-spacing:0.05em;margin-bottom:1.25rem;">NEXT</button>

        <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:1.5rem;">
          <input type="checkbox" id="reg-terms" checked style="width:16px;height:16px;accent-color:#00B875;margin-top:2px;flex-shrink:0;" />
          <label for="reg-terms" style="font-size:0.8rem;color:#6b7280;line-height:1.4;">
            I have read, understood and agreed to the <span style="color:#00B875;font-weight:600;">Terms &amp; Conditions</span> and <span style="color:#00B875;font-weight:600;">Privacy Policy</span>.
          </label>
        </div>

        <p style="text-align:center;font-size:0.875rem;color:#6b7280;">
          Already have an OPay Account? <button id="btn-go-login" style="background:none;border:none;color:#00B875;font-weight:600;cursor:pointer;padding:0;font-size:0.875rem;">Log in</button>
        </p>
      </div>
    </div>`;

    container.querySelector('#btn-back').addEventListener('click', () => { mode = 'fingerprint'; render(); });
    container.querySelector('#btn-go-login').addEventListener('click', () => { mode = 'password'; render(); });

    container.querySelector('#toggle-invite').addEventListener('click', () => {
      const body = container.querySelector('#invite-body');
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    const phoneEl = container.querySelector('#reg-phone');
    // Use OPay secure numeric keypad for phone entry (matches screenshot)
    phoneEl.setAttribute('readonly', 'true');
    phoneEl.style.cursor = 'pointer';
    phoneEl.addEventListener('click', () => {
      openNumericKeypad({
        value: phoneEl.value,
        decimal: false,
        maxLength: 11,
        onInput: (v) => {
          phoneEl.value = v;
          if (v.length >= 8) container.querySelector('#extra-fields').style.display = 'block';
        },
        onComplete: (v) => {
          phoneEl.value = v;
          container.querySelector('#extra-fields').style.display = 'block';
        },
        onClose: (v) => { phoneEl.value = v; }
      });
    });
    phoneEl.addEventListener('input', () => {
      if (phoneEl.value.trim().length >= 8) {
        container.querySelector('#extra-fields').style.display = 'block';
      }
    });

    container.querySelector('#btn-register').addEventListener('click', async () => {
      const errEl = container.querySelector('#reg-err');
      errEl.textContent = '';
      const phone = phoneEl.value.trim();
      const extraVisible = container.querySelector('#extra-fields').style.display !== 'none';

      if (!phone) { errEl.textContent = 'Enter your phone number'; return; }
      if (!extraVisible) {
        container.querySelector('#extra-fields').style.display = 'block';
        return;
      }

      const body = {
        full_name: container.querySelector('#reg-fullname')?.value.trim() || '',
        username: container.querySelector('#reg-username')?.value.trim() || '',
        email: container.querySelector('#reg-email')?.value.trim() || '',
        phone,
        password: container.querySelector('#reg-password')?.value || '',
      };
      if (!body.phone || !body.password) { errEl.textContent = 'Phone and password are required'; return; }

      const btn = container.querySelector('#btn-register');
      btn.textContent = 'Creating...'; btn.disabled = true;
      try {
        const res = await fetch('/api/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.ok) {
          AuthState.isLoggedIn = true; AuthState.isAdmin = false;
          AuthState.username = data.user.username; AuthState.userId = data.user.id;
          await Auth.init(); navigate('/dashboard');
        } else {
          errEl.textContent = data.error || 'Registration failed';
          btn.textContent = 'NEXT'; btn.disabled = false;
        }
      } catch (e) {
        errEl.textContent = 'Network error';
        btn.textContent = 'NEXT'; btn.disabled = false;
      }
    });
  }

  async function doAdminLogin(method, extra) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ method, ...extra })
      });
      const data = await res.json();
      if (data.ok) {
        AuthState.isLoggedIn = true; AuthState.isAdmin = data.is_admin;
        AuthState.username = data.username || '';
        await Auth.init(); navigate('/dashboard');
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (e) {
      toast.error('Network error');
    }
  }

  render();
}

window.renderLoginPage = renderLoginPage;
