import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

/* ── Design tokens ─────────────────────────────────────────── */
const tk = {
  bg: "#09090B",
  surface: "#111113",
  surfaceHover: "#16161A",
  border: "#1F1F23",
  borderMid: "#27272A",
  text: "#E4E4E7",
  textMid: "#71717A",
  textDim: "#3F3F46",
  white: "#FAFAFA",
  blue: "#3B82F6",
  blueBg: "#172554",
  green: "#22C55E",
  greenBg: "#052E16",
  red: "#F87171",
  redBg: "#450A0A",
  amber: "#FBBF24",
  amberBg: "#431407",
};

const STATUS_META = {
  open: { color: tk.red, bg: tk.redBg, label: "Open" },
  escalated: { color: tk.amber, bg: tk.amberBg, label: "Escalated" },
  resolved: { color: tk.green, bg: tk.greenBg, label: "Resolved" },
};

/* ── Primitives ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const m = STATUS_META[status] || {
    color: tk.textMid,
    bg: tk.surface,
    label: status,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 8px",
        borderRadius: "99px",
        fontSize: "11px",
        fontWeight: 600,
        color: m.color,
        background: m.bg + "55",
        border: `1px solid ${m.color}35`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.color,
          flexShrink: 0,
        }}
      />
      {m.label}
    </span>
  );
}

function Button({
  children,
  onClick,
  disabled,
  variant = "ghost",
  size = "sm",
}) {
  const V = {
    primary: { bg: tk.blue, color: "#fff", border: tk.blue, hover: "#2563EB" },
    ghost: {
      bg: "transparent",
      color: tk.textMid,
      border: tk.borderMid,
      hover: tk.surfaceHover,
    },
    success: {
      bg: tk.greenBg + "88",
      color: tk.green,
      border: tk.green + "40",
      hover: tk.greenBg,
    },
    danger: {
      bg: tk.redBg + "88",
      color: tk.red,
      border: tk.red + "40",
      hover: tk.redBg,
    },
    warning: {
      bg: tk.amberBg + "88",
      color: tk.amber,
      border: tk.amber + "40",
      hover: tk.amberBg,
    },
  }[variant];
  const pad = size === "md" ? "7px 16px" : "5px 12px";
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: pad,
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        background: V.bg,
        color: disabled ? tk.textDim : V.color,
        border: `1px solid ${disabled ? tk.border : V.border}`,
        opacity: disabled ? 0.45 : 1,
        transition: "opacity 0.15s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

/* ── Inline SVG icons (zero deps) ───────────────────────────── */
const Icon = {
  Reply: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Resolve: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Escalate: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Send: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Spark: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  Save: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Search: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

const NAV_ICONS = {
  Dashboard: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Orders: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  Customers: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Conversations: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Tickets: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
    </svg>
  ),
  Knowledge: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
};

/* ── Shared helpers ─────────────────────────────────────────── */
function useFetch(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}${path}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error };
}

function EmptyPane({ msg }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: tk.textMid,
        fontSize: "13px",
      }}
    >
      {msg}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: 600,
        color: tk.textDim,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
}

/* ── DashboardView ─────────────────────────────────────────── */
function DashboardView() {
  const { data: tickets, loading: tl, error: te } = useFetch("/admin/tickets");
  const {
    data: convos,
    loading: cl,
    error: ce,
  } = useFetch("/api/conversations");

  const stats = tickets
    ? {
        open: tickets.filter((t) => t.status === "open").length,
        escalated: tickets.filter((t) => t.status === "escalated").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
      }
    : null;

  return (
    <div style={{ padding: "28px 32px" }}>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: tk.white,
          marginBottom: "24px",
        }}
      >
        Dashboard
      </div>
      {(tl || cl) && (
        <div style={{ color: tk.textMid, fontSize: "13px" }}>Loading…</div>
      )}
      {(te || ce) && (
        <div style={{ color: tk.red, fontSize: "13px" }}>Error: {te || ce}</div>
      )}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "12px",
          }}
        >
          {[
            { label: "Open Tickets", value: stats.open, color: tk.red },
            { label: "Escalated", value: stats.escalated, color: tk.amber },
            { label: "Resolved", value: stats.resolved, color: tk.green },
            {
              label: "Conversations",
              value: convos?.length ?? "—",
              color: tk.blue,
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: tk.surface,
                border: `1px solid ${tk.border}`,
                borderRadius: "8px",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color,
                  marginBottom: "4px",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: "12px", color: tk.textMid }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── OrdersView ────────────────────────────────────────────── */
function OrdersView() {
  const { data: orders, loading, error } = useFetch("/orders");
  return (
    <div style={{ padding: "28px 32px" }}>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: tk.white,
          marginBottom: "20px",
        }}
      >
        Orders
      </div>
      {loading && (
        <div style={{ color: tk.textMid, fontSize: "13px" }}>Loading…</div>
      )}
      {error && (
        <div style={{ color: tk.red, fontSize: "13px" }}>Error: {error}</div>
      )}
      {orders?.map((o) => (
        <div
          key={o.id || o._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
            borderBottom: `1px solid ${tk.border}`,
            fontSize: "13px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              color: tk.textMid,
              fontSize: "11px",
            }}
          >
            {o.id || o._id}
          </span>
          <span style={{ color: tk.text }}>{o.customer_id}</span>
          <StatusBadge status={o.status} />
          <span style={{ color: tk.textMid, marginLeft: "auto" }}>
            ${o.total}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── CustomersView ─────────────────────────────────────────── */
function CustomersView() {
  const { data: customers, loading, error } = useFetch("/customers");
  return (
    <div style={{ padding: "28px 32px" }}>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: tk.white,
          marginBottom: "20px",
        }}
      >
        Customers
      </div>
      {loading && (
        <div style={{ color: tk.textMid, fontSize: "13px" }}>Loading…</div>
      )}
      {error && (
        <div style={{ color: tk.red, fontSize: "13px" }}>Error: {error}</div>
      )}
      {customers?.map((c) => (
        <div
          key={c.id || c._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0",
            borderBottom: `1px solid ${tk.border}`,
            fontSize: "13px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              color: tk.textMid,
              fontSize: "11px",
            }}
          >
            {c.id || c._id}
          </span>
          <span style={{ color: tk.text }}>{c.name || c.email}</span>
        </div>
      ))}
    </div>
  );
}

/* ── ConversationsView ─────────────────────────────────────── */
function ConversationsView({ initialConversationId }) {
  const { data: convos, loading, error } = useFetch("/api/conversations");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!initialConversationId || !convos) return;
    const conversation = convos.find(
      (c) => c.conversation_id === initialConversationId,
    );
    if (conversation) setSelected(conversation);
  }, [convos, initialConversationId]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* List */}
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          borderRight: `1px solid ${tk.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${tk.border}`,
          }}
        >
          <SectionLabel>Conversations</SectionLabel>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <div
              style={{ padding: "16px", color: tk.textMid, fontSize: "13px" }}
            >
              Loading…
            </div>
          )}
          {error && (
            <div style={{ padding: "16px", color: tk.red, fontSize: "13px" }}>
              Error: {error}
            </div>
          )}
          {convos?.map((c) => (
            <div
              key={c.conversation_id}
              onClick={() => setSelected(c)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderLeft:
                  selected?.conversation_id === c.conversation_id
                    ? `2px solid ${tk.blue}`
                    : "2px solid transparent",
                background:
                  selected?.conversation_id === c.conversation_id
                    ? tk.surfaceHover
                    : "transparent",
                borderBottom: `1px solid ${tk.border}`,
                transition: "background 0.1s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{ fontSize: "13px", fontWeight: 500, color: tk.text }}
                >
                  {c.customer_id}
                </span>
                {c.escalated && <StatusBadge status="escalated" />}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: tk.textMid,
                  fontFamily: "monospace",
                }}
              >
                {c.conversation_id?.slice(0, 18)}…
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {selected ? (
          <div style={{ padding: "24px 32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{ fontSize: "15px", fontWeight: 600, color: tk.white }}
                >
                  {selected.customer_id}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: tk.textMid,
                    marginTop: "2px",
                  }}
                >
                  {selected.conversation_id}
                </div>
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {selected.messages?.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    flexDirection: m.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      background: m.role === "user" ? tk.blueBg : tk.surface,
                      color: m.role === "user" ? tk.blue : tk.textMid,
                      border: `1px solid ${m.role === "user" ? tk.blue + "40" : tk.borderMid}`,
                    }}
                  >
                    {m.role === "user" ? "U" : "AI"}
                  </div>
                  <div
                    style={{
                      maxWidth: "68%",
                      padding: "9px 13px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      lineHeight: "1.55",
                      color: tk.text,
                      background: m.role === "user" ? tk.blueBg : tk.surface,
                      border: `1px solid ${m.role === "user" ? tk.blue + "25" : tk.border}`,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyPane msg="Select a conversation" />
        )}
      </div>
    </div>
  );
}

/* ── KnowledgeView ─────────────────────────────────────────── */
const KB_CATEGORIES = [
  "general",
  "returns",
  "shipping",
  "warranty",
  "payments",
  "escalation",
];
const BLANK_FORM = { title: "", category: "general", content: "" };
const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  background: tk.surface,
  border: `1px solid ${tk.borderMid}`,
  borderRadius: "6px",
  color: tk.text,
  padding: "8px 12px",
  fontSize: "13px",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: "1.5",
};

function KnowledgeView() {
  const [policies, setPolicies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "edit" | "create"
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── Fetch list ──────────────────────────────────────────────
  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/policy`);
      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
      setPolicies(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ── Select + fetch single ───────────────────────────────────
  const selectPolicy = async (p) => {
    setFormError(null);
    setConfirmDelete(false);
    try {
      const res = await fetch(`${API_BASE}/api/policy/${p.slug}`);
      const data = res.ok ? await res.json() : p;
      setSelected(data);
      setForm({
        title: data.title,
        category: data.category || "general",
        content: data.content || "",
      });
    } catch {
      setSelected(p);
      setForm({
        title: p.title,
        category: p.category || "general",
        content: p.content || "",
      });
    }
    setMode("view");
  };

  // ── Create ──────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Content is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      console.log(form);
      const res = await fetch(`${API_BASE}/api/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Failed to create (${res.status})`);
      }
      const created = await res.json();
      await fetchPolicies();
      setSelected(created);
      setMode("view");
    } catch (e) {
      console.log("this is error", e);
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Update ──────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Content is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE}/api/policy/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Failed to update (${res.status})`);
      const updated = await res.json();
      setPolicies((prev) =>
        prev.map((p) => (p.slug === updated.slug ? updated : p)),
      );
      setSelected(updated);
      setMode("view");
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_BASE}/api/policy/${selected.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      await fetchPolicies();
      setSelected(null);
      setMode("view");
      setConfirmDelete(false);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived ─────────────────────────────────────────────────
  const filtered = policies.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );
  const grouped = filtered.reduce((acc, p) => {
    const cat = p.category || "general";
    (acc[cat] = acc[cat] || []).push(p);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* ── Left: policy list ── */}
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          borderRight: `1px solid ${tk.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${tk.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <SectionLabel>Knowledge Base</SectionLabel>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelected(null);
                setForm(BLANK_FORM);
                setFormError(null);
                setConfirmDelete(false);
                setMode("create");
              }}
            >
              <Icon.Plus /> New
            </Button>
          </div>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: tk.textDim,
              }}
            >
              <Icon.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies…"
              style={{
                ...inputStyle,
                paddingLeft: "26px",
                padding: "5px 8px 5px 26px",
              }}
            />
          </div>
        </div>

        {/* List grouped by category */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <div
              style={{ padding: "16px", color: tk.textMid, fontSize: "13px" }}
            >
              Loading…
            </div>
          )}
          {error && (
            <div style={{ padding: "16px", color: tk.red, fontSize: "13px" }}>
              Error: {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <EmptyPane msg="No policies found" />
          )}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div
                style={{
                  padding: "10px 16px 4px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: tk.textDim,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                {cat}
              </div>
              {items.map((p) => {
                const isActive = selected?.slug === p.slug && mode !== "create";
                return (
                  <div
                    key={p.slug}
                    onClick={() => selectPolicy(p)}
                    style={{
                      padding: "9px 16px",
                      cursor: "pointer",
                      borderLeft: isActive
                        ? `2px solid ${tk.blue}`
                        : "2px solid transparent",
                      background: isActive ? tk.surfaceHover : "transparent",
                      borderBottom: `1px solid ${tk.border}`,
                      transition: "background 0.1s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: tk.text,
                        fontWeight: 500,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: tk.textDim,
                        fontFamily: "monospace",
                        marginTop: "2px",
                      }}
                    >
                      {p.slug}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: detail / editor ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Empty state */}
        {mode === "view" && !selected && (
          <EmptyPane msg="Select a policy or create a new one" />
        )}

        {/* ── View mode ── */}
        {mode === "view" && selected && (
          <div style={{ padding: "28px 32px", maxWidth: "680px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: tk.white,
                    marginBottom: "6px",
                  }}
                >
                  {selected.title}
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: tk.textMid,
                      background: tk.surface,
                      border: `1px solid ${tk.border}`,
                      borderRadius: "4px",
                      padding: "2px 8px",
                    }}
                  >
                    {selected.category}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: tk.textDim,
                      fontFamily: "monospace",
                    }}
                  >
                    {selected.slug}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setForm({
                      title: selected.title,
                      category: selected.category || "general",
                      content: selected.content || "",
                    });
                    setFormError(null);
                    setConfirmDelete(false);
                    setMode("edit");
                  }}
                >
                  <Icon.Edit /> Edit
                </Button>
                {!confirmDelete ? (
                  <Button
                    variant="danger"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Icon.Trash /> Delete
                  </Button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: tk.redBg,
                      border: `1px solid ${tk.red}30`,
                      borderRadius: "6px",
                      padding: "4px 10px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: tk.red }}>
                      Sure?
                    </span>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      style={{
                        background: "none",
                        border: "none",
                        color: tk.red,
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        padding: "0 4px",
                      }}
                    >
                      {deleting ? "…" : "Yes"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: tk.textMid,
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        padding: "0 4px",
                      }}
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>

            {formError && (
              <div
                style={{
                  background: tk.redBg,
                  border: `1px solid ${tk.red}30`,
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: tk.red,
                  marginBottom: "16px",
                }}
              >
                {formError}
              </div>
            )}

            <div
              style={{
                background: tk.surface,
                border: `1px solid ${tk.border}`,
                borderRadius: "8px",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: tk.textDim,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Content
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: selected.content ? tk.text : tk.textMid,
                  lineHeight: "1.75",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.content ||
                  "No content yet. Click Edit to add content."}
              </p>
            </div>
          </div>
        )}

        {/* ── Edit / Create mode ── */}
        {(mode === "edit" || mode === "create") && (
          <div style={{ padding: "28px 32px", maxWidth: "680px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: tk.white,
                marginBottom: "24px",
              }}
            >
              {mode === "create"
                ? "New Policy"
                : `Editing — ${selected?.title}`}
            </div>

            {formError && (
              <div
                style={{
                  background: tk.redBg,
                  border: `1px solid ${tk.red}30`,
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: tk.red,
                  marginBottom: "16px",
                }}
              >
                {formError}
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: tk.textDim,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Return Policy"
                style={inputStyle}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: tk.textDim,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {KB_CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: tk.surface }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div style={{ marginBottom: "22px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: tk.textDim,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Write the policy content here…"
                rows={14}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: "1.65",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                variant="primary"
                size="md"
                onClick={mode === "create" ? handleCreate : handleUpdate}
                disabled={saving}
              >
                <Icon.Save />{" "}
                {saving
                  ? "Saving…"
                  : mode === "create"
                    ? "Create Policy"
                    : "Save Changes"}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setMode("view");
                  setFormError(null);
                  if (mode === "create") setSelected(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── TicketsView ───────────────────────────────────────────── */
function extractOrderRef(issue) {
  const m = issue?.match(/\b(ord[_-]?\w+|ORD-\w+|#\d+)\b/i);
  return m ? m[0] : null;
}

function TicketsView({ onSeeConversation }) {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const fetchTickets = async (filter) => {
    setLoading(true);
    setError(null);
    try {
      const q = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`${API_BASE}/admin/tickets${q}`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      console.log(data);
      setTickets(data);
      setSelected((prev) =>
        prev
          ? data.find((t) => t._id === prev._id) || data[0] || null
          : data[0] || null,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(statusFilter);
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setActionError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setSelected(updated);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const FILTERS = ["all", "open", "escalated", "resolved"];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* ── Ticket list panel ── */}
      <div
        style={{
          width: "300px",
          flexShrink: 0,
          borderRight: `1px solid ${tk.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Filter bar */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: `1px solid ${tk.border}`,
            flexShrink: 0,
          }}
        >
          <SectionLabel>Support Tickets</SectionLabel>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {FILTERS.map((f) => {
              const count =
                f === "all"
                  ? tickets.length
                  : tickets.filter((t) => t.status === f).length;
              const active = statusFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "99px",
                    border: `1px solid ${active ? tk.blue + "60" : tk.border}`,
                    background: active ? tk.blue + "18" : "transparent",
                    color: active ? tk.blue : tk.textMid,
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== "all" && count > 0 && (
                    <span
                      style={{
                        background: active ? tk.blue + "30" : tk.surface,
                        color: active ? tk.blue : tk.textDim,
                        borderRadius: "99px",
                        padding: "0 5px",
                        fontSize: "10px",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticket rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && (
            <div
              style={{ padding: "16px", color: tk.textMid, fontSize: "13px" }}
            >
              Loading…
            </div>
          )}
          {error && (
            <div style={{ padding: "16px", color: tk.red, fontSize: "13px" }}>
              Error: {error}
            </div>
          )}
          {!loading && !error && tickets.length === 0 && (
            <EmptyPane msg="No tickets" />
          )}
          {tickets.map((t) => {
            const isActive = selected?._id === t._id;
            const meta = STATUS_META[t.status] || {};
            return (
              <div
                key={t._id}
                onClick={() => {
                  setSelected(t);
                  setShowReply(false);
                  setReplyText("");
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderLeft: isActive
                    ? `2px solid ${tk.blue}`
                    : "2px solid transparent",
                  background: isActive ? tk.surfaceHover : "transparent",
                  borderBottom: `1px solid ${tk.border}`,
                  transition: "background 0.1s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: tk.white,
                      fontFamily: "monospace",
                    }}
                  >
                    #{t._id.slice(-6)}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: meta.color,
                    }}
                  >
                    {t.status?.toUpperCase()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: tk.textMid,
                    marginBottom: "3px",
                  }}
                >
                  {t.customer_id}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: tk.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.issue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Ticket detail panel ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {selected ? (
          <div style={{ padding: "28px 32px", maxWidth: "680px" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div>
                <div
                  style={{ fontSize: "18px", fontWeight: 700, color: tk.white }}
                >
                  Ticket{" "}
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: tk.textMid,
                      fontSize: "16px",
                    }}
                  >
                    #{selected._id.slice(-6)}
                  </span>
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: tk.border,
                borderRadius: "8px",
                overflow: "hidden",
                border: `1px solid ${tk.border}`,
                marginBottom: "16px",
              }}
            >
              {[
                { label: "Customer", value: selected.customer_id },
                {
                  label: "Order",
                  value: extractOrderRef(selected.issue) || "—",
                },
                { label: "Issue", value: selected.issue, span: true },
              ].map(({ label, value, span }) => (
                <div
                  key={label}
                  style={{
                    background: tk.surface,
                    padding: "12px 16px",
                    gridColumn: span ? "1/-1" : undefined,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: tk.textDim,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: "13px", color: tk.text }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary card */}
            <div
              style={{
                background: tk.surface,
                border: `1px solid ${tk.blue}22`,
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                <Icon.Spark />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: tk.blue,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  AI Summary
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: tk.text,
                  lineHeight: "1.65",
                }}
              >
                {selected.aiSummary || "No summary available."}
              </p>
            </div>

            {/* Action error */}
            {actionError && (
              <div
                style={{
                  background: tk.redBg,
                  border: `1px solid ${tk.red}30`,
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  color: tk.red,
                  marginBottom: "16px",
                }}
              >
                {actionError}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {selected.conversation_id && (
                <Button
                  variant="primary"
                  onClick={() => onSeeConversation(selected.conversation_id)}
                >
                  See full convo
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  setShowReply((v) => !v);
                  setReplyText("");
                }}
              >
                <Icon.Reply /> Reply
              </Button>
              <Button
                variant="success"
                onClick={() => updateStatus(selected._id, "resolved")}
                disabled={selected.status === "resolved"}
              >
                <Icon.Resolve /> Resolve
              </Button>
              <Button
                variant="warning"
                onClick={() => updateStatus(selected._id, "escalated")}
                disabled={selected.status === "escalated"}
              >
                <Icon.Escalate /> Escalate
              </Button>
            </div>

            {/* Reply composer */}
            {showReply && (
              <div
                style={{
                  border: `1px solid ${tk.borderMid}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "8px 14px",
                    background: tk.surface,
                    borderBottom: `1px solid ${tk.border}`,
                    fontSize: "11px",
                    color: tk.textMid,
                  }}
                >
                  Reply to customer
                </div>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply…"
                  rows={4}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    background: tk.bg,
                    color: tk.text,
                    border: "none",
                    padding: "12px 16px",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <div
                  style={{
                    padding: "10px 14px",
                    background: tk.surface,
                    borderTop: `1px solid ${tk.border}`,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowReply(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => {}}>
                    <Icon.Send /> Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyPane msg="Select a ticket to view details" />
        )}
      </div>
    </div>
  );
}

/* ── Root ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  "Dashboard",
  "Orders",
  "Customers",
  "Conversations",
  "Tickets",
  "Knowledge",
];

export default function AdminApp() {
  const [active, setActive] = useState("Tickets");
  const [conversationToOpen, setConversationToOpen] = useState(null);

  const openConversation = (conversationId) => {
    setConversationToOpen(conversationId);
    setActive("Conversations");
  };

  const views = {
    Dashboard: <DashboardView />,
    Orders: <OrdersView />,
    Customers: <CustomersView />,
    Conversations: (
      <ConversationsView initialConversationId={conversationToOpen} />
    ),
    Tickets: <TicketsView onSeeConversation={openConversation} />,
    Knowledge: <KnowledgeView />,
  };

  return (
    <div
      style={{
        height: "100vh",
        background: tk.bg,
        color: tk.text,
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: "48px",
          flexShrink: 0,
          padding: "0 20px",
          borderBottom: `1px solid ${tk.border}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            background: tk.blue,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5z" />
          </svg>
        </div>
        <span style={{ fontSize: "14px", fontWeight: 600, color: tk.white }}>
          OrderPilot
        </span>
        <span style={{ fontSize: "12px", color: tk.textDim }}>Admin</span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar nav */}
        <div
          style={{
            width: "200px",
            flexShrink: 0,
            borderRight: `1px solid ${tk.border}`,
            padding: "10px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const NavIcon = NAV_ICONS[item];
            const isActive = active === item;
            return (
              <div
                key={item}
                onClick={() => setActive(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "7px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: isActive ? tk.surfaceHover : "transparent",
                  color: isActive ? tk.white : tk.textMid,
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  transition: "background 0.1s, color 0.1s",
                }}
              >
                <NavIcon />
                {item}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: "hidden" }}>{views[active]}</div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 4px; }
        button:hover:not(:disabled) { opacity: 0.85; }
      `}</style>
    </div>
  );
}
