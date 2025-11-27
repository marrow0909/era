// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /shadow 系だけチェック
  if (pathname.startsWith("/shadow")) {
    const shadowMember = request.cookies.get("shadow_member")?.value;

    // Cookie がない or 想定外 → トップへ飛ばす
    if (shadowMember !== "1") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 対象パスを限定
export const config = {
  matcher: ["/shadow/:path*"],
};
