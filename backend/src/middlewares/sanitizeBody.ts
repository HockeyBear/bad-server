import { Request, Response, NextFunction } from "express";
import sanitizeHtml from 'sanitize-html';

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = sanitizeHtml(req.body[key], {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard'
      })
    }
  }
  next()
}