export function Sidebar() {
  const navButtonStyle: React.CSSProperties = {
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "8px 4px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#333",
  };

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Navigation</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button style={navButtonStyle}>Home</button>
        <button style={navButtonStyle}>Purchases</button>
        <button style={navButtonStyle}>Inventory</button>
        <button style={navButtonStyle}>Settings</button>
      </nav>
    </div>
  );
}
