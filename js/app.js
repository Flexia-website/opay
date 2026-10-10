// ── Auth guard + bootstrap ────────────────────────────────────────────────────
(async function() {
  const publicRoutes = ['/', '/register', '/login'];
  const hash = location.hash.slice(1) || '/';

  if (!publicRoutes.includes(hash)) {
    try {
      const res = await fetch('/api/state', { credentials: 'include' });
      const data = await res.json();
      if (!data.user) {
        location.hash = '/';
        Router.render();
        return;
      }
      AuthState.isLoggedIn = true;
      AuthState.isAdmin = data.is_admin;
      AuthState.username = data.user;
      AuthState.userId = data.user_id || null;
      AuthState.fullName = data.full_name || data.user;
      AuthState.accountNumber = data.account_number || '';
      AuthState.balance = data.balance || 0;
      AuthState.safeboxBalance = data.safebox_balance || 0;
      if (data.customization) Stores.customization.set(data.customization);
      Stores.balance.set({ balance: data.balance || 0 });
    } catch (e) {
      // Offline — fall through and let Router try
    }
  }

  // ── Route registration ──────────────────────────────────────────────────────
  Router.register("/", renderLoginPage);
  Router.register("/dashboard", renderDashboard);
  Router.register("/me", renderMePage);
  Router.register("/my-profile", renderMyProfilePage);
  Router.register("/account-limits", renderAccountLimitsPage);
  Router.register("/settings", renderSettingsPage);
  Router.register("/rewards", renderRewardsPage);
  Router.register("/finance", renderFinancePage);
  Router.register("/cards", renderCardsPage);
  Router.register("/to-opay", renderToOpayPage);
  Router.register("/to-bank", renderToBankPage);
  Router.register("/withdraw", renderWithdrawPage);
  Router.register("/airtime", renderAirtimePage);
  Router.register("/data", renderDataPage);
  Router.register("/betting", renderBettingPage);
  Router.register("/tv", renderTvPage);
  Router.register("/loan", renderLoanPage);
  Router.register("/safebox", renderSafeboxPage);
  Router.register("/spend-save", renderSpendSavePage);
  Router.register("/safebox/deposit", renderSafeboxDepositPage);
  Router.register("/safebox/withdraw", renderSafeboxWithdrawPage);
  Router.register("/safebox/interests", renderSafeboxInterestsPage);
  Router.register("/safebox/settings", renderSafeboxSettingsPage);
  Router.register("/safebox/autosave", renderSafeboxAutosavePage);
  Router.register("/safebox/withdrawal-schedule", renderSafeboxWithdrawalSchedulePage);
  Router.register("/transaction-history", renderTransactionHistoryPage);
  Router.register("/notifications", renderNotificationsPage);
  Router.register("/invitation", renderInvitationPage);
  Router.register("/play4achild", renderPlay4achildPage);
  Router.register("/qr-code", renderQrCodePage);
  Router.register("/help", renderHelpPage);
  Router.register("/more", renderMorePage);
  Router.register("/customization", renderCustomizationPage);

  // ── Admin-only routes ───────────────────────────────────────────────────────
  Router.register("/admin/users", function(container) {
    if (!AuthState.isAdmin) { navigate('/dashboard'); return; }
    renderAdminUsersPage(container);
  });

  Router.setNotFound(renderNotFoundPage);
  Router.render();

  // Fade splash screen
  const splash = document.getElementById("app-splash");
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => { if (splash.parentNode) splash.remove(); }, 400);
    }, 800);
  }
})();

// ── Api helpers (getSession / syncState) ────────────────────────────────────
window.Api = window.Api || {};
Api.getSession = function() {
  return fetch('/api/state', { credentials: 'include' }).then(function(r) { return r.json(); });
};
Api.syncState = function() {
  return fetch('/api/state', { credentials: 'include' }).then(function(r) { return r.json(); }).then(function(data) {
    if (data && typeof data.balance === 'number') {
      Stores.balance.set({ balance: data.balance });
      AuthState.balance = data.balance;
      AuthState.safeboxBalance = data.safebox_balance || 0;
    }
  });
};

// ── Admin session sync (non-blocking) ────────────────────────────────────────
window.__IS_ADMIN = false;
document.addEventListener('DOMContentLoaded', function() {
  Api.getSession().then(function(data) {
    if (data && data.is_admin) window.__IS_ADMIN = true;
    Api.syncState().catch(function(){});
  }).catch(function(){});
});

// ── Normal-user balance polling (30 s) so admin balance updates show live ───
(function startBalancePoll() {
  setInterval(function() {
    if (!AuthState.isLoggedIn) return;
    fetch('/api/user/balance', { credentials: 'include' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.ok && typeof data.balance === 'number') {
          var prev = Stores.balance.get().balance;
          if (prev !== data.balance) {
            Stores.balance.set({ balance: data.balance });
            AuthState.balance = data.balance;
          }
        }
      })
      .catch(function(){});
  }, 30000);
})();
