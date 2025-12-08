import { Link, Outlet, useLocation } from "react-router-dom";
import "./AppLayout.css";

const navItems = [
  { label: "Login", to: "/login" },
  { label: "Expenses", to: "/expenses" },
];

function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <strong>Personal System</strong>
        <nav className="app-shell__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={pathname === item.to ? "nav-link nav-link--active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
