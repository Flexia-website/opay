function renderMorePage(container) {
  const sections = [
    {
      title: "E-commerce",
      items: [
        { icon: "shopping-cart", label: "AliExpress", key: "svc-aliexpress" },
        { icon: "gift", label: "Gift Cards", key: "svc-gift-cards" },
        { icon: "store", label: "Chowdeck", key: "svc-chowdeck" },
      ],
    },
    {
      title: "International Services",
      items: [{ icon: "refresh-cw", label: "Remit", key: "svc-remit" }],
    },
    {
      title: "Bills Payment",
      items: [
        { icon: "zap", label: "Electricity", key: "svc-electricity" },
        { icon: "sun", label: "Solar", key: "svc-solar" },
        { icon: "grid", label: "Products and Services", key: "svc-products-services" },
        { icon: "landmark", label: "School & Exam", key: "svc-school-exam" },
        { icon: "wifi", label: "Internet Services", key: "svc-internet-services" },
        { icon: "banknote", label: "Financial Services", key: "svc-financial-services" },
        { icon: "receipt", label: "Invoice Payments", key: "svc-invoice-payments" },
        { icon: "heart", label: "Aid Grants and Donations", key: "svc-aid-grants" },
        { icon: "book-open", label: "Religious", key: "svc-religious" },
        { icon: "landmark", label: "Government Payments", key: "svc-government-payments" },
        { icon: "building", label: "Embassies", key: "svc-embassies" },
        { icon: "tv", label: "TV(Others)", key: "svc-tv-others" },
        { icon: "shopping-cart", label: "Shopping", key: "svc-shopping" },
        { icon: "smartphone", label: "Online Shopping", key: "svc-online-shopping" },
        { icon: "edit", label: "Merchant Payments", key: "svc-merchant-payments" },
        { icon: "bookmark", label: "Blackberry", key: "svc-blackberry" },
        { icon: "briefcase", label: "PayChoice", key: "svc-paychoice" },
        { icon: "shield", label: "Commerce Retail Trade", key: "svc-commerce-retail" },
        { icon: "credit-card", label: "Prepaid Card Services", key: "svc-prepaid-card" },
        { icon: "globe", label: "International Airtime", key: "svc-international-airtime" },
        { icon: "fuel", label: "Transport & Toll", key: "svc-transport-toll" },
        { icon: "palmtree", label: "Travel & Hotel", key: "svc-travel-hotel" },
      ],
    },
    {
      title: "Finance",
      items: [
        { icon: "wallet", label: "OWealth", key: "svc-owealth", path: "/safebox" },
        { icon: "briefcase", label: "Fixed", key: "svc-fixed", path: "/safebox" },
        { icon: "shield", label: "SafeBox", key: "svc-safebox", path: "/safebox" },
        { icon: "target", label: "Targets", key: "svc-targets", path: "/safebox" },
        { icon: "piggy-bank", label: "Spend & Save", key: "svc-spend-save", path: "/spend-save" },
      ],
    },
    {
      title: "Rewards",
      items: [
        { icon: "calendar", label: "Daily Check-In", key: "svc-daily-checkin", path: "/rewards" },
        { icon: "heart", label: "Play4aChild", key: "svc-play4achild", path: "/play4achild" },
        { icon: "megaphone", label: "Refer & Earn", key: "svc-refer-earn", path: "/invitation" },
      ],
    },
    {
      title: "Others",
      items: [
        { icon: "credit-card", label: "Physical Card", key: "svc-physical-card", path: "/cards" },
        { icon: "credit-card", label: "Virtual Card", key: "svc-virtual-card", path: "/cards" },
      ],
    },
  ];

  const { buttonImages, primaryColor } = Stores.customization.get();

  function tileIcon(item) {
    const img = buttonImages[item.key];
    if (img) {
      return `<img src="${img}" alt="${item.label}" style="width:100%;height:100%;object-fit:cover;border-radius:9999px;" />`;
    }
    return Icon(item.icon, { size: 20 });
  }

  function tile(item) {
    return `
    <button data-service="${item.label}" ${item.path ? `data-path="${item.path}"` : ""} style="background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:0.5rem 0.25rem;text-align:center;">
      <div style="width:2.75rem;height:2.75rem;border-radius:9999px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#374151;overflow:hidden;">${tileIcon(item)}</div>
      <span style="font-size:0.75rem;color:#111827;line-height:1.2;">${item.label}</span>
    </button>`;
  }

  container.innerHTML = `
  <div style="min-height:100vh;background:#f5f6f8;padding-bottom:2rem;">
    <div style="background:white;padding:0.9rem 1rem;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <button data-nav-back style="background:none;border:none;display:flex;align-items:center;justify-content:center;padding:0;">${Icon("chevron-left", { size: 22 })}</button>
        <h1 style="font-size:1.0625rem;font-weight:700;margin:0;">All Service</h1>
      </div>
      <button id="service-search" style="background:none;border:none;display:flex;align-items:center;justify-content:center;padding:0;">${Icon("search", { size: 20 })}</button>
    </div>

    <div style="background:white;margin-top:0.5rem;padding:1rem 1rem 0.25rem;">
      ${sections
        .map(
          (sec) => `
        <div style="margin-bottom:1.25rem;">
          <h3 style="font-size:0.9375rem;font-weight:700;color:#111827;margin:0 0 0.75rem;">${sec.title}</h3>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);row-gap:1rem;">
            ${sec.items.map(tile).join("")}
          </div>
        </div>`
        )
        .join("")}
    </div>
  </div>`;

  container.querySelector("[data-nav-back]").addEventListener("click", () => navigate("/dashboard"));
  const searchBtn = container.querySelector("#service-search");
  if (searchBtn) searchBtn.addEventListener("click", () => toast("Search coming soon!"));
  container.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const path = btn.dataset.path;
      if (path) navigate(path);
      else toast(`${btn.dataset.service} coming soon!`);
    });
  });
}

window.renderMorePage = renderMorePage;
