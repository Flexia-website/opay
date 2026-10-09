function renderToBankPage(container) {
  let selectedBank = "";
  let selectedBankCode = "";
  let accountNumber = "";
  let accountName = "";
  let amount = "";
  let verifiedAccount = null;

  function render() {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;min-height:100vh;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem;background:white;border-bottom:1px solid #e5e7eb;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <button id="back-btn" style="background:none;border:none;color:#111827;cursor:pointer;display:flex;align-items:center;justify-content:center;">${Icon('chevron-left', {size: 20})}</button>
            <h1 style="font-size:1.125rem;font-weight:700;margin:0;color:#111827;">Transfer to Bank Account</h1>
          </div>
          <a href="#" style="color:#00B876;font-weight:600;font-size:0.9375rem;text-decoration:none;">History</a>
        </div>

        <div class="pb-nav-safe" style="flex:1;overflow-y:auto;">
          <div style="padding:1rem;">
            <!-- Promo Card -->
            <div style="background:linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem;color:white;position:relative;overflow:hidden;">
              <div style="position:absolute;top:-20px;right:-20px;opacity:0.1;font-size:3rem;display:flex;align-items:center;justify-content:center;color:#ffffff;">${Icon('thumbs-up', {size: 80})}</div>
              <div style="position:relative;z-index:1;">
                <p style="font-size:0.8125rem;margin:0 0 0.5rem;opacity:0.9;">Largest & Fastest & Lowest Fees</p>
                <h2 style="font-size:1.25rem;font-weight:800;margin:0.5rem 0;color:white;">OPay is Okay · Easy Payment</h2>
                <button style="background:#00B876;color:white;border:none;padding:0.5rem 1.5rem;border-radius:9999px;font-weight:600;font-size:0.875rem;cursor:pointer;margin-top:1rem;">Try Now</button>
              </div>
            </div>

            <!-- Free transfers info -->
            <div style="background:#f3e8ff;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;display:flex;gap:0.75rem;">
              <span style="display:flex;align-items:center;justify-content:center;color:#7c3aed;">${Icon('zap', {size: 18})}</span>
              <div>
                <p style="font-size:0.875rem;font-weight:700;color:#7c3aed;margin:0;">Free transfers for the day: 3</p>
              </div>
            </div>

            <!-- Recipient Account Section -->
            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 1rem;">Recipient Account</h3>
              
              <input id="account-input" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter Account Number" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;margin-bottom:0.75rem;font-family:inherit;" />
              
              <input id="account-name-input" type="text" placeholder="Recipient Name" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;margin-bottom:1rem;font-family:inherit;" />

              <div id="bank-select" style="padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:white;margin-bottom:1rem;">
                <span style="color:${selectedBank ? '#111827' : '#9ca3af'};font-size:0.9375rem;">${selectedBank || 'Select Bank'}</span>
                <span style="color:#00B876;">›</span>
              </div>

              <div style="margin-bottom:1rem;">
                <label style="font-size:0.8125rem;color:#6b7280;display:block;margin-bottom:0.5rem;">Amount</label>
                <input id="amount-input" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter amount" value="${amount}" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;font-family:inherit;" />
              </div>

              <!-- Account Name Display (after verification) -->
              ${verifiedAccount ? `
                <div style="background:#ecfdf5;border:1px solid #86efac;border-radius:0.75rem;padding:1rem;margin-bottom:1rem;">
                  <p style="font-size:0.75rem;color:#6b7280;margin:0 0 0.5rem;font-weight:500;">VERIFIED ACCOUNT NAME</p>
                  <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">${verifiedAccount.account_name}</p>
                  <p style="font-size:0.75rem;color:#6b7280;margin:0.5rem 0 0;display:flex;align-items:center;gap:0.25rem;"><span style="display:flex;align-items:center;justify-content:center;color:#16a34a;">${Icon('check', {size: 14})}</span> Account verified successfully</p>
                </div>
              ` : ''}

              <button id="next-btn" style="width:100%;background:#a0e0c4;color:white;border:none;padding:1rem;border-radius:9999px;font-weight:700;font-size:1rem;margin-top:1.5rem;cursor:pointer;transition:background 0.2s;">${verifiedAccount ? 'Continue' : 'Verify Account'}</button>
            </div>

            <!-- Bank Transfer Success Rate Monitor -->
            <div style="background:white;border:1px solid #e5e7eb;border-radius:0.75rem;padding:1rem;display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;cursor:pointer;">
              <span style="display:flex;align-items:center;justify-content:center;color:#00B876;">${Icon('bar-chart-2', {size: 18})}</span>
              <div>
                <p style="font-size:0.875rem;font-weight:700;color:#111827;margin:0;">Bank Transfer Success Rate Monitor</p>
              </div>
              <span style="margin-left:auto;color:#00B876;">›</span>
            </div>

            <!-- Recents -->
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">Recents</h3>
                <span style="color:#00B876;font-size:0.8125rem;font-weight:600;">Favourites</span>
              </div>

              <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1px solid #e5e7eb;border-radius:0.75rem;margin-bottom:0.75rem;cursor:pointer;">
                <div style="width:2.5rem;height:2.5rem;border-radius:9999px;background:#e0f2fe;display:flex;align-items:center;justify-content:center;color:#0369a1;">${Icon('user', {size: 16})}</div>
                <div style="flex:1;">
                  <p style="font-size:0.875rem;font-weight:600;color:#111827;margin:0;">POS Transfer-ANDREW - ONWUME</p>
                  <p style="font-size:0.75rem;color:#6b7280;margin:0.25rem 0 0;">5995280278 MONIE POINT</p>
                </div>
                <div style="width:2rem;height:2rem;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;">M</div>
              </div>

              <div style="display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1px solid #e5e7eb;border-radius:0.75rem;">
                <div style="width:2.5rem;height:2.5rem;border-radius:9999px;background:#e0f2fe;display:flex;align-items:center;justify-content:center;color:#0369a1;">${Icon('user', {size: 16})}</div>
                <div style="flex:1;">
                  <p style="font-size:0.875rem;font-weight:600;color:#111827;margin:0;">ROSE EJIOFOR</p>
                  <p style="font-size:0.75rem;color:#6b7280;margin:0.25rem 0 0;">8160881049 Momo Payment Service B...</p>
                </div>
                <div style="width:2rem;height:2rem;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;color:white;">${Icon('building-2', {size: 14})}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("back-btn").addEventListener("click", () => navigate("/"));
    document.getElementById("bank-select").addEventListener("click", () => {
      showBankSelector((bank) => {
        selectedBank = bank;
        // Get bank code from NIGERIAN_BANKS
        const bankData = NIGERIAN_BANKS.find(b => b.name === bank);
        selectedBankCode = bankData ? bankData.code : "";
        render();
      });
    });

    document.getElementById("account-input").addEventListener("input", (e) => {
      accountNumber = e.target.value;
      verifiedAccount = null;
    });

    const nameInput = document.getElementById("account-name-input");
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        accountName = e.target.value;
      });
    }

    const amountInp = document.getElementById("amount-input");
    if (amountInp) {
      amountInp.addEventListener("input", (e) => {
        amount = e.target.value;
      });
    }

    document.getElementById("next-btn").addEventListener("click", () => {
      if (!accountNumber) {
        alert("Please enter an account number");
        return;
      }
      if (!selectedBank) {
        alert("Please select a bank");
        return;
      }
      if (!accountName) {
        alert("Please enter recipient name");
        return;
      }
      if (!amount) {
        alert("Please enter amount");
        return;
      }
      
      // Skip verification, go directly to payment method
      verifiedAccount = { account_name: accountName };
      showBankPaymentModal(accountNumber, selectedBank, accountName, amount);
    });
  }

  function showBankPaymentModal(account, bank, name, amt) {
    // Show confirmation page instead of payment method modal
    showBankConfirmation(account, bank, name, amt);
  }

  function showBankConfirmation(account, bank, name, amt) {
    const bankData = NIGERIAN_BANKS.find(b => b.name === bank);
    const bankLogo = bankData ? bankData.logo : null;
    
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#f9fafb;display:flex;flex-direction:column;z-index:1000;overflow-y:auto;';
    
    modal.innerHTML = `
      <header style="background:white;padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e5e7eb;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <button id="back-btn-confirm" style="background:none;border:none;color:#111827;cursor:pointer;display:flex;align-items:center;justify-content:center;">${Icon('chevron-left', {size: 20})}</button>
          <h1 style="font-size:1.0625rem;font-weight:700;margin:0;color:#111827;">Confirm Transfer</h1>
        </div>
        <span style="color:#00B876;">${Icon('user', {size: 20})}</span>
      </header>

      <div style="flex:1;overflow-y:auto;">
        <div style="position:relative;margin:0 1rem;margin-top:-2rem;padding-bottom:1rem;">
          <div style="margin:0;overflow:visible;padding:0;position:relative;z-index:1;background:white;border-radius:0.75rem;padding:1rem;text-align:center;">
            <div style="width:3.25rem;height:3.25rem;border-radius:9999px;background:white;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;overflow:hidden;border:1px solid #e5e7eb;">
              ${bankLogo ? `<img src="${bankLogo}" loading="eager" decoding="async" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:contain;padding:0.25rem;" onerror="handleBankLogoError(this)" />` : `<span style="color:#111827;">${Icon('building-2', {size: 22})}</span>`}
            </div>
            <p style="font-size:0.9375rem;color:#111827;margin:0 0 0.75rem;font-weight:600;">${name}</p>
            <div style="font-size:1.875rem;font-weight:800;color:#111827;margin-bottom:0.5rem;letter-spacing:-0.01em;">₦${formatMoney(amt)}</div>
            <p style="font-size:0.75rem;color:#6b7280;margin:0;">To ${bank}</p>
          </div>
        </div>

        <div style="margin:1rem;padding:1.25rem;background:white;border-radius:0.75rem;border:1px solid #e5e7eb;">
          <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;color:#111827;">Transfer Details</h3>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;border-bottom:1px solid #f3f4f6;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Bank</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;">${bank}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;border-bottom:1px solid #f3f4f6;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Account Name</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;">${name}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;border-bottom:1px solid #f3f4f6;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Account Number</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;font-family:monospace;">${account}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Amount</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;">₦${formatMoney(amt)}</div>
          </div>
        </div>

        <div style="margin:1rem;padding:1rem;background:#fef3c7;border-radius:0.75rem;border-left:4px solid #f59e0b;">
          <p style="font-size:0.8125rem;color:#92400e;margin:0;font-weight:500;">All bank transfers are final. Please verify details carefully.</p>
        </div>
      </div>

      <div style="padding:1rem;background:white;border-top:1px solid #e5e7eb;display:flex;gap:0.75rem;">
        <button id="cancel-confirm" style="flex:1;padding:1rem;background:#f3f4f6;color:#111827;border:none;border-radius:0.75rem;font-weight:700;cursor:pointer;">Cancel</button>
        <button id="proceed-pin" style="flex:1;padding:1rem;background:#00B876;color:white;border:none;border-radius:0.75rem;font-weight:700;cursor:pointer;">Continue to PIN</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('back-btn-confirm').addEventListener('click', () => modal.remove());
    document.getElementById('cancel-confirm').addEventListener('click', () => modal.remove());
    
    document.getElementById('proceed-pin').addEventListener('click', () => {
      modal.remove();
      showPinModal({
        amount: amt,
        recipientLabel: `${name} - ${bank}`,
        onConfirm: () => {
          showBankTransactionSuccess(account, bank, name, amt);
        }
      });
    });
  }



  function showBankTransactionSuccess(account, bank, name, amt) {
    const txId = Date.now().toString().slice(-12);
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const bankData = NIGERIAN_BANKS.find(b => b.name === bank);
    const bankLogo = bankData ? bankData.logo : null;
    
    Stores.transaction.addTransaction({
      type: `Transfer to ${name}`,
      amount: `-₦${formatMoney(amt)}`,
      status: 'Successful',
      icon: 'building-2'
    });
    Stores.balance.set(s => ({ balance: s.balance - parseFloat(amt) }));
    showTransactionReceipt({
      title: `${bank}`,
      amount: `-₦${formatMoney(amt)}`,
      success: true,
      date: new Date().toLocaleString(),
      details: [
        { label: 'Recipient Details', value: `${name}<br/>${bank} | ${account}` },
        { label: 'Transaction No.', value: txId },
        { label: 'Payment Method', value: 'OWealth' },
        { label: 'Transaction Date', value: new Date().toLocaleString() },
        { label: 'Session ID', value: sessionId }
      ],
      variant: 'tracker',
      recipientIcon: bankLogo,
      onClose: () => navigate('/dashboard')
    });
  }

  render();
}

window.renderToBankPage = renderToBankPage;
