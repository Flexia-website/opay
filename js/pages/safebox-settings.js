function renderSafeboxSettingsPage(container) {
  container.innerHTML = `
  <div style="min-height:100vh;background:white;">
    <div style="padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
      <button id="sbs-back" style="display:flex;align-items:center;gap:2px;background:none;border:none;">
        ${Icon("chevron-left", { size: 20 })}
        <span style="font-size:1.0625rem;font-weight:800;">Settings</span>
      </button>
      <button id="sbs-close" style="background:none;border:none;color:#111827;">${Icon("x", { size: 20 })}</button>
    </div>

    <div style="padding:0.5rem 1.25rem;">
      <h2 style="font-size:1.375rem;font-weight:800;color:#0aab63;margin:0 0 0.5rem;">SafeBox Settings</h2>
      <p style="color:#6b7280;font-size:0.9375rem;margin:0 0 1.5rem;">Manage your SafeBox by using the following options.</p>

      <button id="sbs-autosave" style="width:100%;text-align:left;border:1px solid #e5e7eb;border-radius:1rem;padding:1.25rem;display:flex;align-items:center;gap:1rem;background:none;margin-bottom:1.25rem;">
        <span style="color:#0aab63;">${Icon("zap", { size: 26 })}</span>
        <span style="font-size:1.0625rem;font-weight:700;color:#111827;">Turn on AutoSave Deposit</span>
      </button>

      <button id="sbs-schedule" style="width:100%;text-align:left;border:1px solid #e5e7eb;border-radius:1rem;padding:1.25rem;display:flex;align-items:center;gap:1rem;background:none;margin-bottom:1.25rem;">
        <span style="color:#0aab63;">${Icon("calendar", { size: 26 })}</span>
        <div>
          <div style="font-size:1.0625rem;font-weight:700;color:#111827;">Change free withdrawal day</div>
          <div style="font-size:0.875rem;color:#6b7280;margin-top:4px;">Your next free withdrawal day is 30 Sep 2026</div>
        </div>
      </button>
    </div>

    <div class="pb-nav-safe"></div>
    <div style="position:fixed;bottom:1.25rem;left:0;right:0;padding:0 1.25rem;max-width:480px;margin:0 auto;">
      <button id="sbs-done" style="width:100%;background:#0aab63;color:white;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;border:none;">Back</button>
    </div>
  </div>`;

  container.querySelector("#sbs-back").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbs-close").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbs-done").addEventListener("click", () => navigate("/safebox"));
  container.querySelector("#sbs-autosave").addEventListener("click", () => navigate("/safebox/autosave"));
  container.querySelector("#sbs-schedule").addEventListener("click", () => navigate("/safebox/withdrawal-schedule"));
}

function renderSafeboxAutosavePage(container) {
  let amount = "";
  let frequency = "";
  let customDeductionTime = false;
  let fundingSource = "OPay balance and OWealth";
  let disableInterest = false;

  function render() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;">
      <div style="padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
        <button id="as-back" style="display:flex;align-items:center;gap:2px;background:none;border:none;">
          ${Icon("chevron-left", { size: 20 })}
          <span style="font-size:1.0625rem;font-weight:800;">AutoSave</span>
        </button>
        <button id="as-close" style="background:none;border:none;color:#111827;">${Icon("x", { size: 20 })}</button>
      </div>

      <div style="background:#f5f6f8;padding:1rem 1.25rem 1.5rem;">
        <h2 style="font-size:1.25rem;font-weight:800;color:#111827;margin:0 0 0.375rem;">Set AutoSave Deposit</h2>
        <p style="color:#6b7280;font-size:0.9375rem;margin:0 0 1.25rem;">Build your savings daily, weekly or monthly.</p>

        <div class="card" style="padding:1.125rem;">
          <label style="display:block;font-size:0.9375rem;color:#111827;margin-bottom:0.625rem;">Amount to deposit at a time(₦)</label>
          <input id="as-amount" type="text" inputmode="numeric" pattern="[0-9]*" class="input" style="background:#f5f6f8;border:none;font-size:1.0625rem;padding:1rem;margin-bottom:0.875rem;" placeholder="₦" value="${amount}" />
          <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-bottom:1.25rem;">
            ${[500, 1000, 2000, 5000]
              .map(
                (v) => `<button data-quick="${v}" style="background:${amount == v ? "#0aab63" : "#f5f6f8"};color:${amount == v ? "white" : "#111827"};padding:0.625rem 0;border-radius:0.5rem;font-size:0.875rem;font-weight:600;border:none;">${v.toLocaleString()}</button>`
              )
              .join("")}
          </div>

          <label style="display:block;font-size:0.9375rem;font-weight:600;color:#111827;margin-bottom:0.625rem;">Savings frequency</label>
          <select id="as-frequency" class="input" style="background:#f5f6f8;border:none;padding:0.75rem 1rem;margin-bottom:1.25rem;color:${frequency ? "#111827" : "#9ca3af"};">
            <option value="" ${!frequency ? "selected" : ""} disabled>Select savings frequency</option>
            <option value="daily" ${frequency === "daily" ? "selected" : ""}>Daily</option>
            <option value="weekly" ${frequency === "weekly" ? "selected" : ""}>Weekly</option>
            <option value="monthly" ${frequency === "monthly" ? "selected" : ""}>Monthly</option>
          </select>

          <div class="flex items-center justify-between" style="margin-bottom:1.25rem;">
            <span style="font-size:0.9375rem;font-weight:600;color:#111827;">Custom Deduction Time</span>
            ${UI.switch({ id: "as-custom-time", checked: customDeductionTime })}
          </div>

          <label style="display:block;font-size:0.9375rem;font-weight:600;color:#111827;margin-bottom:0.625rem;">Funding source</label>
          <select id="as-funding" class="input" style="background:#f5f6f8;border:none;padding:0.75rem 1rem;">
            <option ${fundingSource === "OPay balance and OWealth" ? "selected" : ""}>OPay balance and OWealth</option>
            <option ${fundingSource === "OPay balance only" ? "selected" : ""}>OPay balance only</option>
            <option ${fundingSource === "OWealth only" ? "selected" : ""}>OWealth only</option>
          </select>
        </div>

        <div class="card" style="padding:1.125rem;margin-top:1rem;">
          <div class="flex items-center justify-between">
            <span style="font-size:0.9375rem;font-weight:600;color:#111827;">Disable interest on your savings</span>
            ${UI.switch({ id: "as-disable-interest", checked: disableInterest })}
          </div>
        </div>
      </div>

      <div class="pb-nav-safe"></div>
      <div style="position:fixed;bottom:1.25rem;left:0;right:0;padding:0 1.25rem;max-width:480px;margin:0 auto;">
        <button id="as-save" style="width:100%;background:#0aab63;color:white;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;border:none;">Save</button>
      </div>
    </div>`;

    container.querySelector("#as-back").addEventListener("click", () => navigate("/safebox/settings"));
    container.querySelector("#as-close").addEventListener("click", () => navigate("/safebox"));
    const amtInput = container.querySelector("#as-amount");
    amtInput.addEventListener("input", () => { amount = amtInput.value; });
    container.querySelectorAll("[data-quick]").forEach((btn) =>
      btn.addEventListener("click", () => { amount = btn.dataset.quick; render(); })
    );
    container.querySelector("#as-frequency").addEventListener("change", (e) => { frequency = e.target.value; });
    container.querySelector("#as-funding").addEventListener("change", (e) => { fundingSource = e.target.value; });
    UI.bindSwitch("as-custom-time", (v) => { customDeductionTime = v; });
    UI.bindSwitch("as-disable-interest", (v) => { disableInterest = v; });
    container.querySelector("#as-save").addEventListener("click", () => {
      if (!amount || !frequency) {
        toast.error("Please fill in amount and savings frequency");
        return;
      }
      toast.success("AutoSave deposit configured");
      navigate("/safebox");
    });
  }

  render();
}

window.renderSafeboxSettingsPage = renderSafeboxSettingsPage;
window.renderSafeboxAutosavePage = renderSafeboxAutosavePage;

function renderSafeboxWithdrawalSchedulePage(container) {
  let selected = "quarterly";
  const plans = {
    quarterly: { title: "Quarterly", recommend: true, desc: "On the last day of every quarter (Mar, Jun, Sep, Dec).", perk: "4 Free Withdrawal / Year", note: "Best for consistent, long-term saving goals.", nextDate: "2026-09-30", fee: "2.5%" },
    monthly: { title: "Monthly", recommend: false, desc: "On the last day of every month.", perk: "12 Free Withdrawal / Year", note: "Ideal for monthly budgeting.", nextDate: "2026-08-31", fee: "3.5%" },
  };

  function render() {
    container.innerHTML = `
    <div style="min-height:100vh;background:white;">
      <div style="padding:0.875rem 1rem;display:flex;align-items:center;justify-content:space-between;">
        <button id="ws-back" style="display:flex;align-items:center;gap:2px;background:none;border:none;">
          ${Icon("chevron-left", { size: 20 })}
          <span style="font-size:1.0625rem;font-weight:800;">Withdrawal Schedule</span>
        </button>
        <button id="ws-close" style="background:none;border:none;color:#111827;">${Icon("x", { size: 20 })}</button>
      </div>

      <div style="padding:0.5rem 1.25rem;">
        <h2 style="font-size:1.25rem;font-weight:800;color:#111827;margin:0 0 0.375rem;">Choose Withdrawal Schedule</h2>
        <p style="color:#6b7280;font-size:0.9375rem;margin:0 0 1.25rem;">Pick a withdrawal schedule that matches your cash flow needs.</p>

        <div style="display:flex;gap:0.75rem;overflow-x:auto;padding-bottom:0.5rem;">
          ${Object.entries(plans)
            .map(([key, p]) => {
              const isSelected = selected === key;
              return `
            <div data-plan="${key}" style="min-width:82%;border:1.5px solid ${isSelected ? "#0aab63" : "#e5e7eb"};background:${isSelected ? "#e2f6e9" : "white"};border-radius:1.125rem;padding:1.125rem;cursor:pointer;">
              <div class="flex items-center justify-between" style="margin-bottom:0.625rem;">
                <span style="font-size:1.125rem;font-weight:800;color:#111827;">${p.title}</span>
                ${p.recommend ? `<span style="background:#bfe6cc;color:#065f46;font-size:0.6875rem;font-weight:700;padding:2px 9px;border-radius:9999px;">Recommend</span>` : ""}
              </div>
              <p style="color:#4b5563;font-size:0.875rem;margin:0 0 0.75rem;">${p.desc}</p>
              <div style="border-top:1px dashed #d1d5db;margin-bottom:0.75rem;"></div>
              <div style="color:#059669;font-size:0.875rem;font-weight:600;margin-bottom:0.5rem;display:flex;align-items:center;gap:4px;">${Icon("check", { size: 14 })} ${p.perk}</div>
              <p style="color:#4b5563;font-size:0.875rem;margin:0 0 0.75rem;">${p.note}</p>
              <div style="background:${isSelected ? "white" : "#f5f6f8"};border-radius:0.625rem;padding:0.75rem;margin-bottom:0.75rem;">
                <div style="color:#6b7280;font-size:0.8125rem;">Next free withdrawal date</div>
                <div style="font-weight:700;color:#111827;margin-top:2px;">${p.nextDate}</div>
              </div>
              <div style="color:#6b7280;font-size:0.8125rem;margin-bottom:0.375rem;">Breaking Fee for early withdrawal</div>
              <div style="color:#059669;font-weight:700;font-size:0.9375rem;margin-bottom:0.75rem;display:flex;align-items:center;gap:4px;">${Icon("check", { size: 14 })} ${p.fee}</div>
              ${isSelected ? `<div style="text-align:center;"><span style="display:inline-flex;width:1.75rem;height:1.75rem;border-radius:9999px;background:#0aab63;color:white;align-items:center;justify-content:center;">${Icon("check", { size: 16 })}</span></div>` : ""}
            </div>`;
            })
            .join("")}
        </div>
      </div>

      <div class="pb-nav-safe"></div>
      <div style="position:fixed;bottom:1.5rem;left:0;right:0;padding:0 1.25rem;max-width:480px;margin:0 auto;text-align:center;">
        <button id="ws-save" style="width:100%;background:#7fd6ac;color:white;padding:1.125rem;border-radius:9999px;font-size:1.0625rem;font-weight:700;border:none;">Save</button>
        <div class="flex items-center justify-center" style="gap:6px;margin-top:0.75rem;font-size:0.8125rem;color:#4b5563;">
          Insured by <strong style="color:#1e3a8a;">NDIC</strong>
        </div>
      </div>
    </div>`;

    container.querySelector("#ws-back").addEventListener("click", () => navigate("/safebox/settings"));
    container.querySelector("#ws-close").addEventListener("click", () => navigate("/safebox"));
    container.querySelectorAll("[data-plan]").forEach((el) =>
      el.addEventListener("click", () => { selected = el.dataset.plan; render(); })
    );
    container.querySelector("#ws-save").addEventListener("click", () => {
      toast.success(`Withdrawal schedule set to ${plans[selected].title}`);
      navigate("/safebox");
    });
  }

  render();
}

window.renderSafeboxWithdrawalSchedulePage = renderSafeboxWithdrawalSchedulePage;
