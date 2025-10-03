import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { extname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { FILE_SIZE } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const temp = join (
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(temp, { recursive: true })

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, temp)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, uuidv4().concat(extname(file.originalname)))
    },
})

export const typeFiles = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!typeFiles.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter, limits: { fileSize: FILE_SIZE.maxSize} })
