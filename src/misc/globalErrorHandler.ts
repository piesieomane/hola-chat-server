import { Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: any,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' });
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};
