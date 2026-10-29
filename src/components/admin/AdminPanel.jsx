import { useCallback, useEffect, useMemo, useState } from 'react';
import kaheLogo from '../../../assets/LOGO.png';
import './admin-panel.css';

const collections = [
  { id: 'rooms', label: 'Campus rooms', shortLabel: 'Rooms', description: 'Buildings, departments, and verified campus locations' },
  { id: 'staff', label: 'Staff directory', shortLabel: 'Staff', description: 'Faculty and staff directory records' },
  { id: 'college-info', label: 'College information', shortLabel: 'College info', description: 'Knowledge records used by the assistant' },
];

async function adminRequest(token, path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem('kahe-admin-token');
      window.dispatchEvent(new Event('kahe-admin-session-expired'));
    }
    throw new Error(result.error || 'The request could not be completed.');
  }
  return result;
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem('kahe-admin-token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeCollection, setActiveCollection] = useState('overview');
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [editor, setEditor] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [editorError, setEditorError] = useState('');
  const pageSize = 25;

  const selectedCollection = collections.find((item) => item.id === activeCollection) || collections[0];
  const recordsCollection = activeCollection === 'overview' ? 'rooms' : activeCollection;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const loadRecords = useCallback(async () => {
    if (!token) return;
    setError('');
    try {
      const result = await adminRequest(token, `/api/admin/records/${recordsCollection}?page=${page}&limit=${pageSize}`);
      setRecords(result.records);
      setTotal(result.total);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [page, recordsCollection, token]);

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    try {
      setDashboard(await adminRequest(token, '/api/admin/dashboard'));
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [token]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadDashboard();
    const timer = window.setInterval(loadDashboard, 30000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  useEffect(() => {
    const expireSession = () => setToken('');
    window.addEventListener('kahe-admin-session-expired', expireSession);
    return () => window.removeEventListener('kahe-admin-session-expired', expireSession);
  }, []);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(query));
  }, [records, search]);

  const columns = useMemo(() => {
    const keys = new Set();
    records.forEach((record) => Object.keys(record).forEach((key) => keys.add(key)));
    return ['_id', ...Array.from(keys).filter((key) => key !== '_id').slice(0, 5)];
  }, [records]);

  async function handleLogin(event) {
    event.preventDefault();
    setBusy(true);
    setLoginError('');
    try {
      const result = await adminRequest('', '/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      sessionStorage.setItem('kahe-admin-token', result.token);
      setToken(result.token);
      setPassword('');
    } catch (requestError) {
      setLoginError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await adminRequest(token, '/api/admin/logout', { method: 'POST' });
    } catch (requestError) {
      setLoginError(`Signed out locally; the server session could not be revoked: ${requestError.message}`);
    } finally {
      sessionStorage.removeItem('kahe-admin-token');
      setToken('');
      setDashboard(null);
      setRecords([]);
    }
  }

  function openEditor(record) {
    setEditor(record ? { id: record._id, isNew: false } : { id: '', isNew: true });
    const editable = record ? Object.fromEntries(Object.entries(record).filter(([key]) => key !== '_id')) : {};
    setEditorText(JSON.stringify(editable, null, 2));
    setEditorError('');
  }

  async function saveRecord(event) {
    event.preventDefault();
    let record;
    try {
      record = JSON.parse(editorText);
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new Error('Enter a JSON object to save this record.');
      }
    } catch (parseError) {
      setEditorError(parseError instanceof SyntaxError ? 'Check the JSON syntax and try again.' : parseError.message);
      return;
    }
    setBusy(true);
    setEditorError('');
    try {
      await adminRequest(token, editor.isNew
        ? `/api/admin/records/${selectedCollection.id}`
        : `/api/admin/records/${selectedCollection.id}/${encodeURIComponent(editor.id)}`, {
        method: editor.isNew ? 'POST' : 'PUT',
        body: JSON.stringify({ record }),
      });
      setEditor(null);
      await Promise.all([loadRecords(), loadDashboard()]);
    } catch (requestError) {
      setEditorError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(record) {
    if (!window.confirm('Delete this record permanently? This action cannot be undone.')) return;
    setError('');
    try {
      await adminRequest(token, `/api/admin/records/${selectedCollection.id}/${encodeURIComponent(record._id)}`, { method: 'DELETE' });
      await Promise.all([loadRecords(), loadDashboard()]);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function selectCollection(collectionId) {
    setActiveCollection(collectionId);
    setPage(1);
    setSearch('');
  }

  if (!token) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <div className="admin-login-brand">
            <img className="admin-college-logo" src={kaheLogo} alt="Karpagam Academy of Higher Education logo" />
            <div>
              <span className="admin-eyebrow">KAHE CAMPUS ASSISTANT</span>
              <h1>Administrator sign in</h1>
            </div>
          </div>
          <p className="admin-login-intro">Sign in to manage campus information and monitor assistant services.</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <label htmlFor="admin-username">Username</label>
            <input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {loginError && <p className="admin-form-error" role="alert">{loginError}</p>}
            <button type="submit" className="admin-primary-button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'}</button>
          </form>
          <div className="admin-login-foot"><span className="admin-lock-icon">●</span> Protected administrator access</div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-sidebar-brand" href="/admin" aria-label="KAHE administration home">
          <span className="admin-sidebar-logo-frame"><img src={kaheLogo} alt="" /></span>
          <span><strong>KAHE</strong><small>ADMIN CONSOLE</small></span>
        </a>
        <div className="admin-sidebar-caption">WORKSPACE</div>
        <button className={`admin-nav-item ${activeCollection === 'overview' ? 'is-active' : ''}`} onClick={() => selectCollection('overview')}>
          <span className="admin-nav-glyph">◫</span> Overview
        </button>
        <div className="admin-sidebar-caption">DATABASE</div>
        {collections.map((collection) => (
          <button key={collection.id} className={`admin-nav-item ${activeCollection === collection.id ? 'is-active' : ''}`} onClick={() => selectCollection(collection.id)}>
            <span className="admin-nav-glyph">{collection.id === 'rooms' ? '⌂' : collection.id === 'staff' ? '♙' : '▤'}</span>
            {collection.label}
            <span className="admin-nav-count">{dashboard?.counts?.[{ rooms: 'rooms', staff: 'staff', 'college-info': 'collegeInfo' }[collection.id]] ?? '—'}</span>
          </button>
        ))}
        <div className="admin-sidebar-bottom">
          <span className="admin-online-dot" /> Admin session active
          <button onClick={handleLogout} className="admin-logout-button">Sign out <span>↗</span></button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">KAHE <span>/</span> Administration</div>
          <div className="admin-topbar-user"><span className="admin-avatar">{(dashboard?.models?.chat && 'A') || 'A'}</span><span>Administrator</span></div>
        </header>
        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">CAMPUS OPERATIONS</span>
              <h1>{activeCollection === 'overview' ? 'Dashboard overview' : selectedCollection.label}</h1>
              <p>{activeCollection === 'overview' ? 'Monitor your services and manage the information powering your assistant.' : selectedCollection.description}</p>
            </div>
            <button type="button" className="admin-refresh-button" onClick={() => Promise.all([loadDashboard(), loadRecords()])}><span>↻</span> Refresh data</button>
          </div>

          {error && <div className="admin-alert" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}

          <section className="admin-stat-grid" aria-label="Database summary">
            <article className="admin-stat-card"><span className="admin-stat-icon rooms-icon">⌂</span><span className="admin-stat-label">CAMPUS ROOMS</span><strong>{dashboard?.counts?.rooms ?? '—'}</strong><small>Records in database</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon staff-icon">♙</span><span className="admin-stat-label">STAFF DIRECTORY</span><strong>{dashboard?.counts?.staff ?? '—'}</strong><small>Faculty and staff records</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon info-icon">▤</span><span className="admin-stat-label">COLLEGE INFO</span><strong>{dashboard?.counts?.collegeInfo ?? '—'}</strong><small>Knowledge records</small></article>
            <article className="admin-stat-card"><span className="admin-stat-icon chunks-icon">◈</span><span className="admin-stat-label">ACTIVE CHUNKS</span><strong>{dashboard?.chunksInMemory ?? '—'}</strong><small>Loaded for assistant retrieval</small></article>
          </section>

          <section className="admin-monitor-grid">
            <article className="admin-panel-card admin-health-card">
              <div className="admin-card-heading"><div><h2>System health</h2><p>Live status, refreshed every 30 seconds</p></div><span className="admin-live-indicator"><i /> LIVE</span></div>
              <div className="admin-service-list">
                <ServiceStatus label="MongoDB database" value={dashboard?.database} />
                <ServiceStatus label="Ollama assistant service" value={dashboard?.ollama} />
                <div className="admin-service-row"><span>Chat model</span><strong>{dashboard?.models?.chat || 'Checking…'}</strong></div>
                <div className="admin-service-row"><span>Embedding model</span><strong>{dashboard?.models?.embedding || 'Checking…'}</strong></div>
                <div className="admin-service-row"><span>Backend uptime</span><strong>{dashboard ? formatUptime(dashboard.uptimeSeconds) : 'Checking…'}</strong></div>
              </div>
            </article>
            <article className="admin-panel-card admin-activity-card">
              <div className="admin-card-heading"><div><h2>Recent activity</h2><p>Latest administrator actions in this server session</p></div></div>
              {dashboard?.recentActivity?.length ? (
                <ul className="admin-activity-list">
                  {dashboard.recentActivity.map((item, index) => (
                    <li key={`${item.timestamp}-${index}`}><span className="admin-activity-marker">{item.action === 'Deleted record' ? '−' : item.action === 'Signed in' ? '↗' : '+'}</span><span className="admin-activity-copy"><strong>{item.action}</strong><small>{item.collection}{item.recordId ? ` · ${item.recordId}` : ''}</small></span><time>{formatTime(item.timestamp)}</time></li>
                  ))}
                </ul>
              ) : <div className="admin-empty-activity">Admin actions will appear here as changes are made.</div>}
            </article>
          </section>

          <section className="admin-panel-card admin-records-card">
            <div className="admin-records-heading">
              <div><h2>{selectedCollection.label}</h2><p>{selectedCollection.description}</p></div>
              <button className="admin-primary-button admin-add-button" onClick={() => openEditor(null)}><span>+</span> Add record</button>
            </div>
            <div className="admin-table-tools">
              <label className="admin-search"><span>⌕</span><input aria-label="Search current page" placeholder="Search these records…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
              <span className="admin-result-count">{total.toLocaleString()} total records</span>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead><tr>{columns.map((column) => <th key={column}>{column === '_id' ? 'RECORD ID' : column.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').toUpperCase()}</th>)}<th className="admin-actions-heading">ACTIONS</th></tr></thead>
                <tbody>
                  {visibleRecords.map((record) => (
                    <tr key={String(record._id)}>
                      {columns.map((column) => <td key={column} title={displayValue(record[column])}>{column === '_id' ? <code>{String(record._id)}</code> : displayValue(record[column])}</td>)}
                      <td className="admin-row-actions"><button onClick={() => openEditor(record)}>Edit</button><button className="admin-delete-button" onClick={() => deleteRecord(record)}>Delete</button></td>
                    </tr>
                  ))}
                  {!visibleRecords.length && <tr><td colSpan={columns.length + 1} className="admin-table-empty">{search ? 'No records on this page match your search.' : 'No records found in this collection.'}</td></tr>}
                </tbody>
              </table>
            </div>
            <footer className="admin-table-footer"><span>Page {page} of {pageCount}</span><div><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><button disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></div></footer>
          </section>
          <footer className="admin-footer">KAHE Campus Assistant <span>·</span> Administrator workspace</footer>
        </div>
      </section>

      {editor && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditor(null)}>
          <section className="admin-editor-modal" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <div className="admin-modal-heading"><div><span className="admin-eyebrow">DATABASE RECORD</span><h2 id="admin-editor-title">{editor.isNew ? 'Create record' : 'Edit record'}</h2></div><button onClick={() => setEditor(null)} aria-label="Close editor">×</button></div>
            <p className="admin-editor-hint">Enter a valid JSON object. The record identifier is managed automatically.</p>
            <form onSubmit={saveRecord}>
              <textarea aria-label="Record JSON" spellCheck="false" value={editorText} onChange={(event) => setEditorText(event.target.value)} />
              {editorError && <p className="admin-form-error" role="alert">{editorError}</p>}
              <div className="admin-modal-actions"><button type="button" className="admin-cancel-button" onClick={() => setEditor(null)}>Cancel</button><button type="submit" className="admin-primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save record'}</button></div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function ServiceStatus({ label, value }) {
  const state = value === 'connected' ? 'connected' : value === 'error' ? 'error' : 'pending';
  const caption = value === 'connected' ? 'Connected' : value === 'error' ? 'Unavailable' : value || 'Checking…';
  return <div className="admin-service-row"><span>{label}</span><strong className={`admin-status-text is-${state}`}><i />{caption}</strong></div>;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [days ? `${days}d` : '', `${hours}h`, `${minutes}m`].filter(Boolean).join(' ');
}
