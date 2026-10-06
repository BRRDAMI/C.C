import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Lock, User, Mail, ShieldCheck } from "lucide-react";

// Cosmetic-only auth modal (mirrors adurite's look). No data leaves the browser —
// the entered username is stored locally to update the navbar. Passwords are never
// read, stored or transmitted.
const LoginModal = ({ open, onClose, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [robot, setRobot] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErr("Please fill in all fields.");
      return;
    }
    if (!robot) {
      setErr("Please verify that you are not a robot.");
      return;
    }
    onLogin(username.trim());
    setUsername(""); setEmail(""); setPassword(""); setRobot(""); setErr("");
  };

  const switchMode = (m) => { setMode(m); setErr(""); };

  return createPortal(
    <div
      data-testid="login-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-testid="login-modal"
        className="relative w-full max-w-[400px] rounded-2xl border border-border bg-[#101014] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="login-modal-close"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <img src="/adurite-logo.png" alt="adurite" className="h-7 w-auto" />
        </div>
        <p className="text-sm text-gray-400 mb-6">
          {mode === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}
        </p>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0b0b0e] border border-border mb-6">
          {[
            { id: "login", label: "Login" },
            { id: "register", label: "Register" },
          ].map((t) => (
            <button
              key={t.id}
              data-testid={`login-tab-${t.id}`}
              onClick={() => switchMode(t.id)}
              className={`h-9 rounded-lg text-sm font-semibold transition-colors ${
                mode === t.id ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              data-testid="login-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#0b0b0e] border border-border rounded-lg pl-10 pr-4 h-12 text-sm text-white focus:border-primary outline-none"
            />
          </div>

          {mode === "register" && (
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                data-testid="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-[#0b0b0e] border border-border rounded-lg pl-10 pr-4 h-12 text-sm text-white focus:border-primary outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              data-testid="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0b0b0e] border border-border rounded-lg pl-10 pr-4 h-12 text-sm text-white focus:border-primary outline-none"
            />
          </div>

          {/* reCAPTCHA-style box (visual only) */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-[#0b0b0e] px-4 h-[60px]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                data-testid="login-captcha-checkbox"
                type="checkbox"
                checked={!!robot}
                onChange={(e) => setRobot(e.target.checked)}
                className="w-6 h-6 accent-[#e6333f]"
              />
              <span className="text-sm text-gray-300">I'm not a robot</span>
            </label>
            <div className="flex flex-col items-center text-[9px] text-gray-600 leading-tight">
              <ShieldCheck size={20} className="text-gray-500" />
              reCAPTCHA
            </div>
          </div>

          {err && <div data-testid="login-error" className="text-xs text-primary">{err}</div>}

          <button
            data-testid="login-submit-button"
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg h-12 transition-colors"
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-5">
          {mode === "login" ? (
            <>New to Adurite?{" "}
              <button data-testid="login-switch-register" onClick={() => switchMode("register")} className="text-primary hover:underline">Create an account</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button data-testid="login-switch-login" onClick={() => switchMode("login")} className="text-primary hover:underline">Log in</button>
            </>
          )}
        </p>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
