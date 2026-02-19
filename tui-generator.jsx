import { useState, useCallback, useEffect } from "react";

const defaultProjects = [
  { icon: "✦", name: "DroidForge", tag: "ANDROID", philosophy: "Native device management & automation", progress: 72, stack: "Kotlin · Jetpack · Room", stars: 142, commits: 847, status: "ACTIVE" },
  { icon: "❖", name: "CloudPulse", tag: "SaaS", philosophy: "Real-time infra monitoring & alerts", progress: 91, stack: "React · Node · Redis", stars: 230, commits: 1203, status: "STABLE" },
  { icon: "⌬", name: "DataForge", tag: "SaaS", philosophy: "ETL pipeline builder + visual editor", progress: 58, stack: "Python · Airflow · PostgreSQL", stars: 89, commits: 532, status: "BETA" },
  { icon: "⬢", name: "AuthVault", tag: "SaaS", philosophy: "Identity & access mgmt with SSO", progress: 85, stack: "Go · OAuth2 · JWT", stars: 178, commits: 621, status: "STABLE" },
  { icon: "⌘", name: "MetricFlow", tag: "SaaS", philosophy: "Analytics platform + report builder", progress: 44, stack: "TypeScript · D3 · ClickHouse", stars: 56, commits: 318, status: "ALPHA" },
  { icon: "⊕", name: "DeployPilot", tag: "SaaS", philosophy: "CI/CD orchestration & rollbacks", progress: 63, stack: "Rust · Docker · K8s", stars: 112, commits: 489, status: "ACTIVE" },
];

const defaultConfig = {
  projects: [],
  style: "full",
  title: "",
  version: "",
  footer: ""
};

const TEMPLATE_PROJECTS = [
  {
    icon: "✦",
    name: "DroidForge",
    tag: "ANDROID",
    philosophy: "Native device management & automation",
    stack: "Kotlin · Jetpack · Room",
    stars: 142,
    commits: 847,
    showStats: true,
    products: [
      { name: "Core Engine", status: "ACTIVE", progress: 85 },
      { name: "Automation SDK", status: "STABLE", progress: 72 },
      { name: "Device Manager", status: "BETA", progress: 45 }
    ]
  },
  {
    icon: "❖",
    name: "CloudPulse",
    tag: "SaaS",
    philosophy: "Real-time infra monitoring & alerts",
    stack: "React · Node · Redis",
    stars: 230,
    commits: 1203,
    showStats: false,
    products: [
      { name: "API Service", status: "STABLE", progress: 91 },
      { name: "Dashboard UI", status: "ACTIVE", progress: 88 }
    ]
  },
  {
    icon: "⌬",
    name: "OnlyOffline",
    tag: "MOBILE",
    philosophy: "Offline-first productivity suite",
    stack: "Flutter · SQLite · Firebase",
    stars: 450,
    commits: 2301,
    showStats: true,
    products: [
      { name: "Android App", status: "STABLE", progress: 95 },
      { name: "iOS App", status: "BETA", progress: 60 },
      { name: "Desktop App", status: "ALPHA", progress: 20 },
      { name: "Web Preview", status: "ACTIVE", progress: 40 }
    ]
  }
];

const statusColors = {
  ACTIVE: "#22c55e",
  STABLE: "#3b82f6",
  BETA: "#f59e0b",
  ALPHA: "#ef4444",
};

const COMMON_ICONS = ["✦", "❖", "⌬", "⬢", "⌘", "⊕", "⊗", "⊘", "⊚", "⊛", "⊜", "⊝", "⊡", "⋈", "⊹", "⋆", "⏍", "⏛", "⎔", "⎚"];

const ICON_KEYWORDS = {
  "✦": ["bot", "ai", "droid", "automate", "machine"],
  "❖": ["cloud", "server", "infra", "host"],
  "⌬": ["fast", "perf", "speed", "data", "volt"],
  "⬢": ["auth", "security", "vault", "lock", "sso", "identity"],
  "⌘": ["metric", "analytics", "chart", "data", "report", "flow"],
  "⊕": ["deploy", "launch", "ship", "pilot"],
  "⊗": ["package", "module", "box", "shipment"],
  "⊘": ["safe", "shield", "protect", "defense"],
  "⊚": ["web", "network", "internet", "browser"],
  "⊛": ["mobile", "phone", "app", "ios", "android"],
  "⊜": ["code", "dev", "web", "terminal"],
  "⊝": ["sys", "config", "settings", "engine"],
  "⊡": ["tool", "fix", "build", "craft"],
  "⋈": ["hot", "fire", "trending", "alert"],
  "⊹": ["idea", "bright", "smart", "insight"],
  "⋆": ["test", "lab", "beta", "alpha"],
  "⏍": ["signal", "sync", "stream", "api"],
  "⏛": ["logic", "smart", "learn", "brain"],
};

function suggestIcon(text = "") {
  const t = text.toLowerCase();
  for (const [icon, keywords] of Object.entries(ICON_KEYWORDS)) {
    if (keywords.some((k) => t.includes(k))) return icon;
  }
  return null;
}


const STYLES = [
  { id: "full", label: "Full TUI" },
  { id: "compact", label: "Compact" },
  { id: "double", label: "Double Border" },
  { id: "minimal", label: "Minimal" },
];

function buildBar(pct, len = 20) {
  const filled = Math.round((pct / 100) * len);
  return "▓".repeat(filled) + "░".repeat(len - filled);
}

function generateFull(projects, title, version, footer) {
  const W = 46;
  const pad = (s, w) => s + " ".repeat(Math.max(0, w - s.length));
  const totalCommits = projects.reduce((s, p) => s + p.commits, 0).toLocaleString();

  let out = "";
  out += `┌${"─".repeat(W)}┐\n`;
  out += `│  ${pad(`⚡ ${title}`, W - 12)}${pad(version, 10)}│\n`;
  out += `│  ${"─".repeat(W - 4)}  │\n`;
  out += `│  ${pad(`${projects.length} active projects · ${new Date().getFullYear()}`, W - 2)}│\n`;
  out += `└${"─".repeat(W)}┘\n\n`;

  projects.forEach((p) => {
    const header = `${p.icon} ${p.name} `;
    const tagStr = `[${p.tag}]`;
    const dashes = Math.max(1, W - header.length - tagStr.length - 2);
    out += `${header}${"─".repeat(dashes)} ${tagStr}\n`;
    out += `   ${p.philosophy}\n`;
    out += `   Tech Stack: ${p.stack}\n`;

    if (p.showStats) {
      out += `   ★ ${p.stars}  ⟫ ${p.commits.toLocaleString()} commits\n`;
    }

    // Render products
    if (p.products && p.products.length > 0) {
      p.products.forEach(prod => {
        const prodTitle = (prod.name || "").slice(0, 16).padEnd(17);
        const statusLabel = (prod.status || "ALPHA").padEnd(8);
        out += `   ${prodTitle} ${statusLabel} ${buildBar(prod.progress, 12)} ${prod.progress}%\n`;
      });
    } else {
      // Fallback for projects with no products (migration)
      const statusLabel = (p.status || "ALPHA").padEnd(8);
      out += `   ${"".padEnd(17)} ${statusLabel} ${buildBar(p.progress || 0, 12)} ${p.progress || 0}%\n`;
    }
    out += "\n";
  });

  const anyStats = projects.some(p => p.showStats);
  if (anyStats || footer) {
    out += `┌${"─".repeat(W)}┐\n`;
    if (anyStats) {
      out += `│  ${pad(`Total commits: ${totalCommits}`, W - 2)}│\n`;
    }
    if (footer) {
      out += `│  ${pad(footer, W - 2)}│\n`;
    }
    out += `└${"─".repeat(W)}┘`;
  }
  return out;
}

function generateCompact(projects, title) {
  let out = `⚡ ${title}\n\n`;
  projects.forEach((p) => {
    out += `${p.icon} ${p.name}\n`;
    if (p.products) {
      p.products.forEach((prod) => {
        out += `  ${prod.name.padEnd(12)} ${buildBar(prod.progress, 15)} ${prod.progress}%\n`;
      });
    }
    out += "\n";
  });
  return out;
}

function generateDouble(projects, title) {
  const W = 46;
  const pad = (s, w) => s + " ".repeat(Math.max(0, w - s.length));
  let out = `╔${"═".repeat(W)}╗\n`;
  out += `║  ${pad(`${title}`, W - 12)}${pad(String(new Date().getFullYear()), 10)}║\n`;
  out += `╠${"═".repeat(W)}╣\n`;
  out += `║${" ".repeat(W)}║\n`;
  projects.forEach((p) => {
    const line1 = `${p.icon} ${p.name} [${p.tag}]`;
    out += `║  ${pad(line1, W - 2)}║\n`;
    if (p.products && p.products.length > 0) {
      p.products.forEach(prod => {
        const barStr = `[${"█".repeat(Math.round((prod.progress / 100) * 10))}${"░".repeat(10 - Math.round((prod.progress / 100) * 10))}] ${prod.progress}%`;
        out += `║     ${pad(prod.name, W - barStr.length - 8)}${barStr}  ║\n`;
      });
    }
    out += `║${" ".repeat(W)}║\n`;
  });
  out += `╚${"═".repeat(W)}╝`;
  return out;
}

function generateMinimal(projects) {
  let out = "";
  projects.forEach((p, i) => {
    out += `${p.icon} ${p.name} [${p.tag}]\n`;
    if (p.products) {
      p.products.forEach(prod => {
        out += `${prod.name.padEnd(12)} [${"■".repeat(Math.round(prod.progress / 10))}${"□".repeat(10 - Math.round(prod.progress / 10))}] ${prod.progress}%\n`;
      });
    }
    if (i < projects.length - 1) out += "\n";
  });
  return out;
}

function generate(config) {
  const { projects, style, title, version, footer } = config;
  switch (style) {
    case "full": return generateFull(projects, title, version, footer);
    case "compact": return generateCompact(projects, title);
    case "double": return generateDouble(projects, title);
    case "minimal": return generateMinimal(projects);
    default: return "";
  }
}

export default function App() {
  const [config, setConfig] = useState(() => {
    const migrate = (data) => {
      if (!data) return data;
      return {
        ...data,
        projects: (data.projects || []).map(p => ({
          ...p,
          philosophy: p.philosophy || p.desc || "",
          products: p.products || p.builds || [{ name: "Main", status: p.status || "ACTIVE", progress: p.progress || 0 }]
        }))
      };
    };

    try {
      const active = localStorage.getItem("tui_active_session");
      if (active) return migrate(JSON.parse(active));

      // Legacy migration
      const legacy = {
        projects: JSON.parse(localStorage.getItem("tui_projects") || "null"),
        style: JSON.parse(localStorage.getItem("tui_style") || "null"),
        title: JSON.parse(localStorage.getItem("tui_title") || "null"),
        version: JSON.parse(localStorage.getItem("tui_version") || "null"),
        footer: JSON.parse(localStorage.getItem("tui_footer") || "null")
      };
      if (legacy.projects) {
        const merged = { ...defaultConfig, ...Object.fromEntries(Object.entries(legacy).filter(([k, v]) => v !== null)) };
        return migrate(merged);
      }

      return defaultConfig;
    } catch (e) { return defaultConfig; }
  });

  const [baseConfig, setBaseConfig] = useState(() => {
    try {
      const savedBase = localStorage.getItem("tui_base_session");
      return savedBase ? JSON.parse(savedBase) : config;
    } catch (e) { return config; }
  });

  const [copied, setCopied] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [tab, setTab] = useState("editor");

  useEffect(() => {
    localStorage.setItem("tui_active_session", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("tui_base_session", JSON.stringify(baseConfig));
  }, [baseConfig]);

  const resetToDefaults = () => {
    if (confirm("Clear all data and start with blank template?")) {
      setConfig(defaultConfig);
      setBaseConfig(defaultConfig);
    }
  };

  const loadExampleTemplate = () => {
    if (confirm("Load example template projects?")) {
      const template = { ...defaultConfig, projects: TEMPLATE_PROJECTS, title: "PROJECT DASHBOARD", version: "v2.0" };
      setConfig(template);
      setBaseConfig(template);
    }
  };

  const revertToSessionStart = () => {
    if (confirm("Discard all changes since session started/imported?")) {
      setConfig(baseConfig);
    }
  };

  const exportConfig = () => {
    const data = config;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tui-config-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const migrateProject = (p) => ({
          ...p,
          philosophy: p.philosophy || p.desc || "",
          showStats: p.showStats !== undefined ? p.showStats : (config.showStats || false),
          products: p.products || p.builds || [{ name: "Main", status: p.status || "ACTIVE", progress: p.progress || 0 }]
        });
        const migrated = {
          projects: (data.projects || []).map(migrateProject),
          style: data.style || "full",
          title: data.title || "",
          version: data.version || "",
          footer: data.footer || ""
        };
        setConfig(migrated);
        setBaseConfig(migrated);
        alert("Configuration imported as new session base.");
      } catch (err) { alert("Failed to import configuration: Invalid JSON"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const { projects, style, title, version, footer } = config;
  const output = generate(config);

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateProject = (idx, field, value) => {
    setConfig((prev) => {
      const nextProjects = [...prev.projects];
      let val = value;
      if (["stars", "commits"].includes(field)) val = Number(value) || 0;

      nextProjects[idx] = { ...nextProjects[idx], [field]: val };

      if (field === "name" || field === "philosophy") {
        const suggestion = suggestIcon(val || (field === "name" ? nextProjects[idx].philosophy : nextProjects[idx].name));
        if (suggestion && (nextProjects[idx].icon === "⊗" || nextProjects[idx].icon === "❓")) {
          nextProjects[idx].icon = suggestion;
        }
      }

      return { ...prev, projects: nextProjects };
    });
  };

  const updateProduct = (projectIdx, prodIdx, field, value) => {
    setConfig((prev) => {
      const nextProjects = [...prev.projects];
      const nextProducts = [...nextProjects[projectIdx].products];
      nextProducts[prodIdx] = { ...nextProducts[prodIdx], [field]: field === "progress" ? Number(value) || 0 : value };
      nextProjects[projectIdx] = { ...nextProjects[projectIdx], products: nextProducts };
      return { ...prev, projects: nextProjects };
    });
  };

  const addProduct = (projectIdx) => {
    setConfig((prev) => {
      const nextProjects = [...prev.projects];
      nextProjects[projectIdx] = {
        ...nextProjects[projectIdx],
        products: [...(nextProjects[projectIdx].products || []), { name: "New Product", status: "ALPHA", progress: 0 }]
      };
      return { ...prev, projects: nextProjects };
    });
  };

  const removeProduct = (projectIdx, prodIdx) => {
    setConfig((prev) => {
      const nextProjects = [...prev.projects];
      nextProjects[projectIdx] = {
        ...nextProjects[projectIdx],
        products: nextProjects[projectIdx].products.filter((_, i) => i !== prodIdx)
      };
      return { ...prev, projects: nextProjects };
    });
  };

  const addProject = () => {
    setConfig((prev) => ({
      ...prev,
      projects: [...prev.projects, {
        icon: "⊗",
        name: "NewProject",
        tag: "SaaS",
        philosophy: "Philosophy here",
        stack: "Tech · Stack",
        stars: 0,
        commits: 0,
        showStats: false,
        products: [{ name: "Main Product", status: "ALPHA", progress: 0 }]
      }]
    }));
    setEditIdx(prev.projects.length);
  };

  const removeProject = (idx) => {
    setConfig((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
    setEditIdx(null);
  };

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const font = "'IBM Plex Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', monospace";

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", color: "#e0e0e0", fontFamily: font, fontSize: 13 }}>
      {/* Header */}
      <div style={{ background: "#161616", borderBottom: "1px solid #2a2a2a", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <span style={{ color: "#888", fontSize: 12 }}>linkedin-tui-generator — zsh</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["editor", "preview"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? "#333" : "transparent",
                color: tab === t ? "#22c55e" : "#666",
                border: `1px solid ${tab === t ? "#444" : "#2a2a2a"}`,
                padding: "4px 14px",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: font,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 45px)" }}>
        {/* LEFT: Editor */}
        {tab === "editor" && (
          <div style={{ flex: 1, overflow: "auto", padding: 20, borderRight: "1px solid #2a2a2a" }}>
            {/* Global Settings */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#22c55e", marginBottom: 10, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
                <span>▸ Settings</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={exportConfig}
                    style={{
                      background: "transparent",
                      color: "#3b82f6",
                      border: "1px solid #3b82f644",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 9,
                      textTransform: "uppercase"
                    }}
                  >
                    Export
                  </button>
                  <label
                    style={{
                      background: "transparent",
                      color: "#3b82f6",
                      border: "1px solid #3b82f644",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 9,
                      textTransform: "uppercase",
                      display: "inline-block"
                    }}
                  >
                    Import
                    <input type="file" accept=".json" onChange={importConfig} style={{ display: "none" }} />
                  </label>
                  <button
                    onClick={revertToSessionStart}
                    style={{
                      background: "transparent",
                      color: "#f59e0b",
                      border: "1px solid #f59e0b44",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 9,
                      textTransform: "uppercase"
                    }}
                  >
                    Revert to Start
                  </button>
                  <button
                    onClick={loadExampleTemplate}
                    style={{
                      background: "transparent",
                      color: "#22c55e",
                      border: "1px solid #22c55e44",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 9,
                      textTransform: "uppercase"
                    }}
                  >
                    Load Template
                  </button>
                  <button
                    onClick={resetToDefaults}
                    style={{
                      background: "transparent",
                      color: "#666",
                      border: "1px solid #333",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 9,
                      textTransform: "uppercase"
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Title", field: "title" },
                  { label: "Version", field: "version" },
                  { label: "Footer", field: "footer" },
                ].map((f, i) => (
                  <div key={i} style={{ gridColumn: i === 2 ? "1 / -1" : undefined }}>
                    <label style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                    <input
                      value={config[f.field]}
                      onChange={(e) => updateConfig(f.field, e.target.value)}
                      style={{
                        width: "100%",
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        color: "#e0e0e0",
                        padding: "6px 10px",
                        borderRadius: 4,
                        fontFamily: font,
                        fontSize: 12,
                        marginTop: 2,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Style selector */}
              <div style={{ marginTop: 12 }}>
                <label style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Style</label>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateConfig("style", s.id)}
                      style={{
                        background: style === s.id ? "#22c55e" : "#1a1a1a",
                        color: style === s.id ? "#0c0c0c" : "#999",
                        border: `1px solid ${style === s.id ? "#22c55e" : "#333"}`,
                        padding: "5px 12px",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontFamily: font,
                        fontSize: 11,
                        fontWeight: style === s.id ? 700 : 400,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <div style={{ color: "#22c55e", marginBottom: 10, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>▸ Projects ({projects.length})</span>
                <button
                  onClick={addProject}
                  style={{
                    background: "#1a1a1a",
                    color: "#22c55e",
                    border: "1px solid #333",
                    padding: "3px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: font,
                    fontSize: 11,
                  }}
                >
                  + Add
                </button>
              </div>

              {projects.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: editIdx === idx ? "#1a1a1a" : "#111",
                    border: `1px solid ${editIdx === idx ? "#22c55e" : "#222"}`,
                    borderRadius: 6,
                    marginBottom: 8,
                    overflow: "hidden",
                  }}
                >
                  {/* Project header row */}
                  <div
                    onClick={() => setEditIdx(editIdx === idx ? null : idx)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      userSelect: "none",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{p.icon}</span>
                    <span style={{ color: "#e0e0e0", fontWeight: 600, flex: 1 }}>{p.name}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 3,
                        background: (statusColors[p.products?.[0]?.status || "ALPHA"] || "#666") + "22",
                        color: statusColors[p.products?.[0]?.status || "ALPHA"] || "#666",
                        fontWeight: 600,
                      }}
                    >
                      {p.products?.[0]?.status || "ALPHA"}
                    </span>
                    {/* Mini progress */}
                    <div style={{ width: 60, height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${p.products?.[0]?.progress || 0}%`, height: "100%", background: "#22c55e", borderRadius: 2 }} />
                    </div>
                    <span style={{ color: "#666", fontSize: 11 }}>{p.products?.[0]?.progress || 0}%</span>
                    <span style={{ color: "#444", fontSize: 14 }}>{editIdx === idx ? "▾" : "▸"}</span>
                  </div>

                  {/* Expanded editor */}
                  {editIdx === idx && (
                    <div style={{ padding: "0 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Icon", field: "icon", span: false },
                        { label: "Name", field: "name", span: false },
                        { label: "Tag", field: "tag", span: false },
                        { label: "Tech Stack", field: "stack", span: false },
                        { label: "Philosophy", field: "philosophy", span: true },
                      ].map((f) => (
                        <div key={f.field} style={{ gridColumn: f.span ? "1 / -1" : undefined }}>
                          <label style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                          {f.field === "icon" ? (
                            <div style={{ display: "flex", gap: 4, marginTop: 2, flexWrap: "wrap", background: "#0c0c0c", padding: 6, borderRadius: 4, border: "1px solid #222" }}>
                              {COMMON_ICONS.map(icon => (
                                <button
                                  key={icon}
                                  onClick={() => updateProject(idx, "icon", icon)}
                                  style={{
                                    background: p.icon === icon ? "#333" : "transparent",
                                    border: "none",
                                    fontSize: 16,
                                    cursor: "pointer",
                                    padding: "4px",
                                    borderRadius: 4,
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  {icon}
                                </button>
                              ))}
                              <div style={{ width: "100%", height: 1, background: "#222", margin: "2px 0" }} />
                              <button
                                onClick={() => {
                                  const suggestion = suggestIcon(p.name + " " + p.philosophy);
                                  if (suggestion) updateProject(idx, "icon", suggestion);
                                }}
                                style={{
                                  background: "#1a1a1a",
                                  color: "#22c55e",
                                  border: "1px solid #333",
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                  fontSize: 9,
                                  textTransform: "uppercase",
                                  width: "100%"
                                }}
                              >
                                Auto-Discover Icon
                              </button>
                            </div>
                          ) : (
                            <input
                              value={p[f.field]}
                              onChange={(e) => updateProject(idx, f.field, e.target.value)}
                              style={{
                                width: "100%",
                                background: "#0c0c0c",
                                border: "1px solid #333",
                                color: "#e0e0e0",
                                padding: "5px 8px",
                                borderRadius: 3,
                                fontFamily: font,
                                fontSize: 12,
                                marginTop: 2,
                                boxSizing: "border-box",
                              }}
                            />
                          )}
                        </div>
                      ))}

                      {/* Products Section */}
                      <div style={{ gridColumn: "1 / -1", marginTop: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <label style={{ color: "#22c55e", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Products / Sub-projects</label>
                          <button
                            onClick={() => addProduct(idx)}
                            style={{ background: "#22c55e", color: "#000", border: "none", padding: "2px 8px", borderRadius: 4, fontSize: 10, cursor: "pointer", fontWeight: 700 }}
                          >
                            + ADD PRODUCT
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {(p.products || []).map((prod, prodIdx) => (
                            <div key={prodIdx} style={{ background: "#0c0c0c", padding: 10, borderRadius: 6, border: "1px solid #222" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8 }}>
                                <div>
                                  <label style={{ color: "#444", fontSize: 9, textTransform: "uppercase" }}>Name</label>
                                  <input
                                    value={prod.name}
                                    onChange={(e) => updateProduct(idx, prodIdx, "name", e.target.value)}
                                    style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#ccc", padding: "4px 8px", borderRadius: 4, fontSize: 11, marginTop: 2 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: "#444", fontSize: 9, textTransform: "uppercase" }}>Status</label>
                                  <select
                                    value={prod.status}
                                    onChange={(e) => updateProduct(idx, prodIdx, "status", e.target.value)}
                                    style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#ccc", padding: "4px 4px", borderRadius: 4, fontSize: 11, marginTop: 2 }}
                                  >
                                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </div>
                                <button
                                  onClick={() => removeProduct(idx, prodIdx)}
                                  style={{ alignSelf: "end", background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontSize: 14, paddingBottom: 6 }}
                                >
                                  ✕
                                </button>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <label style={{ color: "#444", fontSize: 9, textTransform: "uppercase", width: 80 }}>Progress: {prod.progress}%</label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={prod.progress}
                                  onChange={(e) => updateProduct(idx, prodIdx, "progress", e.target.value)}
                                  style={{ flex: 1, accentColor: "#22c55e" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats & Commits */}
                      <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, padding: 10, background: "#111", borderRadius: 6, border: "1px solid #222" }}>
                        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <input
                            id={`show-stats-${idx}`}
                            type="checkbox"
                            checked={p.showStats}
                            onChange={(e) => updateProject(idx, "showStats", e.target.checked)}
                          />
                          <label htmlFor={`show-stats-${idx}`} style={{ color: "#22c55e", fontSize: 10, textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
                            Include Stats & Commits
                          </label>
                        </div>
                        {p.showStats && (
                          <>
                            <div>
                              <label style={{ color: "#555", fontSize: 10, textTransform: "uppercase" }}>Stars</label>
                              <input
                                type="number"
                                value={p.stars}
                                onChange={(e) => updateProject(idx, "stars", e.target.value)}
                                style={{ width: "100%", background: "#0c0c0c", border: "1px solid #333", color: "#e0e0e0", padding: "5px 8px", borderRadius: 3, fontFamily: font, fontSize: 12, marginTop: 2, boxSizing: "border-box" }}
                              />
                            </div>
                            <div>
                              <label style={{ color: "#555", fontSize: 10, textTransform: "uppercase" }}>Commits</label>
                              <input
                                type="number"
                                value={p.commits}
                                onChange={(e) => updateProject(idx, "commits", e.target.value)}
                                style={{ width: "100%", background: "#0c0c0c", border: "1px solid #333", color: "#e0e0e0", padding: "5px 8px", borderRadius: 3, fontFamily: font, fontSize: 12, marginTop: 2, boxSizing: "border-box" }}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ gridColumn: "1 / -1", textAlign: "right", marginTop: 4 }}>
                        <button
                          onClick={() => removeProject(idx)}
                          style={{
                            background: "transparent",
                            color: "#ef4444",
                            border: "1px solid #ef444444",
                            padding: "4px 12px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontFamily: font,
                            fontSize: 11,
                          }}
                        >
                          ✕ Remove Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT / PREVIEW: Output */}
        <div style={{ flex: tab === "preview" ? 1 : 1, display: "flex", flexDirection: "column", overflow: "hidden", ...(tab === "editor" ? {} : {}) }}>
          {/* Preview toolbar */}
          <div style={{ padding: "10px 20px", background: "#161616", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Output</span>
            <div style={{ flex: 1 }} />
            <button
              onClick={copyToClipboard}
              style={{
                background: copied ? "#22c55e" : "#1a1a1a",
                color: copied ? "#0c0c0c" : "#22c55e",
                border: `1px solid ${copied ? "#22c55e" : "#333"}`,
                padding: "6px 18px",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: font,
                fontSize: 12,
                fontWeight: 700,
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "⎘ Copy to Clipboard"}
            </button>
          </div>

          {/* Preview area */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {/* LinkedIn simulation */}
            <div style={{ background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a", maxWidth: 560, margin: "0 auto" }}>
              {/* Fake LinkedIn post header */}
              <div style={{ padding: "14px 16px 10px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid #222" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>
                  Y
                </div>
                <div>
                  <div style={{ color: "#e0e0e0", fontSize: 13, fontWeight: 600 }}>Your Name</div>
                  <div style={{ color: "#666", fontSize: 11 }}>Building 6 products · Just now</div>
                </div>
              </div>
              {/* Post content */}
              <pre
                style={{
                  padding: "16px",
                  margin: 0,
                  fontFamily: font,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "#d4d4d4",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowX: "auto",
                }}
              >
                {output}
              </pre>
            </div>

            {/* Raw output below */}
            <div style={{ marginTop: 20, maxWidth: 560, margin: "20px auto 0" }}>
              <div style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Raw Text</div>
              <pre
                style={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 6,
                  padding: 16,
                  fontFamily: font,
                  fontSize: 11,
                  color: "#888",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
