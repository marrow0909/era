// app/shadow/council/members/[memberId]/page.tsx
import React from "react";

type Props = {
  params: { memberId: string };
};

export default function CouncilMemberPage({ params }: Props) {
  const { memberId } = params;

  const mock = {
    codeName: "Ω-03",
    internalLevel: 4,
    rankTitle: "SILENT AGENT",
    position: "FIELD / CONTACT",
    status: "ACTIVE",
    joinedAt: "2025-10-01",
    lastAccess: "2025-11-24 17:52",
    notes:
      "Used as a first contact and observation point for potential candidates. Maintains silence consistently.",
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-6 py-16">
      {/* ...中略... */}
      <p className="text-[11px] text-slate-500">
        Internal ID: <span className="font-mono">{memberId}</span>
      </p>
      {/* ...中略... */}
    </main>
  );
}
