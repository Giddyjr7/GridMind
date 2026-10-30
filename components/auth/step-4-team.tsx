"use client";

import * as React from "react";
import { Plus, Trash2, ArrowRight, Info, Users } from "lucide-react";
import { AuthCard, AuthCardBody, AuthCardFooter } from "@/components/auth/auth-card";
import { PremiumInput } from "@/components/auth/premium-input";

export interface TeamMemberInvite {
  email: string;
  role: "member" | "admin";
}

interface Step4TeamProps {
  initialMembers?: TeamMemberInvite[];
  onFinish: (members: TeamMemberInvite[]) => void;
  onSkip: () => void;
}

export function Step4Team({
  initialMembers = [],
  onFinish,
  onSkip,
}: Step4TeamProps) {
  const [members, setMembers] = React.useState<TeamMemberInvite[]>(() => {
    return initialMembers.length > 0
      ? initialMembers
      : [{ email: "", role: "member" }];
  });

  const [error, setError] = React.useState<string | null>(null);

  const handleAddRow = () => {
    if (members.length >= 5) return;
    setMembers((prev) => [...prev, { email: "", role: "member" }]);
  };

  const handleRemoveRow = (index: number) => {
    if (members.length === 1) {
      setMembers([{ email: "", role: "member" }]);
      return;
    }
    setMembers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleEmailChange = (index: number, email: string) => {
    setMembers((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, email } : m))
    );
    setError(null);
  };

  const handleRoleChange = (index: number, role: "member" | "admin") => {
    setMembers((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, role } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter filled emails
    const validMembers = members
      .map((m) => ({ ...m, email: m.email.trim() }))
      .filter((m) => m.email.length > 0);

    // Validate email formats if entered
    for (const m of validMembers) {
      if (!m.email.includes("@") || !m.email.includes(".")) {
        setError(`"${m.email}" is not a valid email address.`);
        return;
      }
    }

    onFinish(validMembers);
  };

  return (
    <AuthCard>
      <AuthCardBody>
        {/* Honest helper notice */}
        <div className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Invitations are saved to your workspace. Email delivery is not enabled in this demo.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="text-[12px] font-medium text-rose-400 animate-in fade-in"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="teammate@company.com"
                    value={member.email}
                    onChange={(e) => handleEmailChange(idx, e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#080f0b] px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 hover:border-white/20 transition-all"
                  />
                </div>

                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(idx, e.target.value as "member" | "admin")
                  }
                  className="h-11 rounded-xl border border-white/[0.08] bg-[#080f0b] px-3 text-xs text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                >
                  <option value="member" className="bg-[#0c1410]">
                    Member
                  </option>
                  <option value="admin" className="bg-[#0c1410]">
                    Admin
                  </option>
                </select>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    aria-label="Remove teammate row"
                    className="h-11 w-11 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add more button */}
          {members.length < 5 && (
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another teammate</span>
            </button>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_25px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070c0a]"
            >
              <span>Complete workspace setup</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </AuthCardBody>

      <AuthCardFooter>
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </AuthCardFooter>
    </AuthCard>
  );
}
