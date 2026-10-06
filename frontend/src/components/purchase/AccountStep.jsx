import React, { useState } from "react";
import { User } from "lucide-react";

const AccountStep = ({ username, setUsername, onBack, onNext }) => {
  const [err, setErr] = useState("");

  const next = () => {
    const v = username.trim();
    if (v.length < 3) { setErr("Please enter a valid Roblox username."); return; }
    setErr("");
    onNext();
  };

  return (
    <div data-testid="account-step" className="w-full max-w-[560px] mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary mb-5">
        <User size={30} />
      </div>
      <h2 className="font-display font-semibold text-[26px] text-white text-center">Roblox Account</h2>
      <p className="text-gray-400 text-[15px] mt-2 text-center">
        Enter the Roblox username that will receive this item. Make sure it's spelled exactly right.
      </p>

      <div className="w-full mt-8">
        <label className="block text-sm text-gray-300 mb-2">Roblox Username</label>
        <input
          data-testid="roblox-username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && next()}
          placeholder="e.g. builderman"
          className="w-full bg-[#141418] border border-border rounded-xl px-5 h-[56px] text-base text-white placeholder:text-gray-500 focus:border-primary outline-none"
        />
        {err && <div data-testid="account-step-error" className="text-xs text-primary mt-2">{err}</div>}
      </div>

      <div className="w-full grid grid-cols-2 gap-3 mt-6">
        <button data-testid="account-back-button" onClick={onBack} className="h-[54px] rounded-xl border border-border bg-[#141418] hover:border-primary/50 text-white font-semibold transition-colors">Back</button>
        <button data-testid="account-continue-button" onClick={next} className="h-[54px] rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-colors">Continue</button>
      </div>
    </div>
  );
};

export default AccountStep;
