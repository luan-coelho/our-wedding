import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { routes } from '@/lib/routes'

export async function middleware(request: NextRequest) {
  const cookies = getSessionCookie(request)
  if (!cookies) {
    return NextResponse.redirect(new URL(routes.frontend.auth.signin, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
