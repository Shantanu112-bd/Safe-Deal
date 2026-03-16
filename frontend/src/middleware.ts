import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all routes under /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Check for safedeal_pubkey cookie
    const hasPublicKey = request.cookies.has('safedeal_pubkey');

    if (!hasPublicKey) {
      // Redirect to home if not connected
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*'],
};
