import type { RequestHandler } from 'express';
import { z } from 'zod';

const validate =
  (schema: z.ZodTypeAny, key: 'body' | 'params' | 'query'): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[key]);

    if (!result.success) {
      res.status(400).json({
        error: `Invalid ${key}`,
        details: result.error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    req[key] = result.data;
    next();
  };

export const validateBody = (schema: z.ZodTypeAny): RequestHandler => validate(schema, 'body');

export const validateParams = (schema: z.ZodTypeAny): RequestHandler => validate(schema, 'params');

export const validateQuery = (schema: z.ZodTypeAny): RequestHandler => validate(schema, 'query');
