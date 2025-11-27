// app/shadow/me/page.tsx
import React from "react";

export default function ShadowMePage() {
  // TODO: Replace these mock values with real data
  const mockCodeName = "Ω-03";
  const mockAlias = "SANDES";
  const joinedAt = "2025-11-24";
  const lastAccess = "2025-11-26 19:12 JST";

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl space-y-10 border border-slate-800/80 rounded-3xl p-8 md:p-10 bg-gradient-to-b from-slate-950 to-black/90 shadow-2xl">
        {/* HEADER */}
        <header className="space-y-3 border-b border-slate-800/60 pb-6">
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
            YOUR RECORD // SILENT MONARCH
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.2em]">
            PERSONAL FILE
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            This file is assigned exclusively to you. Do not explain, share, or
            reference its existence outside this layer.
          </p>
        </header>

        {/* ID & STATUS */}
        <section className="border border-slate-800/80 rounded-2xl p-6 md:p-7 bg-slate-950/50 space-y-4">
          <p className="text-xs tracking-[0.25em] text-slate-500 uppercase">
            IDENTITY // FRONT LAYER
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <p className="text-xs text-slate-500 mb-1">CODE NAME</p>
              <p className="font-mono text-lg">{mockCodeName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">ALIAS</p>
              <p className="font-mono text-lg">
                {mockAlias ?? <span className="text-slate-600">UNSET</span>}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">STATUS</p>
              <p className="text-sm">ACTIVE</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">JOINED</p>
              <p className="text-sm">{joinedAt}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">LAST ACCESS</p>
              <p className="text-sm">{lastAccess}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">VISIBILITY</p>
              <p className="text-sm">INTERNAL ONLY</p>
            </div>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 mt-2">
            Only upper-layer personnel can view your internal status. No
            peer-level member has access to this information.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <a
              href="/shadow"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-slate-100 hover:text-black transition-colors"
            >
              Back to gate
            </a>
            <a
              href="/shadow/settings"
              className="inline-flex items-center justify-center rounded-full border border-slate-700/80 px-5 py-2 text-xs md:text-sm tracking-[0.2em] uppercase hover:border-slate-200 hover:text-slate-100 transition-colors"
            >
              Settings
            </a>
          </div>
        </section>

        {/* PACT */}
        <section className="space-y-4 text-xs md:text-sm text-slate-300">
          <p className="tracking-[0.25em] text-slate-500 uppercase">
            PACT // CORE TERMS
          </p>
          <ul className="space-y-2">
            <li>
              <span className="font-mono text-slate-400">PACT 01 — </span>What
              happens inside, stays inside.
            </li>
            <li>
              <span className="font-mono text-slate-400">PACT 02 — </span>No
              name, no face, only code.
            </li>
            <li>
              <span className="font-mono text-slate-400">PACT 03 — </span>
              Silence over pride. Pact over ego.
            </li>
            <li>
              <span className="font-mono text-slate-400">PACT 04 — </span>
              Equality in sight, different paths in depth.
            </li>
            <li>
              <span className="font-mono text-slate-400">PACT 05 — </span>You
              are responsible for the power you are given.
            </li>
          </ul>
        </section>

        {/* GUIDANCE */}
        <section className="space-y-3 text-xs md:text-sm text-slate-300 border border-slate-800/80 rounded-2xl p-6 md:p-7 bg-slate-950/40">
          <p className="tracking-[0.25em] text-slate-500 uppercase">
            GUIDANCE // NEXT STEPS
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Observe your decisions and behavior within ERA&apos;s public
              layer.
            </li>
            <li>
              Do not verbalize or externalize any experience acquired here.
            </li>
            <li>Return only when necessary.</li>
          </ul>
          <p className="text-[11px] text-slate-500">
            You do not need to know your internal level or position. The only
            requirement here is that you maintain and refine your own state.
          </p>
        </section>

        {/* LOGS */}
        <section className="space-y-3 text-xs md:text-sm text-slate-300">
          <p className="tracking-[0.25em] text-slate-500 uppercase">
            PERSONAL LOG // EXCERPT
          </p>
          <ul className="space-y-1 font-mono text-[11px] md:text-xs text-slate-400">
            <li>2025-11-10 — ACCESS RECORDED</li>
            <li>2025-11-18 — PACT ACKNOWLEDGED</li>
            <li>2025-11-24 — RECORD VIEWED</li>
          </ul>
          <p className="text-[11px] text-slate-500">
            These logs serve internal documentation only. No explanation is
            required.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="pt-4 border-t border-slate-900/60 text-[10px] md:text-[11px] text-slate-600 flex items-center justify-between gap-4 flex-wrap">
          <span>ERA Project / Shadow Authority</span>
          <span>Not a rank. Not a title. A state.</span>
        </footer>
      </div>
    </main>
  );
}
