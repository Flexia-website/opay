// Persistent Storage Manager - maintains data regardless of design changes

const PersistentStorage = {
  // Keys for different data types
  KEYS: {
    TRANSACTIONS: 'opay_transactions',
    BALANCE: 'opay_balance',
    USER_DATA: 'opay_user_data',
    SETTINGS: 'opay_settings',
    CACHE: 'opay_cache'
  },

  // Save transactions
  saveTransactions(transactions) {
    try {
      localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
      return true;
    } catch (e) {
      console.error('Failed to save transactions:', e);
      return false;
    }
  },

  // Get transactions
  getTransactions() {
    try {
      const data = localStorage.getItem(this.KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get transactions:', e);
      return [];
    }
  },

  // Save balance
  saveBalance(balance) {
    try {
      localStorage.setItem(this.KEYS.BALANCE, JSON.stringify(balance));
      return true;
    } catch (e) {
      console.error('Failed to save balance:', e);
      return false;
    }
  },

  // Get balance
  getBalance() {
    try {
      const data = localStorage.getItem(this.KEYS.BALANCE);
      return data ? JSON.parse(data) : { balance: 0 };
    } catch (e) {
      console.error('Failed to get balance:', e);
      return { balance: 0 };
    }
  },

  // Save user data
  saveUserData(userData) {
    try {
      localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (e) {
      console.error('Failed to save user data:', e);
      return false;
    }
  },

  // Get user data
  getUserData() {
    try {
      const data = localStorage.getItem(this.KEYS.USER_DATA);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to get user data:', e);
      return {};
    }
  },

  // Save settings
  saveSettings(settings) {
    try {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  },

  // Get settings
  getSettings() {
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to get settings:', e);
      return {};
    }
  },

  // Add to cache (any key-value data)
  setCache(key, value) {
    try {
      const cache = this.getCache();
      cache[key] = value;
      localStorage.setItem(this.KEYS.CACHE, JSON.stringify(cache));
      return true;
    } catch (e) {
      console.error('Failed to cache:', e);
      return false;
    }
  },

  // Get from cache
  getCache(key = null) {
    try {
      const data = localStorage.getItem(this.KEYS.CACHE);
      const cache = data ? JSON.parse(data) : {};
      return key ? cache[key] : cache;
    } catch (e) {
      console.error('Failed to get cache:', e);
      return key ? null : {};
    }
  },

  // Export all data for backup
  exportData() {
    try {
      return {
        transactions: this.getTransactions(),
        balance: this.getBalance(),
        userData: this.getUserData(),
        settings: this.getSettings(),
        cache: this.getCache(),
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error('Failed to export data:', e);
      return null;
    }
  },

  // Import data from backup
  importData(data) {
    try {
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.balance) this.saveBalance(data.balance);
      if (data.userData) this.saveUserData(data.userData);
      if (data.settings) this.saveSettings(data.settings);
      if (data.cache) localStorage.setItem(this.KEYS.CACHE, JSON.stringify(data.cache));
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  },

  // Clear all data
  clearAll() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Failed to clear storage:', e);
      return false;
    }
  },

  // Check storage available
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
};

window.PersistentStorage = PersistentStorage;
