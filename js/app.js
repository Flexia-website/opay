// ---- Route registration ----
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
Router.setNotFound(renderNotFoundPage);

Router.render();

// Fade out the launch splash screen once the app has mounted.
window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("app-splash");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 400);
  }, 1100);
});
