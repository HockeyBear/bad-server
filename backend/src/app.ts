import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, NextFunction, urlencoded, Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { allowedOrigins, DB_ADDRESS, limitSettings } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import winston, { level } from 'winston'
import mongoSanitize from 'express-mongo-sanitize'
import { sanitizeBody } from './middlewares/sanitizeBody'

const { PORT = 3000 } = process.env
const app = express()
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(limitSettings)

const logger =  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
})

app.use(cors(corsOptions))
app.use(serveStatic(path.join(__dirname, 'public')))

app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`)
    next()
})
app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    logger.error(`${err.message}`)
    next(err)
})

app.use(urlencoded({ extended: true, limit: '10kb' }))
app.use(json({ limit: '10kb' }))

app.use(sanitizeBody)
app.use(cookieParser())
app.use(mongoSanitize({ replaceWith: '_' }))
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('server ok, and run on port:', PORT))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
