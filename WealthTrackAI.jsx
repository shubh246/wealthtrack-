import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── DESIGN SYSTEM ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0d1420;
    --surface2: #111827;
    --surface3: #1a2235;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #e8edf5;
    --text2: #8b95a8;
    --text3: #5a6478;
    --gold: #f5c842;
    --gold2: #e8a820;
    --emerald: #00d4a0;
    --emerald2: #00b389;
    --ruby: #ff4757;
    --ruby2: #cc3344;
    --sapphire: #4f9fff;
    --sapphire2: #2d7fe0;
    --violet: #a855f7;
    --amber: #fb923c;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --radius: 14px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.6);
    --glow-gold: 0 0 24px rgba(245,200,66,0.15);
    --glow-emerald: 0 0 24px rgba(0,212,160,0.15);
    --glow-ruby: 0 0 24px rgba(255,71,87,0.15);
    --transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app-shell { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; overflow: hidden; position: relative;
  }
  .sidebar::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .sidebar-logo {
    padding: 24px 20px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 36px; height: 36px; background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 18px; box-shadow: var(--glow-gold);
  }
  .logo-text { font-family: var(--font-display); font-weight: 800; font-size: 16px; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: var(--text3); font-family: var(--font-mono); letter-spacing: 1px; text-transform: uppercase; }

  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-section-label {
    font-family: var(--font-mono); font-size: 10px; color: var(--text3); letter-spacing: 1.5px;
    text-transform: uppercase; padding: 12px 8px 6px; margin-top: 8px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
    font-size: 13.5px; font-weight: 500; color: var(--text2); border: 1px solid transparent;
    position: relative; overflow: hidden;
  }
  .nav-item:hover { background: var(--surface3); color: var(--text); }
  .nav-item.active {
    background: linear-gradient(135deg, rgba(245,200,66,0.1), rgba(245,200,66,0.05));
    color: var(--gold); border-color: rgba(245,200,66,0.2);
  }
  .nav-item.active .nav-icon { color: var(--gold); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
  .nav-badge {
    margin-left: auto; background: var(--ruby); color: white; font-size: 10px;
    font-family: var(--font-mono); padding: 2px 6px; border-radius: 20px; font-weight: 600;
  }

  .sidebar-footer {
    padding: 16px; border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--surface3); border-radius: var(--radius-sm); cursor: pointer;
    transition: var(--transition); border: 1px solid var(--border);
  }
  .user-card:hover { border-color: var(--border2); }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--sapphire), var(--violet));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px; color: white;
  }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .user-plan { font-size: 11px; color: var(--emerald); font-family: var(--font-mono); }

  /* MAIN CONTENT */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 60px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 28px; gap: 16px; flex-shrink: 0;
  }
  .topbar-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; flex: 1; }
  .topbar-date { font-family: var(--font-mono); font-size: 11px; color: var(--text3); }
  .topbar-action {
    display: flex; align-items: center; gap: 6px; padding: 8px 16px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border: none; border-radius: var(--radius-sm); cursor: pointer;
    font-family: var(--font-display); font-size: 13px; font-weight: 700;
    color: #080c14; transition: var(--transition); box-shadow: var(--glow-gold);
  }
  .topbar-action:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(245,200,66,0.3); }

  .content { flex: 1; overflow-y: auto; padding: 28px; }
  .content::-webkit-scrollbar { width: 6px; }
  .content::-webkit-scrollbar-track { background: transparent; }
  .content::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 3px; }

  /* CARDS */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; transition: var(--transition);
  }
  .card:hover { border-color: var(--border2); }
  .card-title {
    font-family: var(--font-display); font-size: 13px; font-weight: 600;
    color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .card-title-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* KPI CARDS */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; position: relative; overflow: hidden; transition: var(--transition);
  }
  .kpi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .kpi-card.gold::before { background: linear-gradient(90deg, var(--gold), var(--gold2)); }
  .kpi-card.emerald::before { background: linear-gradient(90deg, var(--emerald), var(--emerald2)); }
  .kpi-card.ruby::before { background: linear-gradient(90deg, var(--ruby), var(--ruby2)); }
  .kpi-card.sapphire::before { background: linear-gradient(90deg, var(--sapphire), var(--sapphire2)); }
  .kpi-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--shadow); }
  .kpi-label { font-family: var(--font-mono); font-size: 10px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .kpi-value { font-family: var(--font-display); font-size: 26px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .kpi-value.gold { color: var(--gold); }
  .kpi-value.emerald { color: var(--emerald); }
  .kpi-value.ruby { color: var(--ruby); }
  .kpi-value.sapphire { color: var(--sapphire); }
  .kpi-delta { font-family: var(--font-mono); font-size: 11px; display: flex; align-items: center; gap: 4px; }
  .kpi-delta.up { color: var(--emerald); }
  .kpi-delta.down { color: var(--ruby); }
  .kpi-icon { position: absolute; right: 16px; top: 16px; font-size: 28px; opacity: 0.15; }

  /* GRID LAYOUTS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .grid-3-1 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .col-span-2 { grid-column: span 2; }

  /* TABLE */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    font-family: var(--font-mono); font-size: 10px; color: var(--text3); text-transform: uppercase;
    letter-spacing: 1px; padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
  .data-table td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 13.5px; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--surface3); }
  .data-table td:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
  .data-table td:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }

  /* BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px;
    border-radius: 20px; font-family: var(--font-mono); font-size: 10px; font-weight: 600;
    letter-spacing: 0.3px;
  }
  .badge.income { background: rgba(0,212,160,0.15); color: var(--emerald); border: 1px solid rgba(0,212,160,0.2); }
  .badge.expense { background: rgba(255,71,87,0.15); color: var(--ruby); border: 1px solid rgba(255,71,87,0.2); }
  .badge.stcg { background: rgba(251,146,60,0.15); color: var(--amber); border: 1px solid rgba(251,146,60,0.2); }
  .badge.ltcg { background: rgba(168,85,247,0.15); color: var(--violet); border: 1px solid rgba(168,85,247,0.2); }
  .badge.ontrack { background: rgba(0,212,160,0.15); color: var(--emerald); border: 1px solid rgba(0,212,160,0.2); }
  .badge.atrisk { background: rgba(255,71,87,0.15); color: var(--ruby); border: 1px solid rgba(255,71,87,0.2); }

  /* CATEGORY ICON */
  .cat-icon {
    width: 32px; height: 32px; border-radius: 8px; display: inline-flex;
    align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
  }

  /* PROGRESS BARS */
  .progress-bar { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  /* TABS */
  .tabs { display: flex; gap: 2px; background: var(--surface2); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 20px; width: fit-content; }
  .tab {
    padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--text2); transition: var(--transition); font-family: var(--font-body);
    border: none; background: none;
  }
  .tab.active { background: var(--surface3); color: var(--text); }
  .tab:hover:not(.active) { color: var(--text); }

  /* FORM ELEMENTS */
  .form-group { margin-bottom: 14px; }
  .form-label { font-family: var(--font-mono); font-size: 10px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .form-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 9px 12px; color: var(--text); font-size: 13.5px; font-family: var(--font-body);
    transition: var(--transition); outline: none;
  }
  .form-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(245,200,66,0.1); }
  .form-select {
    width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 9px 12px; color: var(--text); font-size: 13.5px; font-family: var(--font-body);
    outline: none; cursor: pointer; appearance: none;
  }
  .form-select:focus { border-color: var(--gold); }
  .btn {
    padding: 9px 18px; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px;
    font-weight: 600; transition: var(--transition); border: 1px solid transparent;
    font-family: var(--font-display); letter-spacing: 0.2px;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #080c14;
    box-shadow: var(--glow-gold);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,200,66,0.3); }
  .btn-secondary { background: var(--surface3); color: var(--text); border-color: var(--border2); }
  .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }
  .btn-danger { background: rgba(255,71,87,0.15); color: var(--ruby); border-color: rgba(255,71,87,0.2); }
  .btn-danger:hover { background: rgba(255,71,87,0.25); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius);
    width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
    box-shadow: var(--shadow-lg); animation: modalIn 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-header { padding: 20px 24px 0; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
  .modal-close { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 20px; line-height: 1; padding: 4px; transition: var(--transition); }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 0 24px 24px; }

  /* OCR UPLOAD */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius); padding: 40px 20px;
    text-align: center; cursor: pointer; transition: var(--transition);
    background: var(--surface2);
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--gold); background: rgba(245,200,66,0.05); }
  .upload-icon { font-size: 48px; margin-bottom: 12px; }
  .upload-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .upload-sub { font-size: 12px; color: var(--text3); }

  /* SCANNING ANIMATION */
  .scan-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--emerald), transparent);
    animation: scan 2s linear infinite; box-shadow: 0 0 8px var(--emerald);
  }
  @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
  .receipt-preview {
    position: relative; overflow: hidden; border-radius: var(--radius-sm);
    background: var(--surface2); border: 1px solid var(--border);
  }

  /* WEALTH METER */
  .wealth-meter {
    background: linear-gradient(135deg, rgba(245,200,66,0.05), rgba(0,212,160,0.05));
    border: 1px solid rgba(245,200,66,0.15); border-radius: var(--radius);
    padding: 24px; text-align: center; position: relative; overflow: hidden;
  }
  .wealth-meter::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(245,200,66,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  .net-worth-value {
    font-family: var(--font-display); font-size: 42px; font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--emerald));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1; margin: 8px 0;
  }

  /* ALLOCATION PIE */
  .allocation-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .alloc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .alloc-label { font-size: 13px; color: var(--text2); flex: 1; }
  .alloc-val { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--text); }
  .alloc-pct { font-family: var(--font-mono); font-size: 11px; color: var(--text3); margin-left: 4px; }

  /* GOAL CARDS */
  .goal-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; transition: var(--transition);
  }
  .goal-card:hover { border-color: var(--border2); transform: translateY(-1px); box-shadow: var(--shadow); }
  .goal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .goal-emoji { font-size: 28px; margin-bottom: 6px; }
  .goal-name { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .goal-target { font-family: var(--font-mono); font-size: 11px; color: var(--text3); }
  .goal-amounts { display: flex; justify-content: space-between; margin-bottom: 10px; font-family: var(--font-mono); font-size: 12px; }
  .goal-saved { color: var(--emerald); }
  .goal-remaining { color: var(--text3); }
  .sip-box {
    background: var(--surface2); border-radius: var(--radius-sm); padding: 10px 12px;
    margin-top: 12px; display: flex; justify-content: space-between; align-items: center;
    border: 1px solid var(--border);
  }
  .sip-label { font-family: var(--font-mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }
  .sip-value { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--gold); }

  /* TAX */
  .tax-card {
    background: linear-gradient(135deg, rgba(168,85,247,0.08), rgba(79,159,255,0.08));
    border: 1px solid rgba(168,85,247,0.2); border-radius: var(--radius); padding: 20px;
  }
  .tax-number { font-family: var(--font-display); font-size: 28px; font-weight: 800; }
  .harvest-row {
    display: flex; align-items: center; gap: 12px; padding: 12px;
    background: var(--surface2); border-radius: var(--radius-sm); border: 1px solid var(--border);
    margin-bottom: 8px; transition: var(--transition);
  }
  .harvest-row:hover { border-color: var(--border2); }
  .harvest-symbol { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--text); }
  .harvest-loss { font-family: var(--font-mono); font-size: 13px; color: var(--ruby); font-weight: 600; }
  .harvest-saving { font-family: var(--font-mono); font-size: 11px; color: var(--emerald); }

  /* TICKER */
  .ticker-strip {
    background: var(--surface2); border-bottom: 1px solid var(--border);
    padding: 6px 0; overflow: hidden; flex-shrink: 0;
  }
  .ticker-inner { display: flex; gap: 32px; animation: tickerScroll 30s linear infinite; width: max-content; }
  @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .ticker-item { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  .ticker-sym { font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text); }
  .ticker-price { font-family: var(--font-mono); font-size: 11px; color: var(--text2); }
  .ticker-chg { font-family: var(--font-mono); font-size: 10px; }
  .ticker-chg.up { color: var(--emerald); }
  .ticker-chg.down { color: var(--ruby); }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 48px 20px; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
  .empty-text { font-size: 14px; }

  /* TOOLTIP CUSTOM */
  .custom-tooltip {
    background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm);
    padding: 10px 14px; font-family: var(--font-mono); font-size: 12px;
    box-shadow: var(--shadow);
  }
  .custom-tooltip .label { color: var(--text3); font-size: 10px; margin-bottom: 4px; }
  .custom-tooltip .value { color: var(--text); font-weight: 600; }

  /* ANIMATIONS */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .pulse { animation: pulse 1.5s ease infinite; }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .shimmer {
    background: linear-gradient(90deg, var(--surface) 25%, var(--surface3) 50%, var(--surface) 75%);
    background-size: 200% 100%; animation: shimmer 1.5s infinite;
  }

  /* NOTIFICATION */
  .notification {
    position: fixed; top: 20px; right: 20px; z-index: 2000;
    background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius);
    padding: 12px 16px; min-width: 280px; box-shadow: var(--shadow-lg);
    animation: notifIn 0.3s ease; display: flex; align-items: flex-start; gap: 10px;
  }
  @keyframes notifIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .notif-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .notif-title { font-family: var(--font-display); font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .notif-msg { font-size: 12px; color: var(--text2); }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .text-mono { font-family: var(--font-mono); }
  .text-sm { font-size: 12px; }
  .text-muted { color: var(--text3); }
  .text-gold { color: var(--gold); }
  .text-emerald { color: var(--emerald); }
  .text-ruby { color: var(--ruby); }
  .text-sapphire { color: var(--sapphire); }
  .text-violet { color: var(--violet); }
  .font-display { font-family: var(--font-display); }
  .font-bold { font-weight: 700; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .mb-4 { margin-bottom: 4px; }
  .mb-8 { margin-bottom: 8px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-20 { margin-bottom: 20px; }
  .mt-8 { margin-top: 8px; }
  .mt-16 { margin-top: 16px; }
  .w-full { width: 100%; }
  .grid-goals { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
`;

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const fmt = (n, cur = "₹") => `${cur}${n >= 1e7 ? (n / 1e7).toFixed(2) + "Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + "L" : n.toLocaleString("en-IN")}`;
const fmtN = (n) => n < 0 ? `-₹${Math.abs(n).toLocaleString("en-IN")}` : `₹${n.toLocaleString("en-IN")}`;

const CATEGORIES = [
  { id: 1, name: "Food & Dining", icon: "🍜", color: "#f5c842" },
  { id: 2, name: "Transport", icon: "🚗", color: "#4f9fff" },
  { id: 3, name: "Shopping", icon: "🛍️", color: "#a855f7" },
  { id: 4, name: "Entertainment", icon: "🎬", color: "#fb923c" },
  { id: 5, name: "Utilities", icon: "⚡", color: "#00d4a0" },
  { id: 6, name: "Healthcare", icon: "💊", color: "#ff4757" },
  { id: 7, name: "Salary", icon: "💰", color: "#00d4a0" },
  { id: 8, name: "Investments", icon: "📈", color: "#4f9fff" },
  { id: 9, name: "Rent", icon: "🏠", color: "#f5c842" },
  { id: 10, name: "Insurance", icon: "🛡️", color: "#a855f7" },
];

const INITIAL_EXPENSES = [
  { id: 1, date: "2025-06-10", description: "Swiggy - Biryani", merchant: "Swiggy", amount: 485, type: "expense", category: 1 },
  { id: 2, date: "2025-06-10", description: "Monthly Salary", merchant: "Infosys Ltd.", amount: 145000, type: "income", category: 7 },
  { id: 3, date: "2025-06-09", description: "Ola Cab - Office", merchant: "Ola Cabs", amount: 220, type: "expense", category: 2 },
  { id: 4, date: "2025-06-08", description: "Amazon Shopping", merchant: "Amazon India", amount: 3200, type: "expense", category: 3 },
  { id: 5, date: "2025-06-08", description: "Netflix + Hotstar", merchant: "Streaming", amount: 799, type: "expense", category: 4 },
  { id: 6, date: "2025-06-07", description: "Electricity Bill", merchant: "BESCOM", amount: 1840, type: "expense", category: 5 },
  { id: 7, date: "2025-06-06", description: "Apollo Pharmacy", merchant: "Apollo", amount: 620, type: "expense", category: 6 },
  { id: 8, date: "2025-06-05", description: "House Rent", merchant: "Landlord", amount: 22000, type: "expense", category: 9 },
  { id: 9, date: "2025-06-04", description: "LIC Premium", merchant: "LIC India", amount: 8500, type: "expense", category: 10 },
  { id: 10, date: "2025-06-03", description: "Freelance Income", merchant: "Client", amount: 35000, type: "income", category: 7 },
];

const HOLDINGS = [
  { id: 1, symbol: "RELIANCE", name: "Reliance Industries", type: "Stock", qty: 50, avgBuy: 2450, current: 2891, sector: "Energy", buyDate: "2022-03-15" },
  { id: 2, symbol: "INFY", name: "Infosys Ltd.", type: "Stock", qty: 100, avgBuy: 1380, current: 1542, sector: "IT", buyDate: "2023-07-20" },
  { id: 3, symbol: "HDFCBANK", name: "HDFC Bank", type: "Stock", qty: 75, avgBuy: 1620, current: 1489, sector: "Banking", buyDate: "2024-01-10" },
  { id: 4, symbol: "TCS", name: "Tata Consultancy", type: "Stock", qty: 30, avgBuy: 3200, current: 3890, sector: "IT", buyDate: "2021-11-05" },
  { id: 5, symbol: "MIRAE_EMERG", name: "Mirae Asset Emerging Bluechip", type: "MF", qty: 2840.5, avgBuy: 65.4, current: 89.2, sector: "Large & Mid Cap", buyDate: "2022-06-01" },
  { id: 6, symbol: "PARAG_FLEXI", name: "Parag Parikh Flexi Cap", type: "MF", qty: 1520.8, avgBuy: 42.1, current: 71.6, sector: "Flexi Cap", buyDate: "2021-09-15" },
  { id: 7, symbol: "GOLDBEES", name: "Nippon India Gold ETF", type: "ETF", qty: 500, avgBuy: 48.2, current: 61.5, sector: "Gold", buyDate: "2023-02-20" },
];

const GOALS = [
  { id: 1, title: "Dream Apartment", emoji: "🏠", type: "RealEstate", target: 6000000, saved: 1820000, date: "2027-12-31", rate: 12, color: "#f5c842" },
  { id: 2, title: "Retirement Corpus", emoji: "🌴", type: "Retirement", target: 30000000, saved: 4200000, date: "2045-01-01", rate: 14, color: "#00d4a0" },
  { id: 3, title: "Child Education", emoji: "🎓", type: "Education", target: 5000000, saved: 650000, date: "2035-06-01", rate: 10, color: "#4f9fff" },
  { id: 4, title: "Family Vacation", emoji: "✈️", type: "Travel", target: 500000, saved: 340000, date: "2025-12-25", rate: 7, color: "#a855f7" },
];

const MONTHLY_DATA = [
  { month: "Jan", income: 145000, expense: 68000 },
  { month: "Feb", income: 145000, expense: 72000 },
  { month: "Mar", income: 180000, expense: 89000 },
  { month: "Apr", income: 145000, expense: 65000 },
  { month: "May", income: 165000, expense: 78000 },
  { month: "Jun", income: 180000, expense: 71464 },
];

const CATEGORY_SPEND = [
  { name: "Food", value: 8240, color: "#f5c842" },
  { name: "Rent", value: 22000, color: "#4f9fff" },
  { name: "Shopping", value: 12800, color: "#a855f7" },
  { name: "Transport", value: 4200, color: "#fb923c" },
  { name: "Utilities", value: 6840, color: "#00d4a0" },
  { name: "Others", value: 9384, color: "#ff4757" },
];

const TICKER_DATA = [
  { sym: "SENSEX", price: "79,432", chg: "+0.82%", up: true },
  { sym: "NIFTY 50", price: "24,052", chg: "+0.69%", up: true },
  { sym: "RELIANCE", price: "2,891", chg: "+1.24%", up: true },
  { sym: "INFY", price: "1,542", chg: "-0.31%", up: false },
  { sym: "TCS", price: "3,890", chg: "+2.15%", up: true },
  { sym: "HDFCBANK", price: "1,489", chg: "-0.82%", up: false },
  { sym: "GOLDBEES", price: "61.50", chg: "+0.45%", up: true },
  { sym: "USD/INR", price: "83.42", chg: "+0.12%", up: true },
  { sym: "GOLD", price: "₹73,240", chg: "+0.38%", up: true },
];

const TAX_EVENTS = [
  { id: 1, symbol: "TCS", buyDate: "2021-11-05", saleDate: "2025-03-10", qty: 10, costBasis: 3200, salePrice: 3890, type: "LTCG", gain: 6900 },
  { id: 2, symbol: "HDFCBANK", buyDate: "2024-01-10", saleDate: "2025-05-20", qty: 25, costBasis: 1620, salePrice: 1489, type: "STCG", gain: -3275 },
  { id: 3, symbol: "PARAG_FLEXI", buyDate: "2021-09-15", saleDate: "2025-04-01", qty: 300, costBasis: 42.1, salePrice: 71.6, type: "LTCG", gain: 8850 },
];

const HARVEST_OPPORTUNITIES = [
  { symbol: "HDFCBANK", loss: -9825, taxSaving: 1474, qty: 75, holdDays: 536 },
  { symbol: "ICICIBANK", loss: -4200, taxSaving: 630, qty: 40, holdDays: 210 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function calcSIP(target, saved, months, rate) {
  const fv = target - saved;
  const r = rate / 100 / 12;
  if (r === 0) return fv / months;
  return fv * r / (Math.pow(1 + r, months) - 1);
}
function monthsBetween(d1, d2) {
  const a = new Date(d1), b = new Date(d2);
  return Math.max(1, (b - a) / (1000 * 60 * 60 * 24 * 30.44));
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="value" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
function Notification({ notif, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="notification">
      <span className="notif-icon">{notif.icon}</span>
      <div>
        <div className="notif-title">{notif.title}</div>
        <div className="notif-msg">{notif.msg}</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD MODULE ─────────────────────────────────────────────────────────
function Dashboard({ expenses, holdings }) {
  const totalIncome = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.qty * h.avgBuy, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.qty * h.current, 0);
  const pnl = totalCurrent - totalInvested;
  const netWorth = totalIncome - totalExpense + totalCurrent;

  const allocationData = [
    { name: "Equities", value: Math.round(totalCurrent * 0.6), color: "#4f9fff" },
    { name: "Mutual Funds", value: Math.round(totalCurrent * 0.3), color: "#a855f7" },
    { name: "Gold", value: Math.round(totalCurrent * 0.07), color: "#f5c842" },
    { name: "Cash", value: totalIncome - totalExpense, color: "#00d4a0" },
  ];

  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="fade-in">
      {/* NET WORTH HERO */}
      <div className="wealth-meter mb-20">
        <div className="text-mono text-sm text-muted mb-4" style={{ letterSpacing: "2px", textTransform: "uppercase" }}>Total Net Worth</div>
        <div className="net-worth-value">{fmt(netWorth)}</div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6, fontFamily: "var(--font-mono)" }}>
          As of {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · Live Portfolio Data
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
          {[
            { label: "Portfolio", val: fmt(totalCurrent), color: "var(--sapphire)" },
            { label: "Savings", val: fmt(totalIncome - totalExpense), color: "var(--emerald)" },
            { label: "Unrealized P&L", val: fmtN(Math.round(pnl)), color: pnl >= 0 ? "var(--emerald)" : "var(--ruby)" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: item.color }}>{item.val}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        {[
          { label: "Monthly Income", value: fmt(totalIncome), color: "emerald", icon: "💰", delta: "+12.4%", up: true },
          { label: "Monthly Spend", value: fmt(totalExpense), color: "ruby", icon: "💳", delta: "-3.2%", up: true },
          { label: "Portfolio Value", value: fmt(totalCurrent), color: "sapphire", icon: "📈", delta: `+${((pnl / totalInvested) * 100).toFixed(1)}%`, up: true },
          { label: "Savings Rate", value: `${(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(0)}%`, color: "gold", icon: "🎯", delta: "+4.1%", up: true },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className={`kpi-value ${k.color}`}>{k.value}</div>
            <div className={`kpi-delta ${k.up ? "up" : "down"}`}>
              {k.up ? "▲" : "▼"} {k.delta} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--sapphire)" }}></span>Income vs Expenses</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text3)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="var(--emerald)" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="var(--ruby)" radius={[4, 4, 0, 0]} name="Expense" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--gold)" }}></span>Spending Breakdown</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={CATEGORY_SPEND} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {CATEGORY_SPEND.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {CATEGORY_SPEND.map(c => (
                <div key={c.name} className="allocation-item">
                  <div className="alloc-dot" style={{ background: c.color }}></div>
                  <span className="alloc-label">{c.name}</span>
                  <span className="alloc-val">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS + ALLOCATION */}
      <div className="grid-3-1">
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--emerald)" }}></span>Recent Transactions</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map(e => {
                const cat = CATEGORIES.find(c => c.id === e.category);
                return (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="cat-icon" style={{ background: cat?.color + "22" }}>{cat?.icon}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{e.description}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>{e.merchant}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge">{cat?.name}</span></td>
                    <td style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{e.date}</td>
                    <td style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: e.type === "income" ? "var(--emerald)" : "var(--ruby)" }}>
                        {e.type === "income" ? "+" : "-"}{fmt(e.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--violet)" }}></span>Asset Allocation</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          {allocationData.map(a => (
            <div key={a.name} className="allocation-item">
              <div className="alloc-dot" style={{ background: a.color }}></div>
              <span className="alloc-label">{a.name}</span>
              <span className="alloc-val" style={{ fontSize: 12 }}>{fmt(a.value)}</span>
              <span className="alloc-pct">{((a.value / allocationData.reduce((s, x) => s + x.value, 0)) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXPENSES MODULE ──────────────────────────────────────────────────────────
function ExpenseTracker({ expenses, setExpenses, notify }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", type: "expense", category: 1, date: new Date().toISOString().split("T")[0], merchant: "" });
  const [filter, setFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");

  const filtered = expenses.filter(e => {
    if (filter === "income" && e.type !== "income") return false;
    if (filter === "expense" && e.type !== "expense") return false;
    if (searchQ && !e.description.toLowerCase().includes(searchQ.toLowerCase()) && !e.merchant.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    if (!form.description || !form.amount) return;
    const newExp = { ...form, id: Date.now(), amount: parseFloat(form.amount) };
    setExpenses(prev => [newExp, ...prev]);
    setShowModal(false);
    setForm({ description: "", amount: "", type: "expense", category: 1, date: new Date().toISOString().split("T")[0], merchant: "" });
    notify({ icon: "✅", title: "Transaction Added", msg: `${form.description} — ${fmt(parseFloat(form.amount))}` });
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    notify({ icon: "🗑️", title: "Deleted", msg: "Transaction removed." });
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <input className="form-input" placeholder="🔍  Search transactions..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: 260 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {["all", "income", "expense"].map(f => <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Transaction</button>
        </div>
      </div>

      {/* SUMMARY MINI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Income", val: expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0), color: "var(--emerald)" },
          { label: "Total Expenses", val: expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0), color: "var(--ruby)" },
          { label: "Net Balance", val: expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0) - expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0), color: "var(--gold)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: s.color }}>{fmtN(s.val)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title"><span className="card-title-dot" style={{ background: "var(--gold)" }}></span>All Transactions ({filtered.length})</div>
        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">No transactions found</div></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Merchant</th>
                <th>Date</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const cat = CATEGORIES.find(c => c.id === e.category);
                return (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="cat-icon" style={{ background: cat?.color + "22" }}>{cat?.icon}</div>
                        <span style={{ fontWeight: 500 }}>{e.description}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, color: "var(--text2)" }}>{cat?.name}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{e.merchant}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{e.date}</td>
                    <td><span className={`badge ${e.type}`}>{e.type === "income" ? "↑ Income" : "↓ Expense"}</span></td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: e.type === "income" ? "var(--emerald)" : "var(--ruby)" }}>
                      {e.type === "income" ? "+" : "-"}{fmt(e.amount)}
                    </td>
                    <td>
                      <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleDelete(e.id)}>×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Add Transaction</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="tabs" style={{ marginBottom: 0 }}>
                  {["expense", "income"].map(t => <button key={t} className={`tab ${form.type === t ? "active" : ""}`} onClick={() => setForm(f => ({ ...f, type: t }))}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="e.g. Swiggy Dinner" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input className="form-input" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: parseInt(e.target.value) }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Merchant (optional)</label>
                <input className="form-input" placeholder="e.g. Swiggy" value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn btn-primary w-full" onClick={handleAdd}>Add Transaction</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PORTFOLIO MODULE ─────────────────────────────────────────────────────────
function Portfolio({ holdings, setHoldings, notify }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ symbol: "", name: "", type: "Stock", qty: "", avgBuy: "", sector: "IT" });
  const [tab, setTab] = useState("holdings");

  const totalInvested = holdings.reduce((s, h) => s + h.qty * h.avgBuy, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.qty * h.current, 0);
  const overallPnL = totalCurrent - totalInvested;

  const sectorData = Object.entries(
    holdings.reduce((acc, h) => { acc[h.sector] = (acc[h.sector] || 0) + h.qty * h.current; return acc; }, {})
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  const portfolioHistory = [
    { date: "Jan", value: 680000 }, { date: "Feb", value: 710000 }, { date: "Mar", value: 698000 },
    { date: "Apr", value: 745000 }, { date: "May", value: 790000 }, { date: "Jun", value: Math.round(totalCurrent) },
  ];

  const SECTOR_COLORS = { IT: "#4f9fff", Energy: "#f5c842", Banking: "#a855f7", Gold: "#fb923c", "Large & Mid Cap": "#00d4a0", "Flexi Cap": "#ff4757" };

  const handleAdd = () => {
    if (!form.symbol || !form.qty || !form.avgBuy) return;
    const newH = { ...form, id: Date.now(), qty: parseFloat(form.qty), avgBuy: parseFloat(form.avgBuy), current: parseFloat(form.avgBuy) * 1.05, buyDate: new Date().toISOString().split("T")[0] };
    setHoldings(prev => [...prev, newH]);
    setShowModal(false);
    setForm({ symbol: "", name: "", type: "Stock", qty: "", avgBuy: "", sector: "IT" });
    notify({ icon: "📈", title: "Holding Added", msg: `${form.symbol} added to portfolio` });
  };

  return (
    <div className="fade-in">
      {/* KPI ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Invested", val: fmt(Math.round(totalInvested)), color: "var(--sapphire)" },
          { label: "Current Value", val: fmt(Math.round(totalCurrent)), color: "var(--gold)" },
          { label: "Unrealized P&L", val: fmtN(Math.round(overallPnL)), color: overallPnL >= 0 ? "var(--emerald)" : "var(--ruby)" },
          { label: "Total Return", val: `${((overallPnL / totalInvested) * 100).toFixed(1)}%`, color: overallPnL >= 0 ? "var(--emerald)" : "var(--ruby)" },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* CHART + SECTORS */}
      <div className="grid-3-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--emerald)" }}></span>Portfolio Performance</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={portfolioHistory} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--emerald)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--emerald)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text3)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text3)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 100000}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="var(--emerald)" fill="url(#portGrad)" strokeWidth={2} name="Portfolio" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--violet)" }}></span>By Sector</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={sectorData} cx="50%" cy="50%" outerRadius={65} dataKey="value" paddingAngle={4}>
                {sectorData.map((entry, i) => <Cell key={i} fill={SECTOR_COLORS[entry.name] || "#888"} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          {sectorData.map(s => (
            <div key={s.name} className="allocation-item">
              <div className="alloc-dot" style={{ background: SECTOR_COLORS[s.name] || "#888" }}></div>
              <span className="alloc-label" style={{ fontSize: 12 }}>{s.name}</span>
              <span className="alloc-val" style={{ fontSize: 12 }}>{fmt(s.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HOLDINGS TABLE */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}><span className="card-title-dot" style={{ background: "var(--gold)" }}></span>Holdings ({holdings.length})</div>
          <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => setShowModal(true)}>+ Add Holding</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol / Name</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Avg Buy</th>
              <th>Current</th>
              <th>Invested</th>
              <th>Curr. Value</th>
              <th style={{ textAlign: "right" }}>P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const invested = h.qty * h.avgBuy;
              const curr = h.qty * h.current;
              const pnl = curr - invested;
              const pnlPct = ((pnl / invested) * 100).toFixed(2);
              return (
                <tr key={h.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "var(--font-mono)" }}>{h.symbol}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{h.name}</div>
                  </td>
                  <td><span className="badge" style={{ background: "rgba(79,159,255,0.1)", color: "var(--sapphire)", borderColor: "rgba(79,159,255,0.2)" }}>{h.type}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{h.qty.toLocaleString()}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmt(h.avgBuy)}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>{fmt(h.current)}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmt(Math.round(invested))}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--gold)" }}>{fmt(Math.round(curr))}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: pnl >= 0 ? "var(--emerald)" : "var(--ruby)" }}>
                      {fmtN(Math.round(pnl))}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: pnl >= 0 ? "var(--emerald)" : "var(--ruby)" }}>
                      {pnl >= 0 ? "▲" : "▼"} {Math.abs(pnlPct)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Add Holding</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Symbol / ISIN</label>
                  <input className="form-input" placeholder="e.g. RELIANCE" value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {["Stock", "MF", "ETF", "Bond", "Gold"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="e.g. Reliance Industries" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="number" placeholder="0" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Avg Buy Price (₹)</label>
                  <input className="form-input" type="number" placeholder="0.00" value={form.avgBuy} onChange={e => setForm(f => ({ ...f, avgBuy: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sector</label>
                <select className="form-select" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                  {["IT", "Banking", "Energy", "FMCG", "Healthcare", "Gold", "Large & Mid Cap", "Flexi Cap"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn btn-primary w-full" onClick={handleAdd}>Add to Portfolio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GOALS MODULE ─────────────────────────────────────────────────────────────
function Goals({ notify }) {
  const [goals, setGoals] = useState(GOALS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", emoji: "🎯", target: "", saved: "", date: "2028-01-01", rate: 12, color: "#f5c842" });

  const handleAdd = () => {
    if (!form.title || !form.target) return;
    setGoals(prev => [...prev, { ...form, id: Date.now(), target: parseFloat(form.target), saved: parseFloat(form.saved) || 0, rate: parseFloat(form.rate), type: "Custom" }]);
    setShowModal(false);
    notify({ icon: "🎯", title: "Goal Created", msg: form.title });
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Goal</button>
      </div>

      {/* TOTAL GOAL PROGRESS */}
      <div className="card mb-20">
        <div className="card-title"><span className="card-title-dot" style={{ background: "var(--gold)" }}></span>Portfolio of Goals</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--gold)" }}>{goals.length}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Active Goals</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--emerald)" }}>{fmt(goals.reduce((s, g) => s + g.saved, 0))}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Total Saved</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--sapphire)" }}>{fmt(goals.reduce((s, g) => s + g.target, 0))}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Total Target</div>
          </div>
        </div>
      </div>

      <div className="grid-goals">
        {goals.map(goal => {
          const pct = Math.min(100, (goal.saved / goal.target) * 100);
          const months = monthsBetween(new Date().toISOString().split("T")[0], goal.date);
          const sip = calcSIP(goal.target, goal.saved, months, goal.rate);
          const onTrack = sip < 100000;
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div>
                  <div className="goal-emoji">{goal.emoji}</div>
                  <div className="goal-name">{goal.title}</div>
                  <div className="goal-target">Target: {fmt(goal.target)} by {goal.date}</div>
                </div>
                <span className={`badge ${onTrack ? "ontrack" : "atrisk"}`}>{onTrack ? "On Track" : "At Risk"}</span>
              </div>

              <div className="goal-amounts">
                <span className="goal-saved">Saved: {fmt(goal.saved)}</span>
                <span className="goal-remaining">Remaining: {fmt(goal.target - goal.saved)}</span>
              </div>

              <div className="progress-bar mb-8">
                <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${goal.color}, ${goal.color}99)` }}></div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 8 }}>{pct.toFixed(1)}% complete · {Math.round(months)} months left</div>

              <div className="sip-box">
                <div>
                  <div className="sip-label">Required Monthly SIP</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>@ {goal.rate}% p.a. expected return</div>
                </div>
                <div className="sip-value">{fmt(Math.ceil(sip))}/mo</div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Create Financial Goal</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <input className="form-input" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={{ textAlign: "center", fontSize: 20 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Goal Title</label>
                  <input className="form-input" placeholder="e.g. Buy Apartment" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Target Amount (₹)</label>
                  <input className="form-input" type="number" placeholder="6000000" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Already Saved (₹)</label>
                  <input className="form-input" type="number" placeholder="0" value={form.saved} onChange={e => setForm(f => ({ ...f, saved: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Target Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return (%)</label>
                  <input className="form-input" type="number" placeholder="12" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} />
                </div>
              </div>
              {form.target && form.date && (
                <div style={{ background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Estimated Monthly SIP Required</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--gold)" }}>
                    {fmt(Math.ceil(calcSIP(parseFloat(form.target) || 0, parseFloat(form.saved) || 0, monthsBetween(new Date().toISOString().split("T")[0], form.date), parseFloat(form.rate) || 12)))}/mo
                  </div>
                </div>
              )}
              <button className="btn btn-primary w-full" onClick={handleAdd}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OCR RECEIPT SCANNER ──────────────────────────────────────────────────────
function ReceiptScanner({ setExpenses, notify }) {
  const [stage, setStage] = useState("idle"); // idle | uploading | scanning | result
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [editResult, setEditResult] = useState(null);
  const fileRef = useRef();

  const MOCK_OCR_RESULTS = [
    { merchant: "Swiggy India Pvt. Ltd.", date: "2025-06-10", total: 847, items: [{ name: "Chicken Biryani", price: 485 }, { name: "Coke 500ml", price: 89 }, { name: "Delivery fee", price: 49 }, { name: "GST (5%)", price: 224 }], category: 1, confidence: 0.96 },
    { merchant: "Amazon India", date: "2025-06-08", total: 3299, items: [{ name: "USB-C Cable 2m", price: 599 }, { name: "Wireless Mouse", price: 1899 }, { name: "CGST + SGST", price: 449 }, { name: "Shipping", price: 352 }], category: 3, confidence: 0.91 },
    { merchant: "BESCOM Electricity", date: "2025-06-07", total: 2140, items: [{ name: "Units consumed: 245", price: 1680 }, { name: "Fixed charges", price: 320 }, { name: "Fuel surcharge", price: 140 }], category: 5, confidence: 0.98 },
  ];

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setStage("uploading");
    setTimeout(() => {
      setStage("scanning");
      setTimeout(() => {
        const r = MOCK_OCR_RESULTS[Math.floor(Math.random() * MOCK_OCR_RESULTS.length)];
        setResult(r);
        setEditResult({ ...r });
        setStage("result");
      }, 2200);
    }, 800);
  };

  const handleSave = () => {
    const cat = CATEGORIES.find(c => c.id === editResult.category);
    setExpenses(prev => [{
      id: Date.now(), date: editResult.date, description: editResult.merchant,
      merchant: editResult.merchant, amount: editResult.total, type: "expense",
      category: editResult.category,
    }, ...prev]);
    notify({ icon: "🤖", title: "Receipt Saved!", msg: `${editResult.merchant} · ${fmt(editResult.total)} · Auto-categorized as ${cat?.name}` });
    setStage("idle");
    setResult(null);
  };

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card" style={{ background: "linear-gradient(135deg, rgba(0,212,160,0.08), rgba(79,159,255,0.08))", border: "1px solid rgba(0,212,160,0.2)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Azure AI Document Intelligence</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>Upload any receipt — physical or digital. Our OCR engine extracts merchant, total, date, and line items automatically. Categories are suggested using ML classification.</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ background: "linear-gradient(135deg, rgba(245,200,66,0.08), rgba(168,85,247,0.08))", border: "1px solid rgba(245,200,66,0.2)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Supported Formats</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["JPEG", "PNG", "PDF", "TIFF", "BMP"].map(f => (
              <span key={f} style={{ padding: "3px 10px", background: "var(--surface3)", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text2)", border: "1px solid var(--border)" }}>{f}</span>
            ))}
          </div>
          <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>Max size: 10 MB · OCR confidence shown per field</div>
        </div>
      </div>

      {stage === "idle" && (
        <div className={`upload-zone ${drag ? "drag" : ""}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          <div className="upload-icon">📄</div>
          <div className="upload-title">Drop your receipt here</div>
          <div className="upload-sub">or click to browse · JPEG, PNG, PDF up to 10MB</div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>Choose File</button>
        </div>
      )}

      {stage === "uploading" && (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} className="pulse">☁️</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Uploading {fileName}...</div>
          <div style={{ color: "var(--text3)", fontSize: 13 }}>Sending to Azure Blob Storage</div>
        </div>
      )}

      {stage === "scanning" && (
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--emerald)" }}>🔍 Scanning Receipt...</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Azure Document Intelligence is analyzing your document</div>
          </div>
          <div className="receipt-preview" style={{ height: 200, padding: 20 }}>
            <div className="scan-line"></div>
            <div style={{ opacity: 0.4, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2, color: "var(--text2)" }}>
              <div>MERCHANT NAME ████████████████</div>
              <div>DATE: ██/██/████</div>
              <div>─────────────────────────────────</div>
              <div>ITEM 1 ████████████       ₹ ████</div>
              <div>ITEM 2 ████████████       ₹ ████</div>
              <div>─────────────────────────────────</div>
              <div>TOTAL:                  ₹ ████</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
            {["Detecting merchant...", "Extracting total...", "Reading line items...", "Classifying category..."].map((s, i) => (
              <span key={s} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "var(--surface3)", color: "var(--emerald)", fontFamily: "var(--font-mono)", opacity: 0.7 + i * 0.1 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {stage === "result" && editResult && (
        <div className="fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Receipt Scanned Successfully</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Confidence: <span style={{ color: "var(--emerald)", fontFamily: "var(--font-mono)" }}>{(editResult.confidence * 100).toFixed(0)}%</span> · Review and confirm before saving</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-title"><span className="card-title-dot" style={{ background: "var(--emerald)" }}></span>Extracted Data</div>
              <div className="form-group">
                <label className="form-label">Merchant</label>
                <input className="form-input" value={editResult.merchant} onChange={e => setEditResult(r => ({ ...r, merchant: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Total Amount (₹)</label>
                  <input className="form-input" type="number" value={editResult.total} onChange={e => setEditResult(r => ({ ...r, total: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={editResult.date} onChange={e => setEditResult(r => ({ ...r, date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Auto-Suggested Category</label>
                <select className="form-select" value={editResult.category} onChange={e => setEditResult(r => ({ ...r, category: parseInt(e.target.value) }))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSave}>✓ Save to Expenses</button>
                <button className="btn btn-secondary" onClick={() => setStage("idle")}>Discard</button>
              </div>
            </div>

            <div className="card">
              <div className="card-title"><span className="card-title-dot" style={{ background: "var(--sapphire)" }}></span>Line Items</div>
              <table className="data-table">
                <thead><tr><th>Item</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                <tbody>
                  {editResult.items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{item.name}</td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ fontWeight: 700, fontSize: 13 }}>TOTAL</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>₹{editResult.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAX HARVESTING MODULE ────────────────────────────────────────────────────
function TaxHarvesting({ holdings }) {
  const totalLTCG = TAX_EVENTS.filter(e => e.type === "LTCG").reduce((s, e) => s + e.gain, 0);
  const totalSTCG = TAX_EVENTS.filter(e => e.type === "STCG").reduce((s, e) => s + e.gain, 0);
  const LTCG_EXEMPTION = 100000;
  const taxableLTCG = Math.max(0, totalLTCG - LTCG_EXEMPTION);
  const ltcgTax = Math.round(taxableLTCG * 0.10);
  const stcgTax = Math.round(Math.max(0, totalSTCG) * 0.15);
  const totalTax = ltcgTax + stcgTax;
  const potentialSaving = HARVEST_OPPORTUNITIES.reduce((s, h) => s + h.taxSaving, 0);
  const netTaxAfterHarvesting = totalTax - potentialSaving;

  const gainData = [
    { type: "LTCG Realized", value: totalLTCG, color: "#a855f7" },
    { type: "STCG Realized", value: Math.max(0, totalSTCG), color: "#fb923c" },
    { type: "Unrealized Loss", value: Math.abs(Math.min(0, totalSTCG)), color: "#ff4757" },
    { type: "LTCG Exemption", value: LTCG_EXEMPTION, color: "#00d4a0" },
  ];

  return (
    <div className="fade-in">
      {/* TAX SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total LTCG", val: fmtN(totalLTCG), color: "var(--violet)", icon: "📊" },
          { label: "Total STCG", val: fmtN(Math.max(0, totalSTCG)), color: "var(--amber)", icon: "⏱️" },
          { label: "Est. Tax Liability", val: fmtN(totalTax), color: "var(--ruby)", icon: "🏛️" },
          { label: "Potential Saving", val: fmtN(potentialSaving), color: "var(--emerald)", icon: "💡" },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* LTCG METER */}
      <div className="tax-card mb-20">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>LTCG Exemption Usage (₹1L limit)</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13 }}>
              <span style={{ color: "var(--violet)", fontWeight: 700 }}>{fmt(Math.min(totalLTCG, LTCG_EXEMPTION))}</span>
              <span style={{ color: "var(--text3)" }}> of ₹1,00,000 used</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>TAXABLE LTCG @ 10%</div>
            <div className="tax-number" style={{ color: "var(--violet)" }}>{fmtN(taxableLTCG)}</div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, (totalLTCG / LTCG_EXEMPTION) * 100)}%`, background: "linear-gradient(90deg, var(--emerald), var(--violet))" }}></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>
          <span>₹0 (Free Slab)</span>
          <span>₹1,00,000 (Section 112A Exemption)</span>
        </div>
      </div>

      <div className="grid-2">
        {/* CAPITAL GAINS EVENTS */}
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--violet)" }}></span>Capital Gains Ledger</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Buy Date</th>
                <th>Sale Date</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {TAX_EVENTS.map(e => (
                <tr key={e.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{e.symbol}</td>
                  <td><span className={`badge ${e.type.toLowerCase()}`}>{e.type}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{e.buyDate}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{e.saleDate}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{e.qty}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: e.gain >= 0 ? "var(--emerald)" : "var(--ruby)" }}>
                    {fmtN(e.gain)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--surface2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <span style={{ color: "var(--text3)" }}>Total Tax Payable (LTCG + STCG)</span>
              <span style={{ color: "var(--ruby)", fontWeight: 700 }}>{fmtN(totalTax)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 6 }}>
              <span style={{ color: "var(--text3)" }}>After Tax-Loss Harvesting</span>
              <span style={{ color: "var(--emerald)", fontWeight: 700 }}>{fmtN(netTaxAfterHarvesting)}</span>
            </div>
          </div>
        </div>

        {/* HARVEST OPPORTUNITIES */}
        <div className="card">
          <div className="card-title"><span className="card-title-dot" style={{ background: "var(--emerald)" }}></span>🌾 Harvesting Opportunities</div>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 16, lineHeight: 1.5 }}>
            These holdings have unrealized losses. Selling them before March 31st can offset your capital gains and reduce tax liability.
          </div>

          {HARVEST_OPPORTUNITIES.map(h => (
            <div key={h.symbol} className="harvest-row">
              <div style={{ flex: 1 }}>
                <div className="harvest-symbol">{h.symbol}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>Held {h.holdDays} days · Qty: {h.qty}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="harvest-loss">{fmtN(h.loss)}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>Unrealized Loss</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="harvest-saving">Save {fmtN(h.taxSaving)}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)" }}>in taxes</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 14, background: "rgba(0,212,160,0.08)", border: "1px solid rgba(0,212,160,0.2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Total Potential Tax Saving</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--emerald)" }}>{fmtN(potentialSaving)}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>By harvesting losses before FY end (March 31)</div>
          </div>

          <div style={{ marginTop: 12, padding: 10, background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: "var(--radius-sm)", fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--violet)" }}>54EC Bond Strategy:</strong> If LTCG from real estate exceeds ₹1L, invest in NHAI/REC bonds within 6 months to claim full LTCG exemption under Section 54EC.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [holdings, setHoldings] = useState(HOLDINGS);
  const [notification, setNotification] = useState(null);

  const notify = useCallback((n) => setNotification(n), []);

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "⚡", section: "OVERVIEW" },
    { id: "expenses", label: "Expense Tracker", icon: "💳", section: "TRACKING" },
    { id: "portfolio", label: "Portfolio", icon: "📈", section: "TRACKING" },
    { id: "goals", label: "Goals & SIP", icon: "🎯", section: "PLANNING" },
    { id: "receipt", label: "Receipt Scanner", icon: "🤖", section: "AI TOOLS", badge: "AI" },
    { id: "tax", label: "Tax Harvesting", icon: "🌾", section: "PLANNING" },
  ];

  const MODULE_TITLES = {
    dashboard: "Dashboard Overview",
    expenses: "Expense Tracker",
    portfolio: "Investment Portfolio",
    goals: "Goals & SIP Calculator",
    receipt: "AI Receipt Scanner",
    tax: "Tax Harvesting Insights",
  };

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <Dashboard expenses={expenses} holdings={holdings} />;
      case "expenses": return <ExpenseTracker expenses={expenses} setExpenses={setExpenses} notify={notify} />;
      case "portfolio": return <Portfolio holdings={holdings} setHoldings={setHoldings} notify={notify} />;
      case "goals": return <Goals notify={notify} />;
      case "receipt": return <ReceiptScanner setExpenses={setExpenses} notify={notify} />;
      case "tax": return <TaxHarvesting holdings={holdings} />;
      default: return null;
    }
  };

  const sections = [...new Set(NAV.map(n => n.section))];

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">💰</div>
            <div>
              <div className="logo-text">WealthTrack</div>
              <div className="logo-sub">AI · v1.0</div>
            </div>
          </div>

          <div className="sidebar-nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {NAV.filter(n => n.section === section).map(item => (
                  <div key={item.id} className={`nav-item ${activeModule === item.id ? "active" : ""}`} onClick={() => setActiveModule(item.id)}>
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="avatar">R</div>
              <div>
                <div className="user-name">Rahul Mehta</div>
                <div className="user-plan">Pro · Azure Synced</div>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          {/* TICKER */}
          <div className="ticker-strip">
            <div className="ticker-inner">
              {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
                <div key={i} className="ticker-item">
                  <span className="ticker-sym">{t.sym}</span>
                  <span className="ticker-price">{t.price}</span>
                  <span className={`ticker-chg ${t.up ? "up" : "down"}`}>{t.up ? "▲" : "▼"} {t.chg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-title">{MODULE_TITLES[activeModule]}</div>
            <div className="topbar-date">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
            {activeModule === "expenses" && (
              <button className="topbar-action" onClick={() => setActiveModule("receipt")}>🤖 Scan Receipt</button>
            )}
            {activeModule === "dashboard" && (
              <button className="topbar-action" onClick={() => setActiveModule("portfolio")}>📊 Full Portfolio</button>
            )}
          </div>

          {/* CONTENT */}
          <div className="content">
            {renderModule()}
          </div>
        </div>
      </div>

      {notification && (
        <Notification notif={notification} onClose={() => setNotification(null)} />
      )}
    </>
  );
}
