function renderLoginPage(container) {
  let isVerifying = false;
  let showPasswordLogin = true;
  let showPinLogin = false;
  let password = "";
  let showPassword = false;

  function logoHtml() {
    return `<div style="height:2.5rem;display:flex;align-items:center;justify-content:center;gap:5px;"><img src="./icons/icon-192.png" alt="Logo" style="height:2rem;width:auto;object-fit:contain;" /><span style="font-size:1.375rem;font-weight:800;color:var(--opay-primary);">Pay</span></div>`;
  }

  function avatarHtml(size) {
    size = size || "3.25rem";
    const { profilePhoto } = Stores.customization.get();
    if (profilePhoto) {
      return `<div style="width:${size};height:${size};border-radius:9999px;margin-bottom:0.625rem;display:flex;align-items:center;justify-content:center;"><img src="${profilePhoto}" alt="Profile" style="width:100%;height:100%;object-fit:contain;display:block;" /></div>`;
    }
    return `<div style="width:${size};height:${size};background:black;border-radius:9999px;margin-bottom:0.625rem;display:flex;align-items:center;justify-content:center;"><span style="color:white;">${Icon("user", { size: 20 })}</span></div>`;
  }

  function renderPinLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;align-items:center;padding:2rem 3.25rem;">
      <div style="position:sticky;top:0;background:white;z-index:10;padding:1rem 0;margin-bottom:3rem;">${logoHtml()}</div>
      <div id="dialpad-mount"></div>
    </div>`;
    renderDialPad(container.querySelector("#dialpad-mount"), {
      title: "Enter your PIN",
      onCancel: () => {
        showPinLogin = false;
        render();
      },
      onComplete: (pin) => {
        if (pin === "0803") {
          localStorage.setItem("pinLoginUsed", "true");
          navigate("/dashboard");
        } else {
          alert("Incorrect PIN");
        }
      },
    });
  }

  function renderPasswordLogin() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;align-items:center;padding:1.5rem 2rem 1rem;font-size:1rem;">
      <div style="position:sticky;top:0;background:white;z-index:10;padding:0.75rem 0;margin-bottom:2rem;width:100%;text-align:center;">${logoHtml()}</div>
      <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
        ${avatarHtml("3.25rem")}
        <h2 style="font-size:calc(0.875rem * 1);font-weight:500;text-align:center;margin:0 0 2rem;color:#111827;">CLINTON (816****049)</h2>

        <div style="width:100%;display:flex;flex-direction:column;gap:0;">
          <div style="position:relative;width:100%;">
            <input id="pw-input" type="${showPassword ? "text" : "password"}" readonly value="${password}" placeholder="••••••"
              style="width:100%;height:calc(2.5rem * 1);padding:0 calc(2.25rem * 1) 0 calc(0.875rem * 1);border-radius:16px;border:1.5px solid #d1d5db;outline:none;font-size:calc(0.875rem * 1);background:white;letter-spacing:0.15em;" />
            <button id="toggle-pw" style="position:absolute;right:calc(0.875rem * 1);top:50%;transform:translateY(-50%);background:none;border:none;color:#6b7280;cursor:pointer;display:flex;align-items:center;">${Icon(showPassword ? "eye" : "eye-off", { size: 16 })}</button>
          </div>
          <div style="display:flex;justify-content:flex-end;margin:calc(0.375rem * 1) 0 calc(1rem * 1);padding:0;">
            <button id="forgot-password-btn" style="font-size:calc(0.75rem * 1);color:var(--opay-primary);font-weight:500;background:none;border:none;cursor:pointer;">Forgot Password?</button>
          </div>
          <button id="login-submit" ${password.length < 6 ? "disabled" : ""} style="width:100%;height:calc(2.5rem * 1);border-radius:9999px;color:white;font-size:calc(0.875rem * 1);font-weight:500;border:none;cursor:pointer;background:${
            password.length < 6 ? "rgba(0,189,106,0.5)" : "var(--opay-primary)"
          };">Login</button>

          <div style="display:flex;flex-direction:column;align-items:center;margin-top:calc(1.25rem * 1);gap:calc(0.625rem * 1);">
            <button id="switch-fingerprint" style="font-size:calc(0.75rem * 1);color:var(--opay-primary);font-weight:500;background:none;border:none;cursor:pointer;padding:0.5rem 1rem;border-radius:8px;transition:background 0.2s;">Switch to Fingerprint</button>
          </div>
        </div>
      </div>
    </div>`;

    container.querySelector("#toggle-pw").addEventListener("click", () => {
      showPassword = !showPassword;
      renderPasswordLogin();
    });
    const submitBtn = container.querySelector("#login-submit");
    if (!submitBtn.disabled) submitBtn.addEventListener("click", handlePasswordLogin);
    container.querySelector("#switch-fingerprint").addEventListener("click", () => {
      showPasswordLogin = false;
      showPinLogin = false;
      render();
    });
    const forgotBtn = container.querySelector("#forgot-password-btn");
    if (forgotBtn) forgotBtn.addEventListener("click", () => {
      toast.success("Password reset link sent to your registered email/phone");
    });
    const pwInput = container.querySelector("#pw-input");
    pwInput.addEventListener("focus", () => {
      if (pwInput._keypadOpen) return;
      if (pwInput._keypadCooldown) return;
      pwInput._keypadOpen = true;
      openNumericKeypad({
        decimal: false,
        maxLength: 6,
        value: password,
        onInput: (v) => {
          password = v;
          pwInput.value = password;
          const btn = container.querySelector("#login-submit");
          if (btn) {
            btn.disabled = password.length < 6;
            btn.style.background = password.length < 6 ? "rgba(0,189,106,0.5)" : "var(--opay-primary)";
          }
        },
        onComplete: () => handlePasswordLogin(),
        onClose: () => {
          pwInput._keypadOpen = false;
          pwInput._keypadCooldown = true;
          pwInput.blur();
          setTimeout(() => {
            pwInput._keypadCooldown = false;
          }, 400);
        },
      });
    });
    pwInput.focus();
  }

  function handlePasswordLogin() {
    if (window.Api) {
      Api.login('password', password).then((data) => {
        if (data && data.ok) {
          window.__IS_ADMIN = true;
          Api.syncState();
          navigate('/dashboard');
        } else {
          alert('Incorrect password');
        }
      }).catch(() => {
        if (password === '147852') navigate('/dashboard');
        else alert('Incorrect password');
      });
      return;
    }
    if (password === "147852") {
      navigate("/dashboard");
    } else {
      alert("Incorrect password");
    }
  }

  function renderFingerprint() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;display:flex;flex-direction:column;align-items:center;padding:2.5rem 3.25rem calc(2rem + env(safe-area-inset-bottom, 0px));">
      <div style="margin-bottom:2.75rem;">${logoHtml()}</div>

      ${avatarHtml("3.5rem")}

      <h2 style="font-size:0.9375rem;font-weight:400;text-align:center;margin:0 0 3rem;color:#111827;">CLINTON (816****049)</h2>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <button id="fingerprint-btn" style="width:3.5rem;height:3.5rem;border-radius:0.75rem;display:flex;align-items:center;justify-content:center;border:none;background:white;padding:0;">
          <span style="color:#374151;${isVerifying ? "opacity:0.7;" : ""}" class="${isVerifying ? "animate-pulse" : ""}">${Icon("fingerprint", { size: 46, class: "" })}</span>
        </button>
        <p style="color:var(--opay-primary);font-weight:400;font-size:0.9375rem;margin:0;">Click to log in with Fingerprint</p>
        <button id="verify-btn" style="margin-top:0.5rem;background:var(--opay-primary);color:white;font-weight:600;border-radius:9999px;padding:0.625rem 1.75rem;font-size:0.9375rem;border:none;">Verify Fingerprint</button>
      </div>

      <div style="margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.875rem;">
          <button id="switch-account" style="font-size:0.8125rem;background:none;border:none;color:var(--opay-primary);">Switch Account</button>
          <div style="width:1px;height:0.875rem;background:#d1d5db;"></div>
          <button id="login-password-btn" style="font-size:0.8125rem;background:none;border:none;color:var(--opay-primary);">Login with Password</button>
        </div>
      </div>
    </div>`;

    async function handleFingerprint() {
      isVerifying = true;
      renderFingerprint();
      
      try {
        // Check if WebAuthn is available
        if (!window.PublicKeyCredential) {
          throw new Error("WebAuthn not supported");
        }
        
        // Check if device has fingerprint sensor
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (!available) {
          isVerifying = false;
          alert("Fingerprint sensor not available on this device");
          render();
          return;
        }
        
        // Request fingerprint verification
        const options = {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "required",
          mediation: "optional"
        };
        
        const assertion = await navigator.credentials.get({ publicKey: options });
        
        if (assertion) {
          isVerifying = false;
          if (window.Api) { Api.login('fingerprint').then(d => { if(d&&d.ok){window.__IS_ADMIN=true;Api.syncState();} }); }
          navigate("/dashboard");
          return;
        }
        
        isVerifying = false;
        alert("Fingerprint not recognized. Try again.");
        render();
        
      } catch (error) {
        isVerifying = false;
        
        if (error.name === "NotAllowedError" || error.name === "InvalidStateError") {
          // Fallback: Simulate fingerprint verification for passkey errors
          setTimeout(() => {
            if (Math.random() > 0.1) {
              navigate("/dashboard");
            } else {
              alert("Fingerprint not recognized. Try again.");
              render();
            }
          }, 1500);
          return;
        } else if (error.name === "SecurityError" || error.name === "AbortError") {
          alert("Fingerprint verification cancelled. Try again.");
        } else if (error.message === "WebAuthn not supported") {
          // Fallback: Simulate fingerprint verification
          setTimeout(() => {
            if (Math.random() > 0.1) {
              navigate("/dashboard");
            } else {
              alert("Fingerprint not recognized. Try again.");
              render();
            }
          }, 1500);
          return;
        } else {
          // Fallback for unknown errors
          setTimeout(() => {
            if (Math.random() > 0.1) {
              navigate("/dashboard");
            } else {
              alert("Fingerprint not recognized. Try again.");
              render();
            }
          }, 1500);
          return;
        }
        
        render();
      }
    }

    container.querySelector("#fingerprint-btn").addEventListener("click", handleFingerprint);
    container.querySelector("#verify-btn").addEventListener("click", handleFingerprint);
    container.querySelector("#switch-account").addEventListener("click", () => navigate("/me"));
    container.querySelector("#login-password-btn").addEventListener("click", () => {
      showPasswordLogin = true;
      showPinLogin = false;
      render();
    });
  }

  function render() {
    if (showPinLogin) renderPinLogin();
    else if (showPasswordLogin) renderPasswordLogin();
    else renderFingerprint();
  }

  render();
}

window.renderLoginPage = renderLoginPage;
