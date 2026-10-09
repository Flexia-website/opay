// ── Auth guard: redirect to login if not logged in ───────────────────────────
(async function() {
  const publicRoutes = ['/', '/register', '/login'];
  const hash = location.hash.slice(1) || '/';
  if (!publicRoutes.includes(hash)) {
    const res = await fetch('/api/state', { credentials: 'include' });
    const data = await res.json();
    if (!data.user) {
      location.hash = '/';
      return;
    }
    // Sync auth state
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
  }
})();

// ── Route registration ────────────────────────────────────────────────────────
Router.register("/", renderLoginPage);
Router.register("/dashboard", renderDashboard);
Router.register("/me", renderMePage);
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

// ── Admin-only routes ─────────────────────────────────────────────────────────
Router.register("/admin/users", function(container) {
  if (!AuthState.isAdmin) { navigate('/dashboard'); return; }
  renderAdminUsersPage(container);
});

Router.setNotFound(renderNotFoundPage);
Router.render();

// Fade splash screen
window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 400);
  }, 1100);
});
