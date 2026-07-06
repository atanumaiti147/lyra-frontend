import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../api/client';
import Loader from '../../components/Loader';

export default function AdminUsers() {
  const { user } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function loadUsers() {
    const d = await api.adminUsers();
    setUsers(d.users);
    setAllPermissions(d.allPermissions);
    setRoles(d.roles);
  }

  useEffect(() => {
    loadUsers().catch((e) => setError(e.message)).finally(() => setLoaded(true));
  }, []);

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function changeRole(id, role) {
    try {
      await api.adminSetRole(id, role);
      await loadUsers();
      flash();
    } catch (e) {
      setError(e.message);
    }
  }

  async function togglePermission(u, perm, checked) {
    const next = checked ? [...(u.permissions || []), perm] : (u.permissions || []).filter((p) => p !== perm);
    try {
      await api.adminSetPermissions(u.id, next);
      await loadUsers();
      flash();
    } catch (e) {
      setError(e.message);
    }
  }

  async function resetTotp(id) {
    if (!confirm("Reset this admin's 2FA? They will need to re-scan a new QR code.")) return;
    try {
      await api.adminResetTotp(id);
      await loadUsers();
      flash();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✅ Saved.</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

      <div className="card admin-card">
        <h3 style={{ marginTop: 0 }}>Users &amp; Roles</h3>
        {user.role !== 'superadmin' && (
          <p style={{ color: 'var(--ink-faint)', fontSize: '0.9rem' }}>Only the super admin can change roles or permissions. You can view the list below.</p>
        )}
        {!loaded ? (
          <Loader label="Loading users…" size="sm" />
        ) : (
          <div className="dash-table-scroll">
            <table className="dash-table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th>User</th><th>Role</th><th>Permissions</th><th>2FA</th>
                  {user.role === 'superadmin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={u.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      {u.username}
                      {u.isSuperAdmin && <span className="badge badge-open" style={{ marginLeft: 4 }}>Super Admin</span>}
                    </td>
                    <td>
                      {u.isSuperAdmin ? 'superadmin (locked)' : user.role === 'superadmin' ? (
                        <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>
                          {roles.filter((r) => r !== 'superadmin').map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : u.role}
                    </td>
                    <td>
                      {u.isSuperAdmin ? 'all (implicit)' : user.role === 'superadmin' && u.role === 'admin' ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                          {allPermissions.map((p) => (
                            <label key={p} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <input
                                type="checkbox"
                                checked={(u.permissions || []).includes(p)}
                                onChange={(e) => togglePermission(u, p, e.target.checked)}
                              />
                              {p}
                            </label>
                          ))}
                        </div>
                      ) : (u.permissions || []).join(', ') || '—'}
                    </td>
                    <td>{u.totpEnabled ? '✅ enabled' : '—'}</td>
                    {user.role === 'superadmin' && (
                      <td>
                        {!u.isSuperAdmin && u.totpEnabled && (
                          <button className="btn btn-ghost btn-sm" onClick={() => resetTotp(u.id)}>Reset 2FA</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
