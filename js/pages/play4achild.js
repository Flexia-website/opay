function renderPlay4achildPage(container) {
  const { primaryColor } = Stores.customization.get();
  let showDonateModal = false;
  let amount = "";

  const sponsorships = [
    { id: 1, name: "Aisha", age: 7, location: "Lagos", story: "Loves to draw and dreams of becoming an artist", image: "https://picsum.photos/seed/child1/300/300" },
    { id: 2, name: "Emmanuel", age: 9, location: "Abuja", story: "Passionate about football and mathematics", image: "https://picsum.photos/seed/child2/300/300" },
    { id: 3, name: "Grace", age: 6, location: "Port Harcourt", story: "Loves to sing and help her friends", image: "https://picsum.photos/seed/child3/300/300" },
  ];
  const donationStats = { totalDonated: 57800, childrenImpacted: sponsorships.length };

  function render() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;padding-bottom:4rem;">
      <div style="background:white;padding:1rem;display:flex;align-items:center;gap:0.5rem;">
        <button id="p4c-back" style="background:none;border:none;border-radius:9999px;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;">${Icon("arrow-left", { size: 20 })}</button>
        <h1 style="font-size:1.125rem;font-weight:700;margin:0;">Play4AChild</h1>
      </div>

      <div style="padding:1rem;">
        <div class="card" style="padding:1rem;margin-bottom:1rem;">
          <div class="flex items-center" style="gap:0.75rem;">
            <div style="width:3.5rem;height:3.5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${primaryColor}15;">
              <span style="color:${primaryColor};">${Icon("hand-heart", { size: 32 })}</span>
            </div>
            <div>
              <h3 style="font-weight:700;margin:0;">Your Impact</h3>
              <p style="font-size:0.875rem;color:#4b5563;margin:0;">You've supported ${donationStats.childrenImpacted} children</p>
            </div>
          </div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:0.5rem;text-align:center;margin-top:1rem;">
            <div style="background:#f9fafb;padding:0.75rem;border-radius:0.5rem;">
              <p style="font-size:0.875rem;color:#4b5563;margin:0;">Total Donated</p>
              <p style="font-weight:700;font-size:1.25rem;margin:0;">₦${donationStats.totalDonated.toLocaleString()}</p>
            </div>
            <div style="background:#f9fafb;padding:0.75rem;border-radius:0.5rem;">
              <p style="font-size:0.875rem;color:#4b5563;margin:0;">Lives Impacted</p>
              <p style="font-weight:700;font-size:1.25rem;margin:0;">${donationStats.childrenImpacted}</p>
            </div>
          </div>
        </div>

        <button id="p4c-donate-btn" style="width:100%;margin-bottom:1.5rem;padding:1rem;font-size:1.125rem;font-weight:700;color:white;border:none;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;background:${primaryColor};">
          ${Icon("heart", { size: 24, class: "" })} Donate Now
        </button>

        <h3 style="font-weight:700;margin:0 0 0.75rem;">Children You're Supporting</h3>
        ${sponsorships
          .map(
            (c) => `
          <div class="card" style="margin-bottom:1rem;overflow:hidden;">
            <div style="display:flex;">
              <img src="${c.image}" alt="${c.name}" style="width:6rem;height:6rem;object-fit:cover;" />
              <div style="padding:0.75rem;flex:1;">
                <div class="flex items-center justify-between">
                  <h4 style="font-weight:600;margin:0;">${c.name}, ${c.age}</h4>
                  <div style="color:#facc15;">★★★</div>
                </div>
                <p style="font-size:0.75rem;color:#6b7280;margin:0 0 4px;">${c.location}</p>
                <p style="font-size:0.875rem;margin:0;">${c.story}</p>
              </div>
            </div>
            <div style="padding:0.75rem;border-top:1px solid hsl(var(--border));">
              <div class="flex items-center justify-between" style="margin-bottom:4px;">
                <p style="font-size:0.75rem;color:#6b7280;margin:0;">Support Progress</p>
                <p style="font-size:0.75rem;font-weight:500;margin:0;">75%</p>
              </div>
              <div class="progress" style="height:4px;"><div class="progress-fill" style="width:75%;"></div></div>
            </div>
          </div>`
          )
          .join("")}

        <div style="margin-top:1.5rem;">
          <h3 style="font-weight:700;margin:0 0 0.75rem;">How Your Donation Helps</h3>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${[
              ["trophy", "#dbeafe", "#3b82f6", "Quality Education", "Provides books, uniforms and school supplies"],
              ["heart", "#dcfce7", "#22c55e", "Healthcare", "Regular medical check-ups and vaccinations"],
              ["hand-heart", "#ffedd5", "#f97316", "Career Development", "Skills training and mentorship programs"],
            ]
              .map(
                ([icon, bg, color, title, desc]) => `
              <div class="card" style="padding:0.75rem;">
                <div class="flex items-center" style="gap:0.75rem;">
                  <div style="width:2.5rem;height:2.5rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;background:${bg};color:${color};">${Icon(icon, { size: 20 })}</div>
                  <div><p style="font-weight:500;margin:0;">${title}</p><p style="font-size:0.75rem;color:#6b7280;margin:0;">${desc}</p></div>
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>

      ${
        showDonateModal
          ? `<div id="donate-overlay" class="overlay" style="display:flex;align-items:flex-end;justify-content:center;">
          <div style="background:white;width:100%;max-width:28rem;border-radius:0.75rem 0.75rem 0 0;padding:1rem;">
            <h3 style="font-weight:700;margin:0 0 1rem;">Donate to Play4AChild</h3>
            <div style="margin-bottom:1rem;">
              <label style="display:block;font-size:0.875rem;color:#374151;margin-bottom:4px;">Donation Amount</label>
              <div style="position:relative;">
                <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:#6b7280;">₦</span>
                <input id="donate-amount" type="text" inputmode="numeric" pattern="[0-9]*" class="input" style="padding-left:2rem;" placeholder="0.00" value="${amount}" />
              </div>
            </div>
            <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem;">
              ${[1000, 5000, 10000].map((v) => `<button data-quick-amt="${v}" class="btn btn-outline" style="border-color:#d1d5db;">₦${v.toLocaleString()}</button>`).join("")}
            </div>
            <div class="flex" style="gap:0.75rem;">
              <button id="donate-cancel" class="btn btn-outline" style="flex:1;">Cancel</button>
              <button id="donate-confirm" style="flex:1;padding:0.625rem;border-radius:0.5rem;color:white;border:none;background:${primaryColor};">Confirm Donation</button>
            </div>
          </div>
        </div>`
          : ""
      }
    </div>`;

    container.querySelector("#p4c-back").addEventListener("click", () => navigate("/dashboard"));
    container.querySelector("#p4c-donate-btn").addEventListener("click", () => {
      showDonateModal = true;
      render();
    });
    const donateAmt = container.querySelector("#donate-amount");
    if (donateAmt) {
      donateAmt.addEventListener("input", () => (amount = donateAmt.value));
      attachAmountKeypad(donateAmt);
      container.querySelectorAll("[data-quick-amt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          amount = btn.dataset.quickAmt;
          render();
        });
      });
      container.querySelector("#donate-cancel").addEventListener("click", () => {
        showDonateModal = false;
        render();
      });
      container.querySelector("#donate-confirm").addEventListener("click", handleDonate);
      const overlay = container.querySelector("#donate-overlay");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          showDonateModal = false;
          render();
        }
      });
    }
  }

  function handleDonate() {
    const donationAmount = Number(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Thank you! Your donation of ₦${donationAmount.toLocaleString()} will help children in need.`);
    amount = "";
    showDonateModal = false;
    render();
  }

  render();
}

window.renderPlay4achildPage = renderPlay4achildPage;
