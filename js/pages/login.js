// ── Login Page — handles both ADMIN login (existing flow) and USER register/login ──
async function renderLoginPage(container) {
  // If already logged in, redirect
  const loggedIn = await Auth.init();
  if (loggedIn) {
    navigate('/dashboard');
    return;
  }

  // Determine mode: "admin" (default) or "user-login" or "user-register"
  let mode = 'admin'; // admin = original master login

  function render() {
    if (mode === 'admin') renderAdminLogin();
    else if (mode === 'user-login') renderUserLogin();
    else if (mode === 'user-register') renderUserRegister();
  }

  // ── ADMIN LOGIN (original: password, PIN, fingerprint) ──────────────────────
  function renderAdminLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;">
      <div style="width:100%;max-width:24rem;">
        <div style="text-align:center;margin-bottom:2rem;">
          <div style="width:64px;height:64px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
            <img src="./assets/opay-logo.png" style="width:36px;height:36px;object-fit:contain;" />
          </div>
          <h1 style="font-size:1.5rem;font-weight:800;color:#111827;margin:0;">OPay</h1>
          <p style="color:#6b7280;font-size:0.875rem;margin:0.5rem 0 0;">Sign in to your account</p>
        </div>

        <div style="background:white;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <!-- Tab: Password / PIN / Fingerprint -->
          <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem;background:#f3f4f6;border-radius:0.5rem;padding:3px;">
            <button data-tab="password" class="login-tab active" style="flex:1;padding:0.5rem;border:none;border-radius:0.4rem;font-weight:600;font-size:0.8rem;cursor:pointer;background:white;color:#111827;">Password</button>
            <button data-tab="pin" class="login-tab" style="flex:1;padding:0.5rem;border:none;border-radius:0.4rem;font-weight:600;font-size:0.8rem;cursor:pointer;background:none;color:#6b7280;">PIN</button>
            <button data-tab="fingerprint" class="login-tab" style="flex:1;padding:0.5rem;border:none;border-radius:0.4rem;font-weight:600;font-size:0.8rem;cursor:pointer;background:none;color:#6b7280;">Biometric</button>
          </div>

          <!-- Password tab -->
          <div id="tab-password">
            <input id="login-password" type="password" placeholder="Password" class="input" style="margin-bottom:0.75rem;" />
            <button id="btn-login-password" class="btn btn-primary" style="width:100%;background:#00B875;color:white;border:none;">Sign In</button>
          </div>

          <!-- PIN tab (hidden) -->
          <div id="tab-pin" style="display:none;">
            <div id="pin-display" style="display:flex;gap:0.5rem;justify-content:center;margin-bottom:1rem;">
              ${[0,1,2,3].map(i => `<div class="pin-dot" data-idx="${i}" style="width:14px;height:14px;border-radius:9999px;border:2px solid #d1d5db;background:white;"></div>`).join('')}
            </div>
            <div id="pin-error" style="color:#ef4444;font-size:0.8rem;text-align:center;min-height:1.2em;margin-bottom:0.5rem;"></div>
            <div id="numpad-wrap"></div>
          </div>

          <!-- Fingerprint tab (hidden) -->
          <div id="tab-fingerprint" style="display:none;text-align:center;padding:1rem 0;">
            <div style="width:80px;height:80px;border-radius:9999px;background:#d1fae5;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
              ${Icon('fingerprint', { size: 40, color: '#059669' })}
            </div>
            <p style="color:#374151;margin:0 0 1.25rem;font-size:0.9rem;">Touch the fingerprint sensor to authenticate</p>
            <button id="btn-fingerprint" class="btn btn-primary" style="background:#00B875;color:white;border:none;">Authenticate</button>
          </div>
        </div>

        <!-- Divider + switch to user login/register -->
        <div style="margin-top:1.5rem;text-align:center;">
          <p style="color:#6b7280;font-size:0.85rem;margin:0 0 0.75rem;">Not the account owner?</p>
          <div style="display:flex;gap:0.75rem;justify-content:center;">
            <button id="btn-to-user-login" style="padding:0.5rem 1.25rem;border-radius:0.5rem;border:1.5px solid #00B875;background:white;color:#00B875;font-weight:600;font-size:0.85rem;cursor:pointer;">Log In</button>
            <button id="btn-to-user-register" style="padding:0.5rem 1.25rem;border-radius:0.5rem;border:none;background:#00B875;color:white;font-weight:600;font-size:0.85rem;cursor:pointer;">Create Account</button>
          </div>
        </div>
      </div>
    </div>`;

    // Tab switching
    let activeTab = 'password';
    container.querySelectorAll('.login-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        container.querySelectorAll('.login-tab').forEach(b => {
          b.style.background = b === btn ? 'white' : 'none';
          b.style.color = b === btn ? '#111827' : '#6b7280';
        });
        container.querySelectorAll('#tab-password,#tab-pin,#tab-fingerprint').forEach(el => el.style.display = 'none');
        container.querySelector(`#tab-${activeTab}`).style.display = '';
        if (activeTab === 'pin') initPinPad();
      });
    });

    // Password login
    const pwInput = container.querySelector('#login-password');
    container.querySelector('#btn-login-password').addEventListener('click', async () => {
      const pw = pwInput.value.trim();
      if (!pw) return toast.error('Enter your password');
      await doAdminLogin('password', { password: pw });
    });
    pwInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') container.querySelector('#btn-login-password').click();
    });

    // PIN pad
    let pinValue = '';
    function initPinPad() {
      const wrap = container.querySelector('#numpad-wrap');
      if (wrap.children.length) return;
      const numpad = document.createElement('div');
      wrap.appendChild(numpad);
      renderNumericKeypad(numpad, {
        onDigit(d) {
          if (pinValue.length < 4) {
            pinValue += d;
            updatePinDots();
            if (pinValue.length === 4) doAdminLogin('pin', { pin: pinValue });
          }
        },
        onDelete() {
          pinValue = pinValue.slice(0, -1);
          updatePinDots();
        }
      });
    }
    function updatePinDots() {
      container.querySelectorAll('.pin-dot').forEach((dot, i) => {
        dot.style.background = i < pinValue.length ? '#00B875' : 'white';
        dot.style.borderColor = i < pinValue.length ? '#00B875' : '#d1d5db';
      });
    }

    // Fingerprint
    container.querySelector('#btn-fingerprint').addEventListener('click', async () => {
      await doAdminLogin('fingerprint', {});
    });

    // Switch to user flows
    container.querySelector('#btn-to-user-login').addEventListener('click', () => { mode = 'user-login'; render(); });
    container.querySelector('#btn-to-user-register').addEventListener('click', () => { mode = 'user-register'; render(); });

    async function doAdminLogin(method, extra) {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ method, ...extra })
        });
        const data = await res.json();
        if (data.ok) {
          AuthState.isLoggedIn = true;
          AuthState.isAdmin = data.is_admin;
          AuthState.username = data.username || '';
          toast.success('Welcome back!');
          await Auth.init();
          navigate('/dashboard');
        } else {
          if (method === 'pin') {
            container.querySelector('#pin-error').textContent = data.error || 'Invalid PIN';
            pinValue = '';
            updatePinDots();
          } else {
            toast.error(data.error || 'Invalid credentials');
          }
        }
      } catch (e) {
        toast.error('Network error');
      }
    }
  }

  // ── USER LOGIN ───────────────────────────────────────────────────────────────
  function renderUserLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;">
      <div style="width:100%;max-width:24rem;">
        <button id="btn-back" style="display:flex;align-items:center;gap:0.5rem;background:none;border:none;color:#6b7280;font-size:0.9rem;cursor:pointer;margin-bottom:1.5rem;">
          ${Icon('arrow-left',{size:18})} Back
        </button>
        <div style="text-align:center;margin-bottom:1.5rem;">
          <div style="width:56px;height:56px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
            ${Icon('user',{size:28,color:'white'})}
          </div>
          <h2 style="font-size:1.375rem;font-weight:800;color:#111827;margin:0;">Welcome Back</h2>
          <p style="color:#6b7280;font-size:0.85rem;margin:0.4rem 0 0;">Sign in to your OPay account</p>
        </div>
        <div style="background:white;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="margin-bottom:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Email Address</label>
            <input id="user-email" type="email" placeholder="you@email.com" class="input" />
          </div>
          <div style="margin-bottom:1.25rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Password</label>
            <input id="user-password" type="password" placeholder="Your password" class="input" />
          </div>
          <button id="btn-user-login" class="btn btn-primary" style="width:100%;background:#00B875;color:white;border:none;">Sign In</button>
          <div id="login-err" style="color:#ef4444;font-size:0.8rem;text-align:center;min-height:1.4em;margin-top:0.5rem;"></div>
        </div>
        <p style="text-align:center;font-size:0.85rem;color:#6b7280;margin-top:1rem;">
          No account yet? <button id="btn-go-register" style="background:none;border:none;color:#00B875;font-weight:600;cursor:pointer;">Create one</button>
        </p>
      </div>
    </div>`;

    container.querySelector('#btn-back').addEventListener('click', () => { mode = 'admin'; render(); });
    container.querySelector('#btn-go-register').addEventListener('click', () => { mode = 'user-register'; render(); });
    container.querySelector('#btn-user-login').addEventListener('click', async () => {
      const email = container.querySelector('#user-email').value.trim();
      const pw = container.querySelector('#user-password').value;
      const errEl = container.querySelector('#login-err');
      errEl.textContent = '';
      if (!email || !pw) { errEl.textContent = 'Enter email and password'; return; }
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ method: 'password', email, password: pw })
        });
        const data = await res.json();
        if (data.ok) {
          AuthState.isLoggedIn = true;
          AuthState.isAdmin = false;
          AuthState.username = data.username;
          AuthState.userId = data.user_id;
          toast.success('Welcome back!');
          await Auth.init();
          navigate('/dashboard');
        } else {
          errEl.textContent = data.error || 'Invalid email or password';
        }
      } catch (e) {
        errEl.textContent = 'Network error. Please try again.';
      }
    });
  }

  // ── USER REGISTER ────────────────────────────────────────────────────────────
  function renderUserRegister() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;overflow-y:auto;">
      <div style="width:100%;max-width:24rem;">
        <button id="btn-back" style="display:flex;align-items:center;gap:0.5rem;background:none;border:none;color:#6b7280;font-size:0.9rem;cursor:pointer;margin-bottom:1.5rem;">
          ${Icon('arrow-left',{size:18})} Back
        </button>
        <div style="text-align:center;margin-bottom:1.5rem;">
          <div style="width:56px;height:56px;border-radius:9999px;background:#00B875;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
            ${Icon('user-plus',{size:26,color:'white'})}
          </div>
          <h2 style="font-size:1.375rem;font-weight:800;color:#111827;margin:0;">Create Account</h2>
          <p style="color:#6b7280;font-size:0.85rem;margin:0.4rem 0 0;">Join OPay in seconds</p>
        </div>
        <div style="background:white;border-radius:1rem;padding:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="margin-bottom:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Full Name</label>
            <input id="reg-fullname" type="text" placeholder="Your full name" class="input" />
          </div>
          <div style="margin-bottom:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Username</label>
            <input id="reg-username" type="text" placeholder="e.g. john123" class="input" autocapitalize="none" />
          </div>
          <div style="margin-bottom:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Email Address</label>
            <input id="reg-email" type="email" placeholder="you@email.com" class="input" />
          </div>
          <div style="margin-bottom:0.75rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Phone Number</label>
            <input id="reg-phone" type="tel" placeholder="080xxxxxxxx" class="input" />
          </div>
          <div style="margin-bottom:1.25rem;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:4px;">Password <span style="color:#9ca3af;font-weight:400;">(min 6 chars)</span></label>
            <input id="reg-password" type="password" placeholder="Choose a password" class="input" />
          </div>
          <button id="btn-register" class="btn btn-primary" style="width:100%;background:#00B875;color:white;border:none;">Create Account</button>
          <div id="reg-err" style="color:#ef4444;font-size:0.8rem;text-align:center;min-height:1.4em;margin-top:0.5rem;"></div>
        </div>
        <p style="text-align:center;font-size:0.85rem;color:#6b7280;margin-top:1rem;">
          Already have an account? <button id="btn-go-login" style="background:none;border:none;color:#00B875;font-weight:600;cursor:pointer;">Sign In</button>
        </p>
      </div>
    </div>`;

    container.querySelector('#btn-back').addEventListener('click', () => { mode = 'admin'; render(); });
    container.querySelector('#btn-go-login').addEventListener('click', () => { mode = 'user-login'; render(); });
    container.querySelector('#btn-register').addEventListener('click', async () => {
      const errEl = container.querySelector('#reg-err');
      errEl.textContent = '';
      const body = {
        full_name: container.querySelector('#reg-fullname').value.trim(),
        username: container.querySelector('#reg-username').value.trim(),
        email: container.querySelector('#reg-email').value.trim(),
        phone: container.querySelector('#reg-phone').value.trim(),
        password: container.querySelector('#reg-password').value,
      };
      if (!body.username || !body.email || !body.password) {
        errEl.textContent = 'Username, email and password are required';
        return;
      }
      try {
        const btn = container.querySelector('#btn-register');
        btn.textContent = 'Creating...';
        btn.disabled = true;
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.ok) {
          AuthState.isLoggedIn = true;
          AuthState.isAdmin = false;
          AuthState.username = data.user.username;
          AuthState.userId = data.user.id;
          toast.success('Account created! Welcome to OPay 🎉');
          await Auth.init();
          navigate('/dashboard');
        } else {
          errEl.textContent = data.error || 'Registration failed';
          btn.textContent = 'Create Account';
          btn.disabled = false;
        }
      } catch (e) {
        container.querySelector('#reg-err').textContent = 'Network error';
        container.querySelector('#btn-register').textContent = 'Create Account';
        container.querySelector('#btn-register').disabled = false;
      }
    });
  }

  render();
}

window.renderLoginPage = renderLoginPage;
