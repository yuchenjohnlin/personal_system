import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { apiUrl } from "../utils/api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password,
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const message = body?.detail || body?.message || `Login failed (${res.status})`;
        console.error("Login failed response:", res.status, body);
        throw new Error(message);
      }

      if (!body) {
        throw new Error("Missing response payload");
      }

      if (rememberMe) {
        localStorage.setItem("user_id", String(body.user_id));
      } else {
        sessionStorage.setItem("user_id", String(body.user_id));
      }
      navigate("/expenses");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <header className="login__header">
        <h1>Welcome back</h1>
        <p>Sign in to manage expenses.</p>
      </header>
      <form className="login__form" onSubmit={handleSubmit}>
        <label className="login__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="login__field login__checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>
        <label className="login__field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="login__button">
          {isLoading ? "Signing in..." : "Continue"}
        </button>
        {error && (
          <p className="login__error">
            {error}{" "}
            <Link to="/register" className="login__error-link">
              Create an account
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
