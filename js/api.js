// API helper
window.API = {
  async get(path) {
    const r = await fetch(path, { credentials: 'include' });
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    return r.json();
  }
};
