import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protect routes under /new-product
  if (request.nextUrl.pathname.startsWith("/new-product")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if ((await isAdminAuthenticated(request)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  return NextResponse.next();
}

async function isAdminAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader === null) {
    return false;
  }

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return true;
  }

  return false;
}

export const config = {
  matcher: ["/admin/:path*", "/new-product/:path*"]
};
