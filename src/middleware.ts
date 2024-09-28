import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const publicRoutes = ['/', '/login', '/signup']

    const isAuthenticated = !!token

    if (isAuthenticated && matchAnyRoute(req, publicRoutes)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (!isAuthenticated && !matchAnyRoute(req, publicRoutes)) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

function matchAnyRoute(request: NextRequest, routes: string[]) {
    return routes.includes(request.nextUrl.pathname)
}
