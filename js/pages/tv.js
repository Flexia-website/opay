function renderTvPage(container) {
  let activeTab = "hot";

  const plans = {
    hot: [
      { name: "DStv Renewal", placeholder: "Enter amount", badge: null },
      { name: "DStv Yanga", price: "₦5,950", oldPrice: "₦6,000", period: "1 Month" },
      { name: "DStv Compact", price: "₦18,950", oldPrice: "₦19,000", period: "1 Month" },
      { name: "DStv Stream Premium", price: null, period: "1 Month" }
    ],
    premium: [
      { name: "DStv Padi", price: "₦4,350", oldPrice: "₦4,400", period: "1 Month" },
      { name: "DStv Confam", price: "₦10,950", oldPrice: "₦11,000", period: "1 Month" },
      { name: "DStv Compact Plus", price: "₦29,950", oldPrice: "₦30,000", period: "1 Month" }
    ]
  };

  function render() {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;min-height:100vh;">
        <div style="padding:1rem;background:white;border-bottom:1px solid #e5e7eb;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
            <h1 style="font-size:1.125rem;font-weight:700;margin:0;color:#111827;">TV</h1>
            <a href="#" style="color:#00B876;font-weight:600;font-size:0.9375rem;text-decoration:none;">History</a>
          </div>
        </div>

        <div class="pb-nav-safe" style="flex:1;overflow-y:auto;">
          <div style="padding:1rem;">
            <!-- DStv Section -->
            <div style="background:white;border:1px solid #e5e7eb;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;">
              <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
                <div style="width:3rem;height:3rem;border-radius:9999px;background:#1e40af;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:white;">D</div>
                <div style="flex:1;">
                  <h2 style="font-size:1rem;font-weight:700;margin:0;color:#111827;">DStv</h2>
                </div>
                <span style="color:#00B876;">›</span>
              </div>
              <p style="font-size:0.875rem;color:#00B876;margin:0;line-height:1.4;">Share the joy this season with DStv - your home of drama series and football!!</p>
            </div>

            <!-- Smartcard Input -->
            <div style="margin-bottom:1.5rem;">
              <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.5rem;">Smartcard Number</h3>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <span style="font-size:0.875rem;color:#6b7280;">Beneficiaries</span>
                <span style="color:#00B876;cursor:pointer;">›</span>
              </div>
              <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Enter Your Smartcard Number" style="width:100%;padding:0.875rem;border:1px solid #e5e7eb;border-radius:0.75rem;font-size:0.9375rem;margin-bottom:1rem;font-family:inherit;" />
            </div>

            <!-- Voucher Section -->
            <div style="background:#f9fafb;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem;">
              <span style="font-size:2rem;">🎫</span>
              <div style="flex:1;">
                <p style="font-size:0.875rem;font-weight:600;color:#111827;margin:0;margin-bottom:0.5rem;">Voucher</p>
                <div style="display:flex;gap:0.5rem;">
                  <span style="background:#d1fae5;color:#00B876;padding:0.25rem 0.75rem;border-radius:0.5rem;font-size:0.75rem;font-weight:600;">₦50</span>
                  <span style="background:#d1fae5;color:#00B876;padding:0.25rem 0.75rem;border-radius:0.5rem;font-size:0.75rem;font-weight:600;">₦50</span>
                </div>
              </div>
              <span style="color:#6b7280;cursor:pointer;">More</span>
            </div>

            <!-- Tabs -->
            <div style="display:flex;gap:0;margin-bottom:1rem;border-bottom:1px solid #e5e7eb;">
              <button id="tab-hot" style="padding:1rem;background:none;border:none;border-bottom:2px solid ${activeTab === 'hot' ? '#00B876' : 'transparent'};color:${activeTab === 'hot' ? '#111827' : '#6b7280'};font-weight:${activeTab === 'hot' ? '700' : '500'};cursor:pointer;font-size:0.9375rem;">Hot offers</button>
              <button id="tab-premium" style="padding:1rem;background:none;border:none;border-bottom:2px solid ${activeTab === 'premium' ? '#00B876' : 'transparent'};color:${activeTab === 'premium' ? '#111827' : '#6b7280'};font-weight:${activeTab === 'premium' ? '700' : '500'};cursor:pointer;font-size:0.9375rem;">Premium</button>
            </div>

            <!-- Plans Grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
              ${plans[activeTab].map(plan => `
                <div style="background:white;border:1px solid #e5e7eb;border-radius:0.75rem;padding:1rem;">
                  <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0;margin-bottom:0.5rem;">${plan.name}</h3>
                  ${plan.period ? `<span style="display:inline-block;background:#fef3c7;color:#d97706;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;font-weight:600;margin-bottom:0.75rem;">${plan.period}</span>` : ''}
                  ${plan.price ? `
                    <div style="margin:0.75rem 0;">
                      <p style="font-size:1rem;font-weight:700;color:#111827;margin:0;">${plan.price}</p>
                      ${plan.oldPrice ? `<p style="font-size:0.75rem;color:#9ca3af;text-decoration:line-through;margin:0.25rem 0 0;">${plan.oldPrice}</p>` : ''}
                    </div>
                  ` : `
                    <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder="${plan.placeholder}" style="width:100%;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.5rem;font-size:0.875rem;font-family:inherit;" />
                  `}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("tab-hot").addEventListener("click", () => {
      activeTab = "hot";
      render();
    });
    document.getElementById("tab-premium").addEventListener("click", () => {
      activeTab = "premium";
      render();
    });
  }

  render();
}

window.renderTvPage = renderTvPage;
