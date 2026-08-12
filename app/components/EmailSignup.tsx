"use client";

import { useState, useRef, type FormEvent } from "react";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      inputRef.current?.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    setMessage("");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setMessage("You're on the list! We'll be in touch soon.");
    }, 1500);
  };

  if (status === "success") {
    return (
      <div className="signup-success" role="status">
        <svg className="success-check-icon" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}>
          Welcome to The Melwick
        </p>
        <p style={{
          fontSize: "0.9rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate id="signup-form">
      <input
        ref={inputRef}
        type="email"
        className={`signup-input ${status === "error" ? "error" : ""}`}
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") {
            setStatus("idle");
            setMessage("");
          }
        }}
        aria-label="Email address"
        aria-describedby="form-message"
        id="email-input"
        required
        autoComplete="email"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        className="signup-button"
        disabled={status === "loading"}
        id="signup-submit-button"
      >
        {status === "loading" ? "Joining..." : "Notify Me"}
      </button>
      {message && (
        <p
          id="form-message"
          className={`form-message ${status === "error" ? "error-msg" : "success-msg"}`}
          role={status === "error" ? "alert" : "status"}
          style={{ position: "absolute", bottom: "-2rem", left: 0, right: 0 }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
