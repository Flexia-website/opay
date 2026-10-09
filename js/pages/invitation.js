function renderInvitationPage(container) {
  const { buttonImages } = Stores.customization.get();
  const referralCode = "8160881049";
  const referralLink = "https://opay.com/invite/8160881049";
  const totalEarned = 0;
  const tiers = [
    { amount: "₦1,600", state: "Invite Now", active: true },
    { amount: "₦1,800", state: "To be invited", active: false },
    { amount: "₦2,200", state: "To be invited", active: false },
  ];

  function stepIcon(key, iconName) {
    const img = buttonImages[key];
    if (img) return `<img src="${img}" alt="${key}" style="width:100%;height:100%;object-fit:cover;border-radius:9999px;" />`;
    return Icon(iconName, { size: 24 });
  }

  function copyText(text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast.success(label));
    } else {
      toast.success(label);
    }
  }

  container.innerHTML = `
  <div style="min-height:100vh;background:#eafaf1;padding-bottom:2rem;">
    <div style="padding:1rem 1.25rem 0;display:flex;align-items:center;justify-content:space-between;">
      <button data-nav-back style="background:none;border:none;display:flex;align-items:center;justify-content:center;padding:0;">${Icon("chevron-left", { size: 24 })}</button>
      <button id="rules-btn" style="background:none;border:none;font-size:1rem;font-weight:700;color:#111827;">Rules</button>
    </div>

    <div style="text-align:center;padding:1.5rem 2rem 0;">
      <h1 style="font-size:1.625rem;font-weight:800;color:#0aab63;margin:0;line-height:1.25;">Invite friends to OPay<br/>to earn rewards</h1>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;padding:1.5rem 1rem;position:relative;">
      <span style="font-size:2rem;">🤝</span>
      <div style="background:white;border:2px solid #0aab63;border-radius:0.75rem;padding:0.75rem 1.5rem;margin:0 0.75rem;box-shadow:0 4px 14px rgba(10,171,99,0.18);">
        <span style="font-size:1.5rem;font-weight:800;color:#0aab63;">₦5,600</span>
      </div>
      <span style="font-size:2rem;">🪙</span>
    </div>

    <p style="text-align:center;color:#374151;font-size:0.875rem;padding:0 1.5rem;margin:0 0 1.25rem;">
      Invite friends who have not used OPay or have been inactive for <span style="color:#0aab63;font-weight:700;">Over 180 Days</span> to join, and earn rewards!
    </p>

    <div style="background:white;border-radius:1.25rem;margin:0 0.75rem;padding:1.25rem 1rem;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;text-align:center;gap:0.5rem;">
        <div>
          <div style="width:3rem;height:3rem;margin:0 auto 0.5rem;border-radius:9999px;background:#e6f9ef;display:flex;align-items:center;justify-content:center;color:#0aab63;overflow:hidden;">${stepIcon("inv-share", "share")}</div>
          <p style="font-size:0.8125rem;color:#111827;margin:0;">Share invitation link/code with friends</p>
        </div>
        <div>
          <div style="width:3rem;height:3rem;margin:0 auto 0.5rem;border-radius:9999px;background:#e6f9ef;display:flex;align-items:center;justify-content:center;color:#0aab63;overflow:hidden;">${stepIcon("inv-check", "check-circle")}</div>
          <p style="font-size:0.8125rem;color:#111827;margin:0;">Friend transacts ₦100 or more during the validity period</p>
        </div>
        <div>
          <div style="width:3rem;height:3rem;margin:0 auto 0.5rem;border-radius:9999px;background:#e6f9ef;display:flex;align-items:center;justify-content:center;color:#0aab63;overflow:hidden;">${stepIcon("inv-banknote", "banknote")}</div>
          <p style="font-size:0.8125rem;color:#111827;margin:0;">You'll receive rewards in your wallet</p>
        </div>
      </div>

      <button id="earn-btn" style="width:100%;margin-top:1.25rem;background:#0aab63;color:white;border:none;border-radius:9999px;padding:0.9rem;font-size:1rem;font-weight:700;cursor:pointer;">Earn ₦5,600</button>

      <div style="text-align:center;margin-top:1.25rem;">
        <p style="font-size:0.9375rem;color:#111827;margin:0 0 0.625rem;">Share Invitation Code</p>
        <div style="display:flex;align-items:center;justify-content:center;gap:0.625rem;">
          <div style="background:#eafaf1;border-radius:0.5rem;padding:0.75rem 1.25rem;font-size:1.25rem;font-weight:700;color:#111827;">${referralCode}</div>
          <button id="copy-code" style="background:#0aab63;color:white;border:none;border-radius:0.5rem;padding:0.75rem 1.25rem;font-size:0.9375rem;font-weight:700;cursor:pointer;">Copy</button>
        </div>
        <button id="how-to-use" style="background:none;border:none;color:#0aab63;font-weight:700;font-size:0.9375rem;margin-top:0.875rem;cursor:pointer;">How to use invitation code?</button>
      </div>
    </div>

    <div style="background:white;border-radius:1.25rem;margin:0.75rem;padding:1.25rem 1rem;">
      <div style="display:flex;align-items:center;justify-content:center;gap:0.375rem;background:#fff4e5;border-radius:0.5rem;padding:0.625rem;margin-bottom:1.25rem;">
        ${Icon("clock", { size: 16, class: "" })}<span style="color:#ea8c1e;font-weight:600;font-size:0.9375rem;">6 days 23:59:51 expired</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center;gap:0.5rem;">
        ${tiers
          .map(
            (t) => `
          <div>
            <div style="width:3rem;height:3rem;margin:0 auto 0.5rem;border-radius:9999px;border:1.5px dashed ${t.active ? "#0aab63" : "#d1d5db"};display:flex;align-items:center;justify-content:center;position:relative;">
              <span style="color:${t.active ? "#0aab63" : "#9ca3af"};">${Icon("plus", { size: 20 })}</span>
            </div>
            <div style="background:${t.active ? "#0aab63" : "#d1d5db"};color:white;font-size:0.8125rem;font-weight:700;border-radius:9999px;padding:0.2rem 0.6rem;display:inline-block;margin-bottom:0.4rem;">${t.amount}</div>
            <div>${
              t.active
                ? `<button id="invite-now-btn" style="background:#0aab63;color:white;border:none;border-radius:9999px;padding:0.35rem 1rem;font-size:0.8125rem;font-weight:700;cursor:pointer;">Invite Now</button>`
                : `<span style="font-size:0.8125rem;color:#9ca3af;">${t.state}</span>`
            }</div>
          </div>`
          )
          .join("")}
      </div>
      <div style="background:#eafaf1;border-radius:0.625rem;padding:0.75rem;text-align:center;margin-top:1.25rem;font-size:0.875rem;color:#111827;">
        Invite <strong>1</strong> more person, you can get <strong style="color:#0aab63;">₦1,600</strong>
      </div>
    </div>

    <div style="background:white;border-radius:1.25rem;margin:0.75rem;padding:1.125rem 1rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;font-size:1.0625rem;font-weight:700;color:#111827;">
        <span>🪙</span> Total Earned: ₦${formatMoney(totalEarned)}
      </div>
    </div>

    <button id="invitation-record" style="width:calc(100% - 1.5rem);margin:0 0.75rem;background:white;border-radius:1.25rem;padding:1.125rem 1rem;border:none;display:flex;align-items:center;justify-content:space-between;font-size:1.0625rem;font-weight:700;color:#111827;cursor:pointer;">
      <span>Invitation Record</span>
      ${Icon("chevron-right", { size: 20, class: "" })}
    </button>
  </div>`;

  container.querySelector("[data-nav-back]").addEventListener("click", () => navigate("/dashboard"));
  container.querySelector("#rules-btn").addEventListener("click", () => toast("Referral rules coming soon!"));
  container.querySelector("#copy-code").addEventListener("click", () => copyText(referralCode, "Invitation code copied!"));
  container.querySelector("#how-to-use").addEventListener("click", () => toast("Guide coming soon!"));
  container.querySelector("#invitation-record").addEventListener("click", () => toast("No invitations yet"));
  const earnBtn = container.querySelector("#earn-btn");
  if (earnBtn) {
    earnBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: "Join OPay and earn rewards!", text: `Use my invitation code ${referralCode} to join OPay!`, url: referralLink });
      } else {
        copyText(referralLink, "Invitation link copied!");
      }
    });
  }
  const inviteNowBtn = container.querySelector("#invite-now-btn");
  if (inviteNowBtn) {
    inviteNowBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: "Join OPay and earn rewards!", text: `Use my invitation code ${referralCode} to join OPay!`, url: referralLink });
      } else {
        copyText(referralLink, "Invitation link copied!");
      }
    });
  }
}

window.renderInvitationPage = renderInvitationPage;
