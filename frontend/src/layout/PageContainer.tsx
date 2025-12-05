export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      {children}
    </div>
  );
}
