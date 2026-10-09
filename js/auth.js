// ── Global Auth State ──────────────────────────────────────────────────────────
window.AuthState = {
  isAdmin: false,
  isLoggedIn: false,
  userId: null,
  username: '',
  fullName: '',
  accountNumber: '',
  balance: 0,
  safeboxBalance: 0,
};

window.Auth = {
  async init() {
    try {
      const res = await fetch('/api/state', { credentials: 'include' });
      const data = await res.json();
      if (data.user) {
        AuthState.isLoggedIn = true;
        AuthState.isAdmin = data.is_admin;
        AuthState.username = data.user;
        AuthState.userId = data.user_id || null;
        AuthState.fullName = data.full_name || data.user;
        AuthState.accountNumber = data.account_number || '';
        AuthState.balance = data.balance || 0;
        AuthState.safeboxBalance = data.safebox_balance || 0;
        // Sync stores
        if (data.customization) {
          Stores.customization.set(data.customization);
        }
        Stores.balance.set({ balance: data.balance || 0 });
        return true;
      }
    } catch (e) {}
    AuthState.isLoggedIn = false;
    return false;
  },

  async logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    AuthState.isLoggedIn = false;
    AuthState.isAdmin = false;
    AuthState.userId = null;
    navigate('/');
  },

  isAdminUser() {
    return AuthState.isAdmin;
  }
};
