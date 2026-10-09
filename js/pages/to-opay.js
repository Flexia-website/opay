function renderToOpayPage(container) {
  let recipientInput = "";
  let recipientName = "";
  let amount = "";
  let showManualEntry = false;

  function render() {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;min-height:100vh;">
        <div style="padding:1rem;background:white;border-bottom:1px solid #e5e7eb;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h1 style="font-size:1.125rem;font-weight:700;margin:0;color:#111827;">Transfer to OPay Account</h1>
            <a href="#" style="color:#00B876;font-weight:600;font-size:0.9375rem;text-decoration:none;">History</a>
          </div>
        </div>

        <div class="pb-nav-safe" style="flex:1;overflow-y:auto;">
          <div style="padding:1rem;">
            <!-- Promo Card -->
            <div style="background:linear-gradient(135deg, #a0e0c4 0%, #6fd0b3 100%);border-radius:1rem;padding:1.5rem;margin-bottom:1.5rem;position:relative;overflow:hidden;">
              <div style="position:absolute;top:-10px;right:-10px;opacity:0.2;font-size:3rem;display:flex;align-items:center;justify-content:center;color:#ffffff;">${Icon('wallet', {size: 80})}</div>
              <div style="position:relative;z-index:1;">
                <h2 style="font-size:1.125rem;font-weight:800;margin:0;color:#1b3a2f;margin-bottom:0.5rem;">Claim 15 Discounts with</h2>
                <p style="font-size:2rem;font-weight:800;margin:0.5rem 0;color:#00B876;">₦99 on any Bill</p>
                <button style="background:#00B876;color:white;border:none;padding:0.75rem 1.5rem;border-radius:9999px;font-weight:600;font-size:0.875rem;cursor:pointer;margin-top:1rem;">Claim</button>
              </div>
            </div>

            <!-- Info Banner -->
            <div style="background:#e0f2fe;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;display:flex;gap:0.75rem;align-items:center;">
              <span style="display:flex;align-items:center;justify-content:center;color:#0369a1;">${Icon('star', {size: 18})}</span>
              <p style="font-size:0.875rem;color:#0369a1;font-weight:600;margin:0;">Instant, Zero Issues, Free</p>
            </div>

            <!-- Recipient Section -->
            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 1rem;">Recipient Account</h3>
              
              <div style="position:relative;margin-bottom:1rem;">
                <input id="recipient-input" type="text" placeholder="Phone No./OPay Account No./Name" value="${recipientInput}" style="width:100%;padding:0.875rem 2.75rem 0.875rem 0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;font-family:inherit;" />
                <button id="scan-btn" style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#6b7280;cursor:pointer;display:flex;align-items:center;justify-content:center;">${Icon('smartphone', {size: 18})}</button>
              </div>

              ${recipientInput && !showManualEntry ? `
                <div style="margin-bottom:1rem;">
                  <input id="recipient-name" type="text" placeholder="Recipient Name (Optional)" value="${recipientName}" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;font-family:inherit;margin-bottom:0.75rem;" />
                  <div style="margin-bottom:0.75rem;">
                    <label style="font-size:0.8125rem;color:#6b7280;display:block;margin-bottom:0.5rem;">Amount</label>
                    <input id="amount-input" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter amount" value="${amount}" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;font-family:inherit;" />
                  </div>
                  <button id="proceed-btn" style="width:100%;background:#00B876;color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:600;font-size:0.9375rem;cursor:pointer;">Proceed</button>
                </div>
              ` : ''}

              <a href="#" style="color:#00B876;font-size:0.875rem;font-weight:600;text-decoration:none;">Don't know the recipient's OPay account number? Ask them ></a>
            </div>

            <!-- Recents/Favourites -->
            <div>
              <div style="display:flex;gap:2rem;margin-bottom:1rem;border-bottom:1px solid #e5e7eb;">
                <button style="padding:0.75rem 0;background:none;border:none;border-bottom:2px solid #00B876;color:#111827;font-weight:700;font-size:0.9375rem;cursor:pointer;">Recents</button>
                <button style="padding:0.75rem 0;background:none;border:none;color:#6b7280;font-weight:500;font-size:0.9375rem;cursor:pointer;">Favourites</button>
              </div>

              <div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid #f3f4f6;cursor:pointer;">
                <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:linear-gradient(135deg, #3b82f6, #1e40af);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.875rem;">O</div>
                <div style="flex:1;">
                  <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">OKECHUKWU PETER ONUMA</p>
                  <p style="font-size:0.8125rem;color:#6b7280;margin:0.25rem 0 0;">812 536 8056</p>
                </div>
                <span style="background:#e0f2fe;color:#0369a1;padding:0.25rem 0.75rem;border-radius:0.5rem;font-size:0.75rem;font-weight:600;margin-left:auto;">BizPayment</span>
              </div>

              <div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid #f3f4f6;cursor:pointer;">
                <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#6b7280;">${Icon('user', {size: 18})}</div>
                <div style="flex:1;">
                  <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">LEDESI VICTOR</p>
                  <p style="font-size:0.8125rem;color:#6b7280;margin:0.25rem 0 0;">808 374 6522</p>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;cursor:pointer;">
                <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:linear-gradient(135deg, #06b6d4, #0891b2);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.875rem;">O</div>
                <div style="flex:1;">
                  <p style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;">ONYEKACHI GODDAY UGOCHUKWU</p>
                  <p style="font-size:0.8125rem;color:#6b7280;margin:0.25rem 0 0;">610 727 2666</p>
                </div>
                <span style="background:#e0f2fe;color:#0369a1;padding:0.25rem 0.75rem;border-radius:0.5rem;font-size:0.75rem;font-weight:600;">BizPayment</span>
              </div>

              <p style="text-align:center;color:#6b7280;font-size:0.875rem;margin:1.5rem 0 0;cursor:pointer;padding:1rem;">View All ›</p>
            </div>

            <!-- See who else is using OPay -->
            <div style="background:white;border:1px solid #e5e7eb;border-radius:0.75rem;padding:1rem;margin-top:1.5rem;display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
              <span style="font-size:1.5rem;">👥</span>
              <div style="flex:1;">
                <p style="font-size:0.9375rem;font-weight:600;color:#111827;margin:0;">See who else is using OPay</p>
                <p style="font-size:0.75rem;color:#6b7280;margin:0.25rem 0 0;">Send money to your contacts for free</p>
              </div>
              <span style="color:#00B876;">›</span>
            </div>

            <!-- More Events -->
            <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:1.5rem 0 1rem;">More Events</h3>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const recipientInp = container.querySelector('#recipient-input');
    const recipientNameInp = container.querySelector('#recipient-name');
    const proceedBtn = container.querySelector('#proceed-btn');
    const scanBtn = container.querySelector('#scan-btn');

    if (recipientInp) {
      recipientInp.addEventListener('input', (e) => {
        recipientInput = e.target.value;
        render();
      });
    }

    if (recipientNameInp) {
      recipientNameInp.addEventListener('input', (e) => {
        recipientName = e.target.value;
      });
    }

    const amountInp = container.querySelector('#amount-input');
    if (amountInp) {
      amountInp.addEventListener('input', (e) => {
        amount = e.target.value;
      });
    }

    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        if (!recipientInput) {
          alert('Please enter recipient account or phone number');
          return;
        }
        if (!amount) {
          alert('Please enter amount');
          return;
        }
        showPaymentModal(recipientInput, recipientName, amount);
      });
    }

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        alert('Scan QR or contact feature coming soon');
      });
    }
  }

  function showPaymentModal(recipient, name, amt) {
    // Show confirmation page instead of payment method modal
    showOpayConfirmation(recipient, name, amt);
  }

  function showOpayConfirmation(recipient, name, amt) {
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
            <div style="width:3.25rem;height:3.25rem;border-radius:9999px;background:linear-gradient(135deg, #3b82f6, #1e40af);display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;color:white;font-weight:700;font-size:0.875rem;">
              ${(name || recipient).charAt(0).toUpperCase()}
            </div>
            <p style="font-size:0.9375rem;color:#111827;margin:0 0 0.75rem;font-weight:600;">${name || recipient}</p>
            <div style="font-size:1.875rem;font-weight:800;color:#111827;margin-bottom:0.5rem;letter-spacing:-0.01em;">₦${formatMoney(amt)}</div>
            <p style="font-size:0.75rem;color:#6b7280;margin:0;">OPay Transfer</p>
          </div>
        </div>

        <div style="margin:1rem;padding:1.25rem;background:white;border-radius:0.75rem;border:1px solid #e5e7eb;">
          <h3 style="font-size:1rem;font-weight:700;margin:0 0 1rem;color:#111827;">Transfer Details</h3>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;border-bottom:1px solid #f3f4f6;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Recipient</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;">${name || recipient}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.875rem 0;">
            <div style="color:#6b7280;font-size:0.8125rem;font-weight:500;">Amount</div>
            <div style="text-align:right;font-weight:700;font-size:0.875rem;color:#111827;">₦${formatMoney(amt)}</div>
          </div>
        </div>

        <div style="margin:1rem;padding:1rem;background:#dbeafe;border-radius:0.75rem;border-left:4px solid #0369a1;">
          <p style="font-size:0.8125rem;color:#082f49;margin:0;font-weight:500;">Instant transfer to OPay account. Zero fees, instant delivery.</p>
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
        recipientLabel: `${name || recipient}`,
        onConfirm: () => {
          showTransactionSuccess(recipient, name, amt);
        }
      });
    });
  }



  function showTransactionSuccess(recipient, name, amt) {
    const txId = Date.now().toString().slice(-12);
    const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    Stores.transaction.addTransaction({
      type: `Transfer to ${name || recipient}`,
      amount: `-₦${formatMoney(amt)}`,
      status: 'Successful',
      icon: 'send'
    });
    Stores.balance.set(s => ({ balance: s.balance - parseFloat(amt) }));
    showTransactionReceipt({
      title: `Transfer to ${name || recipient}`,
      amount: `-₦${formatMoney(amt)}`,
      success: true,
      date: new Date().toLocaleString(),
      details: [
        { label: 'Recipient Details', value: name || recipient },
        { label: 'Transaction No.', value: txId },
        { label: 'Transaction Type', value: 'OPay Transfer' },
        { label: 'Payment Method', value: 'OWealth' },
        { label: 'Transaction Date', value: new Date().toLocaleString() },
        { label: 'Session ID', value: sessionId }
      ],
      variant: 'tracker',
      onClose: () => navigate('/dashboard')
    });
  }

  render();
}

window.renderToOpayPage = renderToOpayPage;
