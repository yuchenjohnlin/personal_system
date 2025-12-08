import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>The route you tried to access does not exist.</p>
      <Link to="/expenses">Go to expenses</Link>
    </div>
  );
}

export default NotFoundPage;
