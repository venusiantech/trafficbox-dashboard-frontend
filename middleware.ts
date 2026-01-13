import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {locales} from '@/config';

export default async function middleware(request: NextRequest) {
  // Step 1: Check authentication for protected routes
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  
  // Get the locale from the pathname (more reliable for external redirects like Stripe)
  // Path format: /{locale}/... or just /
  const pathSegments = path.split('/').filter(Boolean);
  const defaultLocale = pathSegments[0] && locales.includes(pathSegments[0] as any) 
    ? pathSegments[0] 
    : request.headers.get('dashcode-locale') || 'en';
  
  // Handle root path redirect based on authentication
  if (path === '/') {
    const url = request.nextUrl.clone();
    
    if (token) {
      // If authenticated, redirect to dashboard
      url.pathname = `/${defaultLocale}/dashboard/analytics`;
      return NextResponse.redirect(url);
    } else {
      // If not authenticated, redirect to login
      url.pathname = `/${defaultLocale}/auth/login`;
      return NextResponse.redirect(url);
    }
  }
  
  // Check if accessing protected routes without authentication
  if (path.includes('/(protected)') || path.includes('/dashboard')) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLocale}/auth/login`;
      return NextResponse.redirect(url);
    }
    
    // Verify token validity (could be expanded to check expiration)
    try {
      // Simple check if token is valid JWT format
      const [header, payload, signature] = token.split('.');
      if (!header || !payload || !signature) {
        throw new Error('Invalid token format');
      }
      
      // Check if token is expired
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
    } catch (error) {
      // Token is invalid or expired, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLocale}/auth/login`;
      return NextResponse.redirect(url);
    }
  }
  
  // Check if accessing auth routes while authenticated
  if (path.includes('/auth') && token) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}/dashboard/analytics`;
    return NextResponse.redirect(url);
  }
 
  // Handle i18n routing
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  });
  const response = handleI18nRouting(request);
 
  // Set locale in response headers
  response.headers.set('dashcode-locale', defaultLocale);
 
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};