// ── OPay Backend API Bridge ───────────────────────────────────────────────────
// This module syncs the app's stores with the Flask backend.
// localStorage is still used as a fast cache; backend is the source of truth.

const API_BASE = '';  // same origin

const Api = {
  async _fetch(path, opts = {}) {
    try {
      const res = await fetch(API_BASE + '/api' + path, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
        ...opts,
      });
      return await res.json();
    } catch (e) {
      console.warn('API error:', path, e);
      return null;
    }
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  async login(method, credential) {
    const body = { method };
    if (method === 'password') body.password = credential;
    if (method === 'pin')      body.pin = credential;
    return this._fetch('/login', { method: 'POST', body: JSON.stringify(body) });
  },

  async logout() {
    return this._fetch('/logout', { method: 'POST' });
  },

  async getSession() {
    return this._fetch('/session');
  },

  // ── State sync ────────────────────────────────────────────────────────────
  async syncState() {
    const data = await this._fetch('/state');
    if (!data) return;

    // Sync balance
    if (data.balance !== undefined) {
      Stores.balance.set({ balance: data.balance });
    }

    // Sync customization
    if (data.customization) {
      const c = data.customization;
      const update = {};
      if (c.primaryColor)       update.primaryColor       = c.primaryColor;
      if (c.secondaryColor)     update.secondaryColor     = c.secondaryColor;
      if (c.profilePhoto)       update.profilePhoto       = c.profilePhoto;
      if (c.profilePhotoSize)   update.profilePhotoSize   = c.profilePhotoSize;
      if (c.buttonImages)       update.buttonImages       = c.buttonImages;
      if (c.buttonBackgroundColor) update.buttonBackgroundColor = c.buttonBackgroundColor;
      if (c.networkImages)      update.networkImages      = c.networkImages;
      Stores.customization.set(update);
    }

    // Store admin status globally
    window.__IS_ADMIN = !!data.is_admin;
  },

  // ── Balance (admin only) ──────────────────────────────────────────────────
  async adjustBalance(operation, amount) {
    return this._fetch('/balance/adjust', {
      method: 'POST',
      body: JSON.stringify({ operation, amount }),
    });
  },

  // ── Image upload ──────────────────────────────────────────────────────────
  /**
   * Upload to Cloudinary via backend.
   * @param {File} file
   * @param {'button'|'profile'|'network'} type
   * @param {string} key  - button key or network id
   */
  async uploadImage(file, type, key) {
    const fd = new FormData();
    fd.append('file', file);
    if (key) fd.append('key', key);

    const endpoint = type === 'profile' ? '/upload/profile'
                   : type === 'network'  ? '/upload/network'
                   :                       '/upload/image';

    try {
      const res = await fetch(API_BASE + '/api' + endpoint, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      return await res.json();
    } catch (e) {
      console.warn('Upload error:', e);
      return { error: e.message };
    }
  },

  async resetImage(type, key) {
    return this._fetch('/image/reset', {
      method: 'POST',
      body: JSON.stringify({ type, key }),
    });
  },

  async updateCustomization(patch) {
    return this._fetch('/customization', {
      method: 'POST',
      body: JSON.stringify(patch),
    });
  },
};

window.Api = Api;

// Auto-sync on load
document.addEventListener('DOMContentLoaded', () => {
  Api.syncState().catch(() => {});
});
