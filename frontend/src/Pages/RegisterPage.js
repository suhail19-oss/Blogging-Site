import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function register(ev) {
    ev.preventDefault();

    if (username.trim().length < 4) {
      return setError("Username must be at least 4 characters long.");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(""); 
        setSuccess("User registered successfully!"); 
        console.log("User registered:", data);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>

      {success && <p style={{ color: "green" }}>{success}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Username (lowercase letters and numbers only)"
        value={username}
        onChange={(ev) => setUsername(ev.target.value.toLowerCase())}
        pattern="[a-z0-9]*"
        title="Username must be lowercase letters and numbers only."
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
