import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const protectedRoutes = {
  young: ["/home", "/profile/young", "/offer", "/credentials", "/ratings", "/notifications"],
  employer: ["/employer/dashboard", "/employer/create-job", "/work"],
  admin: ["/admin/dashboard"],
  all: ["/home", "/profile", "/offer", "/credentials", "/ratings", "/notifications", "/employer", "/work", "/admin"],
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const userCookie = request.cookies.get("mped_user")
  const user = userCookie ? JSON.parse(userCookie.value) : null

  // Check if route is protected
  const isProtected = protectedRoutes.all.some((route) => pathname.startsWith(route))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check role-based access
  if (pathname.startsWith("/employer") && user?.role !== "employer") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
