import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export async function middleware(request) {
    const projectId = process.env.PROJECT_ID;

    if (!projectId) {
        console.warn('Environment variable PROJECT_ID is not set.');
        return NextResponse.next();
    }

    const path = request.nextUrl.pathname;

    try {
        const inMaintenance = await get(projectId);

        console.log('Maintenance mode:', inMaintenance);

        if (inMaintenance && path !== '/maintenance') {
            // Redirect all requests to the maintenance page if in maintenance mode
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }

        if (!inMaintenance && path === '/maintenance') {
            // Redirect back to the homepage if not in maintenance mode
            return NextResponse.redirect(new URL('/', request.url));
        }
    } catch (error) {
        console.error('Edge Config Error:', error);
    }

    // Proceed with normal request handling
    return NextResponse.next();
}

// Apply middleware to all routes except API and static files
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};