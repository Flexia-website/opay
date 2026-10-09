function renderNotificationsPage(container) {
  let activeTab = "transactions";
  const notifications = {
    transactions: [
      { title: "Spend & Save interest", desc: "₦0.28 interest has been received. Spend & Save balance is ₦903.88.", time: "Jul 31,2026 08:32", icon: "heart" },
      { title: "Spend & Save deposit", desc: "₦10.00 has been put into Spend & Save. Spend & Save balance is ₦903.60.", time: "Jul 30,2026 23:43", icon: "heart" },
      { title: "OWealth Interest Earned", desc: "Your Available Balance 'OWealth' interest earned ₦1.91. Your OWealth balance is ₦5,573.70.", time: "Jul 30,2026 10:20", icon: "heart" }
    ],
    services: [
      { title: "Service Update", desc: "New features available in OPay.", time: "Jul 29,2026 14:00", icon: "settings" }
    ],
    activities: [
      { title: "Login Activity", desc: "New login from mobile device.", time: "Jul 31,2026 10:00", icon: "smartphone" }
    ]
  };

  function render() {
    container.innerHTML = `
      <div style="background:white;">
        <div class="notification-header" style="padding:1rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(229,231,235,0.5);">
          <h1 style="font-size:1.125rem;font-weight:700;margin:0;">Notifications</h1>
          <button style="background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">${Icon('more-vertical', {size: 20})}</button>
        </div>

        <div style="display:flex;gap:1rem;padding:0 1rem 1rem;overflow-x:auto;border-bottom:1px solid #e5e7eb;">
          <button id="tab-transactions" style="padding:0.75rem 1.5rem;background:none;border:none;border-bottom:2px solid ${activeTab === 'transactions' ? '#00B876' : 'transparent'};color:${activeTab === 'transactions' ? '#00B876' : '#6b7280'};font-weight:${activeTab === 'transactions' ? '700' : '500'};cursor:pointer;font-size:0.9375rem;">Transactions</button>
          <button id="tab-services" style="padding:0.75rem 1.5rem;background:none;border:none;border-bottom:2px solid ${activeTab === 'services' ? '#00B876' : 'transparent'};color:${activeTab === 'services' ? '#00B876' : '#6b7280'};font-weight:${activeTab === 'services' ? '700' : '500'};cursor:pointer;font-size:0.9375rem;">Services</button>
          <button id="tab-activities" style="padding:0.75rem 1.5rem;background:none;border:none;border-bottom:2px solid ${activeTab === 'activities' ? '#00B876' : 'transparent'};color:${activeTab === 'activities' ? '#00B876' : '#6b7280'};font-weight:${activeTab === 'activities' ? '700' : '500'};cursor:pointer;font-size:0.9375rem;">Activities</button>
        </div>

        <div style="padding:1rem;">
          ${notifications[activeTab].map(n => `
            <div style="padding:1rem 0;border-bottom:1px solid #f3f4f6;">
              <div style="display:flex;gap:0.75rem;margin-bottom:0.5rem;">
                <span style="display:flex;align-items:center;justify-content:center;color:#00B876;">${Icon(n.icon, {size: 20})}</span>
                <div style="flex:1;">
                  <h3 style="font-size:0.9375rem;font-weight:700;margin:0;color:#111827;">${n.title}</h3>
                  <p style="font-size:0.8125rem;color:#6b7280;margin:0.5rem 0 0;">
                    ${n.desc}
                  </p>
                </div>
                <a href="#" style="color:#00B876;font-size:0.8125rem;font-weight:600;text-decoration:none;">View ></a>
              </div>
              <span style="font-size:0.75rem;color:#9ca3af;">${n.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.id.replace('tab-', '');
        render();
      });
    });
  }

  render();
}

window.renderNotificationsPage = renderNotificationsPage;
