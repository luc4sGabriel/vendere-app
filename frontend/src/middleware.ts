import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/checkout', '/pedidos', '/dashboard']
const adminRoutes = ['/dashboard']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAdmin = adminRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdmin && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}