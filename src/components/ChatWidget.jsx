import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CUSTOMER = { id: "cust_02", name: "Sara Khan" };

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your support assistant. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          customer_id: CUSTOMER.id,
          message: {
            role: "user",
            content: userMessage.content,
            timestamp: userMessage.timestamp.toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant", content: `Error: ${data.message}`, timestamp: new Date(), error: true,
        }]);
        return;
      }

      if (!conversationId) setConversationId(data.conversation_id);
      if (data.escalated) setEscalated(true);

      setMessages((prev) => [...prev, {
        role: "assistant", content: data.reply, timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant", content: "Connection failed. Please try again.", timestamp: new Date(), error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "32px 24px", minHeight: "calc(100vh - 52px)",
    }}>
      <div style={{
        width: "100%", maxWidth: "680px",
        background: "#1E293B", borderRadius: "12px",
        border: escalated ? "1px solid #EF4444" : "1px solid #334155",
        overflow: "hidden", display: "flex", flexDirection: "column",
        height: "calc(100vh - 116px)", transition: "border-color 0.3s",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #334155",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: escalated ? "#2D1515" : "#1E293B",
          transition: "background 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#3B82F6", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "13px", fontWeight: 600,
            }}>AI</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>Support Agent</div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                {conversationId ? `conv: ${conversationId.slice(0, 8)}…` : "New conversation"}
              </div>
            </div>
          </div>
          {escalated && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "#EF444420", border: "1px solid #EF4444",
              padding: "4px 10px", borderRadius: "20px",
              fontSize: "12px", fontWeight: 600, color: "#EF4444",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              Escalated to human
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                maxWidth: "75%", padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#3B82F6" : msg.error ? "#2D1515" : "#0F172A",
                border: msg.error ? "1px solid #EF444440" : "none",
                fontSize: "14px", lineHeight: "1.5", color: "#F8FAFC",
              }}>
                {msg.content}
                <div style={{ fontSize: "10px", color: "#64748B", marginTop: "4px", textAlign: "right" }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                padding: "10px 14px", borderRadius: "16px 16px 16px 4px",
                background: "#0F172A", display: "flex", gap: "4px", alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: "#3B82F6",
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155", display: "flex", gap: "8px" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={escalated ? "Conversation escalated — a human agent will follow up" : "Type a message…"}
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "#0F172A", border: "1px solid #334155",
              borderRadius: "8px", padding: "10px 14px", color: "#F8FAFC",
              fontSize: "14px", resize: "none", outline: "none",
              fontFamily: "inherit", lineHeight: "1.5",
            }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
            width: "40px", height: "40px", borderRadius: "8px", border: "none",
            background: loading || !input.trim() ? "#334155" : "#3B82F6",
            color: "#F8FAFC", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", transition: "background 0.15s", flexShrink: 0,
          }}>↑</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        textarea::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
}
