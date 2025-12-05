import { Sidebar } from "../components/Sidebar";
import { PageContainer } from "./PageContainer";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}
