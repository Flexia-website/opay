// Account Number Verification Service
// Simulates real bank verification APIs (in production, use actual bank APIs)

const MOCK_ACCOUNTS = {
  // Format: "bankCode-accountNumber": { name, account_name, account_number }
  "044-0123456789": { name: "OKECHUKWU PETER ONUMA", bank_code: "044", bank: "Access Bank" },
  "058-0987654321": { name: "SEAGAMY BUKKY ADEDEJI", bank_code: "058", bank: "GTB" },
  "011-1111111111": { name: "ROSE EJIOFOR", bank_code: "011", bank: "First Bank" },
  "033-2222222222": { name: "CLINTON EJIOFOR-BENJAMIN", bank_code: "033", bank: "UBA" },
  "039-3333333333": { name: "ENYINNAYA ONYINYECHI", bank_code: "039", bank: "Stanbic IBTC" },
  "070-4444444444": { name: "LEDESI VICTOR", bank_code: "070", bank: "FCMB" },
  "057-5555555555": { name: "HAMINA NIKE AZEEZ", bank_code: "057", bank: "Zenith Bank" },
  "050-6666666666": { name: "ANDREW ONWUME", bank_code: "050", bank: "Eco Bank" },
  "032-7777777777": { name: "JOHN OKAFOR", bank_code: "032", bank: "Union Bank" },
  "035-8888888888": { name: "FATIMA AHMED", bank_code: "035", bank: "Wema Bank" }
};

function verifyAccountNumber(accountNumber, bankCode) {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const key = `${bankCode}-${accountNumber}`;
      const account = MOCK_ACCOUNTS[key];

      if (account) {
        resolve({
          success: true,
          account_name: account.name,
          account_number: accountNumber,
          bank: account.bank,
          bank_code: bankCode
        });
      } else {
        reject({
          success: false,
          error: "Account not found or invalid",
          message: "Please verify the account number and bank"
        });
      }
    }, 800);
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
          <span style="font-size:1.5rem;">⏳</span>
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
          <span style="font-size:2rem;">✓</span>
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
          <span style="font-size:2rem;">✕</span>
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
