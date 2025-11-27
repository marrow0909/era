// app/shadow/council/page.tsx
import React from "react";

const mockMembers = [
  {
    id: "mock-1",
    codeName: "S.H.C.W – 01",
    internalLevel: 7,
    status: "ACTIVE",
    lastAccess: "2025-11-24 18:01",
  },
  {
    id: "mock-2",
    codeName: "Ω-03",
    internalLevel: 4,
    status: "ACTIVE",
    lastAccess: "2025-11-23 22:11",
  },
  {
    id: "mock-3",
    codeName: "Σ-12",
    internalLevel: 2,
    status: "SILENT",
    lastAccess: "2025-11-10 01:45",
  },
];

export default function CouncilConsolePage() {
  const activeCount = mockMembers.filter((m) => m.status === "ACTIVE").length;
  const inactiveCount = mockMembers.length - activeCount;

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl space-y-10 border border-slate-800/80 rounded-3xl p-8 md:p-10 bg-gradient-to-b from-slate-950 to-black/90 shadow-2xl">
        {/* HEADER */}
        <header className="space-y-3 border-b border-slate-800/60 pb-6">
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
            COUNCIL CONSOLE // INTERNAL ONLY
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.2em]">
            MEMBER OVERVIEW
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            This console is restricted to upper-layer personnel. Use it to
            observe operational activity and internal depth.
          </p>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
          <div className="border border-slate-800/80 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-[11px] text-slate-500 mb-1 tracking-[0.18em] uppercase">
              Total members
            </p>
            <p className="text-2xl font-mono">{mockMembers.length}</p>
          </div>
          <div className="border border-slate-800/80 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-[11px] text-slate-500 mb-1 tracking-[0.18em] uppercase">
              Active
            </p>
            <p className="text-2xl font-mono">{activeCount}</p>
          </div>
          <div className="border border-slate-800/80 rounded-2xl p-4 bg-slate-950/40">
            <p className="text-[11px] text-slate-500 mb-1 tracking-[0.18em] uppercase">
              Silent / Exiled
            </p>
            <p className="text-2xl font-mono text-slate-300">{inactiveCount}</p>
          </div>
        </section>

        {/* TABLE */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.25em] text-slate-500 uppercase">
            MEMBER LIST // CODE-BASED
          </p>
          <div className="overflow-hidden border border-slate-800/80 rounded-2xl bg-slate-950/40">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-black/60 border-b border-slate-800/80">
                <tr className="text-slate-400">
                  <th className="text-left px-4 py-2 font-normal">CODE NAME</th>
                  <th className="text-left px-4 py-2 font-normal">
                    INTERNAL LV
                  </th>
                  <th className="text-left px-4 py-2 font-normal">STATUS</th>
                  <th className="text-left px-4 py-2 font-normal">
                    LAST ACCESS
                  </th>
                  <th className="text-right px-4 py-2 font-normal">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {mockMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t border-slate-900/70 hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="px-4 py-2 font-mono">{m.codeName}</td>
                    <td className="px-4 py-2 font-mono">{m.internalLevel}</td>
                    <td className="px-4 py-2">
                      <span
                        className={
                          m.status === "ACTIVE"
                            ? "text-emerald-400 text-[11px] tracking-[0.18em] uppercase"
                            : "text-slate-500 text-[11px] tracking-[0.18em] uppercase"
                        }
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-[11px] text-slate-400">
                      {m.lastAccess}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <a
                        href={`/shadow/council/members/${m.id}`}
                        className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-[10px] tracking-[0.18em] uppercase hover:bg-slate-100 hover:text-black transition-colors"
                      >
                        View record
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">
            Real names or external identifiers are never displayed. Only coded
            identity and internal metrics are visible.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="pt-4 border-t border-slate-900/60 text-[10px] md:text-[11px] text-slate-600 flex items-center justify-between gap-4 flex-wrap">
          <span>ERA Project / Shadow Authority — Council Layer</span>
          <span>Handle with silence.</span>
        </footer>
      </div>
    </main>
  );
}

