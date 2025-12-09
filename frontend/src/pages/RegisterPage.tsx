import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css"; // reuse styles
import { apiUrl } from "../utils/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    fetch(apiUrl("/users"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentials: {
          username,
          email,
          password,
        },
        profile:
          firstName || lastName
            ? { first_name: firstName, last_name: lastName }
            : undefined,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const message = body?.detail || "Account creation failed";
          throw new Error(message);
        }
        return res.json();
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="login">
      <header className="login__header">
        <h1>Create account</h1>
        <p>Sign up to start tracking expenses.</p>
      </header>
      <form className="login__form" onSubmit={handleSubmit}>
        <label className="login__field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </label>
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
        <label className="login__field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="login__name-row">
          <label className="login__field">
            <span>First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ada"
            />
          </label>
          <label className="login__field">
            <span>Last name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Lovelace"
            />
          </label>
        </div>

        <button type="submit" className="login__button" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
        </button>
        {error && <p className="login__error">{error}</p>}
        <p className="login__hint">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
