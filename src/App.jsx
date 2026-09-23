import { useState } from "react";
import ChatWidget from "./components/ChatWidget";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [view, setView] = useState("chat"); // "chat" | "admin"

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0F172A", minHeight: "100vh", color: "#F8FAFC" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "52px", background: "#0F172A",
        borderBottom: "1px solid #1E293B",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", background: "#3B82F6",
            borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: 700,
          }}>S</div>
          <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "-0.3px" }}>SupportPilot</span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["chat", "admin"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "5px 14px", borderRadius: "5px", border: "none",
              fontSize: "13px", fontWeight: 500, cursor: "pointer",
              background: view === v ? "#1E293B" : "transparent",
              color: view === v ? "#F8FAFC" : "#64748B",
              transition: "all 0.15s",
            }}>
              {v === "chat" ? "Customer Chat" : "Admin Dashboard"}
            </button>
          ))}
        </div>
      </nav>
      <div style={{ display: view === "chat" ? "block" : "none" }}><ChatWidget /></div>
      <div style={{ display: view === "admin" ? "block" : "none" }}><AdminDashboard /></div>
    </div>
  );
}
