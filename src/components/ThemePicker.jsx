import React, { useEffect, useState } from 'react';

const themes = [
  { id: 'theme-professional', label: 'Professional' },
  { id: 'theme-cool', label: 'Cool' },
  { id: 'theme-warm', label: 'Warm' },
  { id: 'theme-dark', label: 'Dark' },
  { id: 'theme-bright', label: 'Bright' },
];

const ThemePicker = ({ className }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('siteTheme') || 'theme-professional';
    } catch { return 'theme-professional'; }
  });

  useEffect(() => {
    // Apply class to html element
    const root = document.documentElement;
    root.classList.remove(...themes.map(t => t.id));
    root.classList.add(theme);

    try { localStorage.setItem('siteTheme', theme); } catch {}
    // add a small attribute to identify active theme for CSS testing
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={className} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Theme</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', background: 'var(--surface)', color: 'var(--text)' }}
      >
        {themes.map(t => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemePicker;
