import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { allowedEmails } from '@/app/components/allowedEmails';

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const protectedPaths = ['/count', '/faculty', '/round'];

    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtectedPath) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!allowedEmails.includes(token.email)) {
            return NextResponse.redirect(new URL('/login?error=AccessDenied', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/count', '/faculty', '/round', '/report'],
};