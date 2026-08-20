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

  const handleSubmit = async (e: FormEvent) => {
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

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus("success");
      setMessage("You're on the list! We'll be in touch soon.");
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in" role="status">
        <svg className="w-12 h-12 text-[#1a3c34] mb-4" viewBox="0 0 52 52" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="26" cy="26" r="24" stroke="currentColor" />
          <path d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-display text-2xl font-semibold text-[#1a3c34] mb-2">
          Welcome to The Melwick
        </p>
        <p className="text-sm text-[#4a5c54] leading-relaxed">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form className="relative flex flex-col sm:flex-row w-full max-w-lg mx-auto gap-4" onSubmit={handleSubmit} noValidate id="signup-form">
      <input
        ref={inputRef}
        type="email"
        className={`flex-1 px-5 py-4 bg-[#fdfbf7] border border-[#1a3c34]/20 text-[#1a3c34] placeholder-[#8a948f] text-sm font-medium outline-none focus:border-[#1a3c34] transition-colors rounded ${status === "error" ? "border-red-500" : ""}`}
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
        className="bg-[#1a3c34] text-[#fdfbf7] px-8 py-4 text-xs font-semibold tracking-widest uppercase rounded hover:bg-[#2c544a] transition-colors disabled:opacity-50 whitespace-nowrap"
        disabled={status === "loading"}
        id="signup-submit-button"
      >
        {status === "loading" ? "Joining..." : "Notify Me"}
      </button>
      {message && (
        <p
          id="form-message"
          className={`absolute -bottom-8 left-0 right-0 text-xs font-medium text-center ${status === "error" ? "text-red-500" : "text-[#4a5c54]"}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
