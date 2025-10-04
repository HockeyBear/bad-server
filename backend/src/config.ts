import { CookieOptions, Request as ExpressRequest } from 'express'
import ms from 'ms'
import { DoubleCsrfConfigOptions } from 'csrf-csrf'
import rateLimit from 'express-rate-limit'

export interface AuthRequest extends ExpressRequest {
    user?: {
        _id?: string
    }
}

export const { PORT = '3000' } = process.env
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env
export const { JWT_SECRET = 'JWT_SECRET' } = process.env
export const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
}
export const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
            path: '/',
        } as CookieOptions,
    },
}

export const FILE_SIZE = {
    maxSize: Number(process.env.MAXFILE_SIZE) || 10e6,
    minSize: Number(process.env.MINFILE_SIZE) || 2e3
}

export const doubleCsrfUtilities: DoubleCsrfConfigOptions = {
    getSecret: () => process.env.CSRF_SECRET || '___Secret___',
    getSessionIdentifier: (req: AuthRequest) => {
        return req.user?._id?.toString() || req.ip || 'anonymous'
    },
    cookieName: process.env.CSRF_COOKIE_NAME || '__Host-larek.x-csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        secure: process.env.CSRF_COOKIE_IS_SECURE ? process.env.CSRF_COOKIE_IS_SECURE.toUpperCase() === 'TRUE'
            : true,
    }
}

export const allowedOrigins =
    process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : process.env.ORIGIN_ALLOW || 'http://localhost'

export const limitSettings = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Защита от спама. Попробуйте позже.',
    standardHeaders: true,
    legacyHeaders: false
})