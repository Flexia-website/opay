function renderLoanPage(container) {
  const { primaryColor } = Stores.customization.get();
  const minLoan = 1000;
  const maxLoan = 50000;
  const interestRate = 0.15;

  let loanAmount = 5000;
  let loanTenure = 30;

  function totalRepayment() {
    const monthlyRate = (interestRate / 30) * loanTenure;
    return loanAmount * (1 + monthlyRate);
  }

  function render() {
    const repayment = totalRepayment();
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      ${PageHeader("Loan")}
      <div style="padding:1rem;">
        <div style="border-radius:0.75rem;padding:1rem;margin-bottom:1rem;color:white;background:${primaryColor};">
          <div class="flex justify-between items-center" style="margin-bottom:0.5rem;">
            <h3 style="font-size:1.125rem;font-weight:600;margin:0;">Available Loan</h3>
            ${Icon("dollar-sign", { size: 24 })}
          </div>
          <div style="font-size:1.875rem;font-weight:700;margin-bottom:4px;">₦50,000</div>
          <div style="font-size:0.875rem;opacity:0.8;">15% interest rate per month</div>
        </div>

        <div style="background:#fff7ed;padding:0.75rem;border-radius:0.5rem;display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
          ${Icon("info", { size: 20, class: "" })}
          <p style="font-size:0.875rem;color:#c2410c;margin:0;">Loan repayment will be automatically deducted from your account on the due date.</p>
        </div>

        <div class="card" style="padding:1rem;margin-bottom:1rem;">
          <h3 style="font-weight:500;margin:0 0 0.75rem;">Loan Amount</h3>
          <div style="margin-bottom:1rem;">
            <div class="flex justify-between" style="margin-bottom:0.5rem;">
              <span style="font-size:0.875rem;">₦${minLoan.toLocaleString()}</span>
              <span style="font-size:0.875rem;">₦${maxLoan.toLocaleString()}</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem;margin-bottom:1rem;">
            <span style="color:#9ca3af;">₦</span>
            <input id="loan-amount-input" type="text" inputmode="numeric" pattern="[0-9]*" value="${loanAmount}" style="flex:1;border:none;outline:none;padding:0 0.5rem;" />
          </div>

          <h3 style="font-weight:500;margin:0 0 0.75rem;">Loan Tenure</h3>
          <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1rem;">
            ${[7, 14, 30]
              .map((days) => {
                const isSelected = loanTenure === days;
                const label = days === 7 ? "Short term" : days === 14 ? "Medium term" : "Long term";
                return `
              <button data-tenure="${days}" style="padding:0.75rem;border-radius:0.5rem;border:${
                  isSelected ? `2px solid ${primaryColor}` : "1px solid hsl(var(--border))"
                };background:${isSelected ? primaryColor + "10" : "white"};">
                <div style="font-size:0.875rem;font-weight:500;">${days} days</div>
                <div style="font-size:0.75rem;color:#6b7280;">${label}</div>
              </button>`;
              })
              .join("")}
          </div>

          <div style="background:#f9fafb;padding:0.75rem;border-radius:0.5rem;margin-bottom:1rem;">
            <div class="flex justify-between" style="margin-bottom:0.5rem;">
              <span style="font-size:0.875rem;color:#6b7280;">Loan amount:</span>
              <span style="font-size:0.875rem;font-weight:500;">₦${loanAmount.toLocaleString()}</span>
            </div>
            <div class="flex justify-between" style="margin-bottom:0.5rem;">
              <span style="font-size:0.875rem;color:#6b7280;">Interest rate:</span>
              <span style="font-size:0.875rem;font-weight:500;">${((interestRate / 30) * loanTenure * 100).toFixed(1)}%</span>
            </div>
            <div class="flex justify-between">
              <span style="font-size:0.875rem;color:#6b7280;">Total repayment:</span>
              <span style="font-size:0.875rem;font-weight:500;">₦${repayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <button id="apply-btn" style="width:100%;color:white;padding:0.75rem;border-radius:9999px;font-weight:500;border:none;background:${primaryColor};">Apply for Loan</button>
        </div>

        <div class="card" style="padding:1rem;">
          <h3 style="font-weight:500;margin:0 0 0.75rem;">Requirements</h3>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${["Account must be at least 30 days old", "Must have completed KYC verification", "Regular account activity in the last 30 days"]
              .map(
                (t) => `
              <div class="flex items-center" style="gap:0.5rem;">
                <div style="width:1.25rem;height:1.25rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor};">
                  ${Icon("check", { size: 12, class: "" })}
                </div>
                <span style="font-size:0.875rem;">${t}</span>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>`;

    bindPageHeader(container, "/dashboard");
    const amountInput = container.querySelector("#loan-amount-input");
    amountInput.addEventListener("change", () => {
      const value = parseInt(amountInput.value, 10);
      if (value >= minLoan && value <= maxLoan) {
        loanAmount = value;
        render();
      }
    });
    container.querySelectorAll("[data-tenure]").forEach((btn) => {
      btn.addEventListener("click", () => {
        loanTenure = parseInt(btn.dataset.tenure, 10);
        render();
      });
    });
    container.querySelector("#apply-btn").addEventListener("click", handleApply);
  }

  function handleApply() {
    if (loanAmount < minLoan || loanAmount > maxLoan) {
      alert(`Loan amount must be between ₦${formatMoney(minLoan)} and ₦${formatMoney(maxLoan)}`);
      return;
    }
    const repayment = totalRepayment();
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "1rem";
    overlay.innerHTML = `
      <div style="background:white;border-radius:0.75rem;padding:1rem;width:100%;max-width:20rem;">
        <h3 style="font-size:1.125rem;font-weight:600;margin:0 0 1rem;">Confirm Loan Application</h3>
        <div style="background:#f9fafb;padding:0.75rem;border-radius:0.5rem;margin-bottom:1rem;">
          <div class="flex justify-between" style="margin-bottom:0.5rem;"><span style="font-size:0.875rem;color:#6b7280;">Loan amount:</span><span style="font-size:0.875rem;font-weight:500;">₦${loanAmount.toLocaleString()}</span></div>
          <div class="flex justify-between" style="margin-bottom:0.5rem;"><span style="font-size:0.875rem;color:#6b7280;">Tenure:</span><span style="font-size:0.875rem;font-weight:500;">${loanTenure} days</span></div>
          <div class="flex justify-between" style="margin-bottom:0.5rem;"><span style="font-size:0.875rem;color:#6b7280;">Interest:</span><span style="font-size:0.875rem;font-weight:500;">${((interestRate / 30) * loanTenure * 100).toFixed(1)}%</span></div>
          <div class="flex justify-between"><span style="font-size:0.875rem;color:#6b7280;">Repayment amount:</span><span style="font-size:0.875rem;font-weight:500;">₦${repayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
        </div>
        <p style="font-size:0.875rem;color:#6b7280;margin:0 0 1rem;">Enter your PIN to confirm this loan application.</p>
        <input id="loan-pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" class="input" placeholder="Enter 4-digit PIN" style="margin-bottom:1rem;" />
        <div class="flex" style="gap:0.5rem;">
          <button id="loan-cancel" style="flex:1;padding:0.5rem;border:1px solid hsl(var(--border));border-radius:0.5rem;background:white;">Cancel</button>
          <button id="loan-confirm" style="flex:1;padding:0.5rem;border-radius:0.5rem;color:white;border:none;background:${primaryColor};">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#loan-cancel").addEventListener("click", () => overlay.remove());
    overlay.querySelector("#loan-confirm").addEventListener("click", () => {
      const pinVal = overlay.querySelector("#loan-pin").value;
      if (pinVal !== "0803") {
        alert("Incorrect PIN");
        return;
      }
      Stores.balance.set({ balance: Stores.balance.get().balance + loanAmount });
      Stores.transaction.addTransaction({ type: "Loan Disbursement", amount: `+₦${loanAmount.toLocaleString()}`, status: "Successful", icon: "wallet" });
      overlay.remove();
      showInProgress(repayment);
    });
  }

  function showInProgress(repayment) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "linear-gradient(180deg, #d1fae5 0%, #f0fdf9 40%, #ffffff 100%)";
    overlay.style.zIndex = "3000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "flex-end";
    overlay.style.paddingBottom = "35vh";
    overlay.innerHTML = `
      <div style="position:absolute;top:20%;right:10%;width:8rem;height:8rem;border-radius:9999px;background:radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);"></div>

      <div style="width:100%;max-width:26rem;padding:0 1.25rem;box-sizing:border-box;">
        <div style="display:flex;align-items:center;background:#dcfce7;border-radius:1rem;overflow:hidden;">
          <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:0.375rem;padding:1.25rem 1rem;">
            <span style="font-size:1.125rem;color:#00B876;">◐</span>
            <span style="font-size:1.25rem;font-weight:800;color:#1B1464;">Pay</span>
          </div>
          <div style="width:2.5rem;height:2.5rem;border-radius:9999px;background:#a7f3d0;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="color:#00B876;font-size:0.75rem;">▶▶▶</span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#e5e7ff;padding:1.25rem 1rem;">
            <div style="display:flex;align-items:center;gap:0.375rem;">
              <span style="font-size:1.125rem;color:#00B876;">◐</span>
              <span style="font-size:1.25rem;font-weight:800;color:#1B1464;">Pay</span>
            </div>
            <span style="font-size:0.6875rem;color:#6b7280;margin-top:2px;">Microfinance Bank</span>
          </div>
        </div>

        <div style="background:#f3f4f6;border-radius:0.75rem;padding:1rem;margin-top:1rem;display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#00B876;flex-shrink:0;margin-top:2px;">🛡️</span>
          <p style="font-size:0.8125rem;color:#374151;margin:0;line-height:1.4;">The loans products on OPay are powered by OPay Microfinance Bank.</p>
        </div>

        <div style="border-top:2px dashed #d1d5db;margin:1.5rem 0;"></div>

        <p style="text-align:center;font-size:1.0625rem;font-weight:800;color:#00B876;margin:0;">In Progress...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      showSuccess(repayment);
    }, 2200);
  }

  function showSuccess(repayment) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "1rem";
    const dueDate = new Date(Date.now() + loanTenure * 24 * 60 * 60 * 1000).toLocaleDateString();
    overlay.innerHTML = `
      <div style="background:white;border-radius:0.75rem;padding:1rem;width:100%;max-width:24rem;">
        <div style="text-align:center;margin-bottom:1rem;">
          <div style="width:4rem;height:4rem;border-radius:9999px;margin:0 auto 0.5rem;display:flex;align-items:center;justify-content:center;background:${primaryColor};">
            ${Icon("check", { size: 32, class: "" })}
          </div>
          <h3 style="font-size:1.125rem;font-weight:600;margin:0;">Loan Approved!</h3>
          <p style="font-size:0.875rem;color:#6b7280;margin-top:4px;">₦${loanAmount.toLocaleString()} has been added to your balance</p>
        </div>
        <div style="border-top:1px solid hsl(var(--border));border-bottom:1px solid hsl(var(--border));padding:1rem 0;display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem;">
          <div class="flex justify-between"><span style="color:#6b7280;">Date &amp; Time</span><span>${new Date().toLocaleString()}</span></div>
          <div class="flex justify-between"><span style="color:#6b7280;">Loan Amount</span><span style="font-weight:600;">₦${loanAmount.toLocaleString()}</span></div>
          <div class="flex justify-between"><span style="color:#6b7280;">Due Date</span><span>${dueDate}</span></div>
          <div class="flex justify-between"><span style="color:#6b7280;">Repayment Amount</span><span>₦${repayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
        </div>
        <button id="loan-done" style="width:100%;padding:0.75rem;border-radius:9999px;color:white;font-weight:500;border:none;background:${primaryColor};">Done</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#loan-done").addEventListener("click", () => {
      overlay.remove();
      navigate("/dashboard");
    });
  }

  render();
}

window.renderLoanPage = renderLoanPage;
