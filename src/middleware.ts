import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Публичные маршруты
const isPublicRoute = createRouteMatcher([
  '/',
  '/en(.*)',
  '/ru(.*)',
  '/bg(.*)',
  '/auth(.*)',
  '/api(.*)',
  '/blog(.*)'
]);

// Админ маршруты
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Защита админ маршрутов - только для админов
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Проверка роли администратора
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    if (role !== 'admin') {
      return new NextResponse('Access denied. Admin role required.', { status: 403 });
    }
  }
  
  // Защита всех приватных маршрутов
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
