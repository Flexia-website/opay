// ── Admin: User Management Page ─────────────────────────────────────────────
async function renderAdminUsersPage(container) {
  if (!AuthState.isAdmin) {
    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;"><p>Access denied.</p></div>`;
    return;
  }

  let users = [];
  let selectedUser = null;

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json();
      users = data.users || [];
    } catch (e) {
      toast.error('Failed to load users');
    }
  }

  function fmt(n) { return '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function renderList() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;">
      <!-- Header -->
      <div style="background:white;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid #f3f4f6;position:sticky;top:0;z-index:10;">
        <button id="back-btn" style="background:none;border:none;cursor:pointer;color:#374151;">${Icon('arrow-left',{size:22})}</button>
        <h2 style="margin:0;font-size:1.1rem;font-weight:700;flex:1;">User Management</h2>
        <button id="add-user-btn" style="background:#00B875;color:white;border:none;border-radius:0.5rem;padding:0.5rem 1rem;font-weight:600;font-size:0.85rem;cursor:pointer;display:flex;align-items:center;gap:0.4rem;">
          ${Icon('user-plus',{size:16})} Add User
        </button>
      </div>

      <!-- Stats bar -->
      <div style="display:flex;gap:1rem;padding:1rem;overflow-x:auto;">
        <div style="min-width:120px;background:white;border-radius:0.75rem;padding:1rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="font-size:1.5rem;font-weight:800;color:#00B875;">${users.length}</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">Total Users</div>
        </div>
        <div style="min-width:120px;background:white;border-radius:0.75rem;padding:1rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="font-size:1.5rem;font-weight:800;color:#059669;">${users.filter(u=>u.is_active).length}</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">Active</div>
        </div>
        <div style="min-width:140px;background:white;border-radius:0.75rem;padding:1rem;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="font-size:1rem;font-weight:800;color:#1d4ed8;">${fmt(users.reduce((a,u)=>a+u.balance,0))}</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">Total Balance</div>
        </div>
      </div>

      <!-- User list -->
      <div style="padding:0 1rem 5rem;">
        ${users.length === 0 ? `
          <div style="text-align:center;padding:3rem 1rem;color:#9ca3af;">
            ${Icon('users',{size:48})}
            <p style="margin-top:1rem;font-size:0.9rem;">No users yet. Add one above.</p>
          </div>` :
          users.map(u => `
          <div class="user-card" data-uid="${u.id}" style="background:white;border-radius:0.75rem;padding:1rem;margin-bottom:0.75rem;box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
            <div style="width:44px;height:44px;border-radius:9999px;background:${u.is_active ? '#d1fae5' : '#fee2e2'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${Icon('user',{size:20, color: u.is_active ? '#059669' : '#ef4444'})}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;color:#111827;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.full_name || u.username}</div>
              <div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">@${u.username} · ${u.email}</div>
              <div style="font-size:0.8rem;color:#059669;font-weight:600;margin-top:2px;">${fmt(u.balance)}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <span style="font-size:0.7rem;padding:2px 8px;border-radius:9999px;background:${u.is_active ? '#d1fae5' : '#fee2e2'};color:${u.is_active ? '#059669' : '#ef4444'};font-weight:600;">${u.is_active ? 'Active' : 'Inactive'}</span>
              <div style="color:#9ca3af;margin-top:4px;">${Icon('chevron-right',{size:16})}</div>
            </div>
          </div>`).join('')
        }
      </div>
    </div>`;

    container.querySelector('#back-btn').addEventListener('click', () => navigate('/me'));
    container.querySelector('#add-user-btn').addEventListener('click', () => openAddUserModal());
    container.querySelectorAll('.user-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedUser = users.find(u => u.id === card.dataset.uid);
        openUserDetailSheet(selectedUser);
      });
    });
  }

  function openAddUserModal() {
    const { close, content } = UI.openDialog(`
      <h3 style="margin:0 0 1.25rem;font-size:1rem;font-weight:700;">Add New User</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <input id="m-fullname" type="text" placeholder="Full Name" class="input" />
        <input id="m-username" type="text" placeholder="Username" class="input" autocapitalize="none" />
        <input id="m-email" type="email" placeholder="Email" class="input" />
        <input id="m-phone" type="tel" placeholder="Phone" class="input" />
        <input id="m-password" type="password" placeholder="Password (min 6 chars)" class="input" />
        <input id="m-balance" type="number" placeholder="Initial Balance (₦)" class="input" min="0" />
        <textarea id="m-notes" placeholder="Admin notes (optional)" class="input" style="min-height:60px;resize:vertical;"></textarea>
        <div id="m-err" style="color:#ef4444;font-size:0.8rem;min-height:1.2em;"></div>
        <button id="m-submit" class="btn btn-primary" style="background:#00B875;color:white;border:none;">Create User</button>
      </div>
    `);
    content.querySelector('#m-submit').addEventListener('click', async () => {
      const errEl = content.querySelector('#m-err');
      errEl.textContent = '';
      const body = {
        full_name: content.querySelector('#m-fullname').value.trim(),
        username: content.querySelector('#m-username').value.trim(),
        email: content.querySelector('#m-email').value.trim(),
        phone: content.querySelector('#m-phone').value.trim(),
        password: content.querySelector('#m-password').value,
        balance: parseFloat(content.querySelector('#m-balance').value || '0'),
        notes: content.querySelector('#m-notes').value.trim(),
      };
      if (!body.username || !body.email || !body.password) {
        errEl.textContent = 'Username, email, password required';
        return;
      }
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.ok) {
          toast.success('User created!');
          close();
          await loadUsers();
          renderList();
        } else {
          errEl.textContent = data.error || 'Failed';
        }
      } catch (e) {
        errEl.textContent = 'Network error';
      }
    });
  }

  function openUserDetailSheet(user) {
    const { close, content } = UI.openSheet(`
      <div style="padding:0 0 1rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;">
          <div style="width:52px;height:52px;border-radius:9999px;background:#d1fae5;display:flex;align-items:center;justify-content:center;">
            ${Icon('user',{size:24,color:'#059669'})}
          </div>
          <div>
            <div style="font-weight:700;font-size:1rem;">${user.full_name || user.username}</div>
            <div style="font-size:0.75rem;color:#6b7280;">@${user.username}</div>
          </div>
          <span style="margin-left:auto;font-size:0.72rem;padding:2px 10px;border-radius:9999px;background:${user.is_active ? '#d1fae5':'#fee2e2'};color:${user.is_active ? '#059669':'#ef4444'};font-weight:600;">${user.is_active ? 'Active' : 'Inactive'}</span>
        </div>

        <div style="background:#f9fafb;border-radius:0.75rem;padding:1rem;margin-bottom:1rem;display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">BALANCE</div><div style="font-weight:700;color:#059669;font-size:1rem;">₦${Number(user.balance||0).toLocaleString()}</div></div>
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">ACCOUNT NO.</div><div style="font-weight:600;font-size:0.85rem;">${user.account_number||'—'}</div></div>
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">EMAIL</div><div style="font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;">${user.email}</div></div>
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">PHONE</div><div style="font-size:0.8rem;">${user.phone||'—'}</div></div>
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">JOINED</div><div style="font-size:0.8rem;">${user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div></div>
          <div><div style="font-size:0.7rem;color:#9ca3af;font-weight:600;">LAST LOGIN</div><div style="font-size:0.8rem;">${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</div></div>
        </div>

        ${user.notes ? `<div style="background:#fffbeb;border-radius:0.5rem;padding:0.75rem;margin-bottom:1rem;font-size:0.8rem;color:#92400e;border:1px solid #fde68a;"><strong>Notes:</strong> ${user.notes}</div>` : ''}

        <div style="display:flex;flex-direction:column;gap:0.6rem;">
          <button class="action-btn" data-action="edit-balance" style="width:100%;padding:0.75rem;border-radius:0.6rem;border:1.5px solid #00B875;background:white;color:#00B875;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:0.5rem;justify-content:center;">
            ${Icon('wallet',{size:16})} Adjust Balance
          </button>
          <button class="action-btn" data-action="edit-user" style="width:100%;padding:0.75rem;border-radius:0.6rem;border:1.5px solid #3b82f6;background:white;color:#3b82f6;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:0.5rem;justify-content:center;">
            ${Icon('edit',{size:16})} Edit User
          </button>
          <button class="action-btn" data-action="toggle-active" style="width:100%;padding:0.75rem;border-radius:0.6rem;border:1.5px solid ${user.is_active ? '#f59e0b':'#059669'};background:white;color:${user.is_active ? '#f59e0b':'#059669'};font-weight:600;cursor:pointer;display:flex;align-items:center;gap:0.5rem;justify-content:center;">
            ${Icon(user.is_active ? 'user-x':'user-check',{size:16})} ${user.is_active ? 'Deactivate':'Activate'} Account
          </button>
          <button class="action-btn" data-action="delete-user" style="width:100%;padding:0.75rem;border-radius:0.6rem;border:1.5px solid #ef4444;background:white;color:#ef4444;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:0.5rem;justify-content:center;">
            ${Icon('trash-2',{size:16})} Delete User
          </button>
        </div>
      </div>
    `);

    content.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;
        if (action === 'adjust-balance' || action === 'edit-balance') {
          close();
          openBalanceModal(user);
        } else if (action === 'edit-user') {
          close();
          openEditUserModal(user);
        } else if (action === 'toggle-active') {
          await fetch(`/api/admin/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ is_active: !user.is_active })
          });
          toast.success(user.is_active ? 'User deactivated' : 'User activated');
          close();
          await loadUsers();
          renderList();
        } else if (action === 'delete-user') {
          if (!confirm(`Delete ${user.username}? This cannot be undone.`)) return;
          await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE', credentials: 'include' });
          toast.success('User deleted');
          close();
          await loadUsers();
          renderList();
        }
      });
    });
  }

  function openBalanceModal(user) {
    const { close, content } = UI.openDialog(`
      <h3 style="margin:0 0 1rem;font-size:1rem;font-weight:700;">Adjust Balance — ${user.username}</h3>
      <p style="margin:0 0 1rem;font-size:0.85rem;color:#6b7280;">Current: <strong>₦${Number(user.balance||0).toLocaleString()}</strong></p>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <select id="bal-op" class="input">
          <option value="set">Set exact amount</option>
          <option value="add">Add to balance</option>
          <option value="subtract">Subtract from balance</option>
        </select>
        <input id="bal-amount" type="number" placeholder="Amount (₦)" class="input" min="0" />
        <div id="bal-err" style="color:#ef4444;font-size:0.8rem;min-height:1em;"></div>
        <button id="bal-submit" style="background:#00B875;color:white;border:none;border-radius:0.5rem;padding:0.75rem;font-weight:600;cursor:pointer;">Apply</button>
      </div>
    `);
    content.querySelector('#bal-submit').addEventListener('click', async () => {
      const op = content.querySelector('#bal-op').value;
      const amount = parseFloat(content.querySelector('#bal-amount').value || '0');
      if (!amount || amount <= 0) { content.querySelector('#bal-err').textContent = 'Enter a valid amount'; return; }
      const endpoint = op === 'set' ? '/api/balance/set' : '/api/balance/adjust';
      const body = op === 'set' ? { amount, user_id: user.id } : { operation: op, amount, user_id: user.id };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Balance updated: ₦${Number(data.balance).toLocaleString()}`);
        close();
        await loadUsers();
        renderList();
      } else {
        content.querySelector('#bal-err').textContent = data.error || 'Failed';
      }
    });
  }

  function openEditUserModal(user) {
    const { close, content } = UI.openDialog(`
      <h3 style="margin:0 0 1.25rem;font-size:1rem;font-weight:700;">Edit User — ${user.username}</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <input id="e-fullname" type="text" placeholder="Full Name" class="input" value="${user.full_name||''}" />
        <input id="e-email" type="email" placeholder="Email" class="input" value="${user.email||''}" />
        <input id="e-phone" type="tel" placeholder="Phone" class="input" value="${user.phone||''}" />
        <input id="e-password" type="password" placeholder="New Password (leave blank to keep)" class="input" />
        <textarea id="e-notes" placeholder="Admin notes" class="input" style="min-height:60px;resize:vertical;">${user.notes||''}</textarea>
        <div id="e-err" style="color:#ef4444;font-size:0.8rem;min-height:1.2em;"></div>
        <button id="e-submit" style="background:#3b82f6;color:white;border:none;border-radius:0.5rem;padding:0.75rem;font-weight:600;cursor:pointer;">Save Changes</button>
      </div>
    `);
    content.querySelector('#e-submit').addEventListener('click', async () => {
      const body = {
        full_name: content.querySelector('#e-fullname').value.trim(),
        email: content.querySelector('#e-email').value.trim(),
        phone: content.querySelector('#e-phone').value.trim(),
        notes: content.querySelector('#e-notes').value.trim(),
      };
      const pw = content.querySelector('#e-password').value;
      if (pw) body.password = pw;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('User updated');
        close();
        await loadUsers();
        renderList();
      } else {
        content.querySelector('#e-err').textContent = data.error || 'Failed';
      }
    });
  }

  await loadUsers();
  renderList();
}

window.renderAdminUsersPage = renderAdminUsersPage;
