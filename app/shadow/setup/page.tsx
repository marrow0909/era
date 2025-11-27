// app/shadow/setup/page.tsx
"use client";
import React from "react";

export default function ShadowSetupPage() {
  // 今はまだダミー。後で form の submit を API につなぐ。
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("今はダミーです。あとでAPIにつなげよう。");
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-8 border border-slate-800/80 rounded-3xl p-8 md:p-10 bg-gradient-to-b from-slate-950 to-black/90 shadow-2xl">
        {/* HEADER */}
        <header className="space-y-3 border-b border-slate-800/60 pb-6">
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
            INITIAL SETUP // SILENT ID
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.2em]">
            NAME & KEY
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            この領域で使う「呼び名」と、「ここに再び入るための鍵」を決めてください。
            ERAの通常アカウントとは切り離された、もう一つの身分です。
          </p>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ALIAS */}
          <div className="space-y-2">
            <label className="block text-xs tracking-[0.25em] text-slate-400 uppercase">
              Preferred name / Alias
            </label>
            <input
              type="text"
              name="alias"
              placeholder="例: SANDES, NEPHRITE, MONARCH_09"
              className="w-full rounded-xl bg-black border border-slate-700/80 px-4 py-2.5 text-sm md:text-base outline-none focus:border-slate-100 transition-colors"
              required
            />
            <p className="text-[11px] text-slate-500">
              ※ 本名である必要はありません。ここで使いたい名前を自由に決めてください。
              後から変更することもできます。
            </p>
          </div>

          {/* SHADOW PASSWORD */}
          <div className="space-y-2">
            <label className="block text-xs tracking-[0.25em] text-slate-400 uppercase">
              Shadow password
            </label>
            <input
              type="password"
              name="password"
              placeholder="この領域専用のパスワード"
              className="w-full rounded-xl bg-black border border-slate-700/80 px-4 py-2.5 text-sm md:text-base outline-none focus:border-slate-100 transition-colors"
              required
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="確認のため、もう一度入力"
              className="w-full rounded-xl bg-black border border-slate-700/80 px-4 py-2.5 text-sm md:text-base outline-none focus:border-slate-100 transition-colors mt-2"
              required
            />
            <p className="text-[11px] text-slate-500">
              ※ ERAアカウントのパスワードとは別物です。
              この領域に再入場するための「鍵」として扱われます。
            </p>
          </div>

          {/* SUBMIT */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-slate-100 px-6 py-2.5 text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-slate-100 hover:text-black transition-colors"
            >
              Complete setup
            </button>
            <p className="text-[11px] text-slate-500">
              ※ 入力内容は送信後に暗号化されて保存されます。
              あなた以外の構成員が、この情報を直接見ることはできません。
            </p>
          </div>
        </form>

        {/* FOOTER */}
        <footer className="pt-4 border-t border-slate-900/60 text-[10px] md:text-[11px] text-slate-600 flex items-center justify-between gap-4 flex-wrap">
          <span>ERA Project / Shadow Authority</span>
          <span>Not a login. A rite.</span>
        </footer>
      </div>
    </main>
  );
}
