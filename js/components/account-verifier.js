// Account Number Verification Service
// Uses NubAPI (nubapi.com) — free Nigerian bank account name lookup
// Requires NUBAPI_TOKEN env var on the server (get free token at nubapi.com)

function verifyAccountNumber(accountNumber, bankCode) {
  return fetch(
    `/api/verify-account?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
    { credentials: 'include' }
  )
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.ok) {
        return {
          success: true,
          account_name: data.account_name,
          account_number: data.account_number || accountNumber,
          bank: data.bank_name || '',
          bank_code: data.bank_code || bankCode,
        };
      }
      return Promise.reject({ success: false, error: data.error || 'Verification failed', message: data.error || 'Please verify the account number and bank' });
    })
    .catch(function(err) {
      if (err && err.success === false) return Promise.reject(err);
      return Promise.reject({ success: false, error: 'Network error', message: 'Could not reach verification service' });
    });
}

// Show account verification modal
function showAccountVerification(accountNumber, bankCode, onConfirm, onError) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "2000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "1rem";

  overlay.innerHTML = `
    <div style="background:white;border-radius:1rem;padding:2rem;width:100%;max-width:20rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="display:inline-block;width:3rem;height:3rem;background:#f0fdf4;border-radius:9999px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B875" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke="#e5e7eb"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#00B875"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
        </div>
        <p style="font-size:0.9375rem;color:#6b7280;margin:0;">Verifying account...</p>
      </div>
      <div style="width:100%;height:2px;background:#f3f4f6;border-radius:9999px;overflow:hidden;">
        <div style="width:100%;height:100%;background:#00B876;animation:progress 1.5s ease-in-out infinite;border-radius:9999px;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  verifyAccountNumber(accountNumber, bankCode)
    .then((result) => {
      overlay.remove();
      showVerificationResult(result, onConfirm, onError);
    })
    .catch((error) => {
      overlay.remove();
      showVerificationError(error, onError);
    });
}

function showVerificationResult(account, onConfirm, onError) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "2000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "1rem";

  overlay.innerHTML = `
    <div style="background:white;border-radius:1rem;padding:2rem;width:100%;max-width:20rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="display:inline-block;width:3.5rem;height:3.5rem;background:#ecfdf5;border-radius:9999px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;border:2px solid #10b981;">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style="font-size:1.125rem;font-weight:700;color:#111827;margin:0;margin-bottom:0.5rem;">Account Verified</h2>
        <p style="font-size:0.875rem;color:#6b7280;margin:0;">Account details confirmed</p>
      </div>

      <div style="background:#f9fafb;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;">
        <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.5rem;font-weight:500;">ACCOUNT NAME</p>
        <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;margin-bottom:1rem;word-break:break-word;">${account.account_name}</p>

        <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.5rem;font-weight:500;">ACCOUNT NUMBER</p>
        <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;margin-bottom:1rem;">${account.account_number}</p>

        <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.5rem;font-weight:500;">BANK</p>
        <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">${account.bank}</p>
      </div>

      <div style="display:flex;gap:0.75rem;">
        <button id="verify-cancel" style="flex:1;padding:0.75rem;border:1px solid #e5e7eb;background:white;border-radius:0.75rem;font-weight:600;color:#111827;cursor:pointer;font-size:0.9375rem;">Cancel</button>
        <button id="verify-confirm" style="flex:1;padding:0.75rem;background:#00B876;color:white;border:none;border-radius:0.75rem;font-weight:600;cursor:pointer;font-size:0.9375rem;">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#verify-cancel").addEventListener("click", () => {
    overlay.remove();
  });

  overlay.querySelector("#verify-confirm").addEventListener("click", () => {
    overlay.remove();
    if (onConfirm) onConfirm(account);
  });
}

function showVerificationError(error, onError) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "2000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "1rem";

  overlay.innerHTML = `
    <div style="background:white;border-radius:1rem;padding:2rem;width:100%;max-width:20rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="display:inline-block;width:3.5rem;height:3.5rem;background:#fef2f2;border-radius:9999px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;border:2px solid #ef4444;">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <h2 style="font-size:1.125rem;font-weight:700;color:#111827;margin:0;margin-bottom:0.5rem;">Verification Failed</h2>
        <p style="font-size:0.875rem;color:#6b7280;margin:0;">${error.message || error.error}</p>
      </div>

      <button id="error-close" style="width:100%;padding:0.75rem;background:#00B876;color:white;border:none;border-radius:0.75rem;font-weight:600;cursor:pointer;font-size:0.9375rem;">Try Again</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#error-close").addEventListener("click", () => {
    overlay.remove();
    if (onError) onError();
  });
}

window.verifyAccountNumber = verifyAccountNumber;
window.showAccountVerification = showAccountVerification;

// Add CSS for loading animation
if (!document.getElementById('verifier-styles')) {
  const style = document.createElement('style');
  style.id = 'verifier-styles';
  style.textContent = `
    @keyframes progress {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }
  `;
  document.head.appendChild(style);
}
