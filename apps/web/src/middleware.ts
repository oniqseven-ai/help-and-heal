import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/providers/:path*',
    '/wallet/:path*',
    '/sessions/:path*',
    '/session/:path*',
    '/self-help/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/provider/:path*',
    '/provider-apply',
  ],
};
