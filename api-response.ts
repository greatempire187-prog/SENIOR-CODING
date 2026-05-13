import { Response } from 'express';

export const ok = <T>(res: Response, data: T) => res.status(200).json({ data });
export const created = <T>(res: Response, data: T) => res.status(201).json({ data });
export const noContent = (res: Response) => res.status(204).send();
export const badRequest = (res: Response, message: unknown) =>
  res.status(400).json({ error: message });
export const notFound = (res: Response, message: string) =>
  res.status(404).json({ error: message });
export const internalServerError = (res: Response) =>
  res.status(500).json({ error: 'Internal server error' });
