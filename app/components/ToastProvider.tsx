"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1a1a1a",
          color: "#f8f6f2",
          fontSize: "14px",
          borderRadius: "0",
          letterSpacing: "0.05em",
        },
      }}
    />
  );
}
