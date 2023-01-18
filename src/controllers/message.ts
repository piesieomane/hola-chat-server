import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get messages between two users
  const { senderId, receiverId } = req.body;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { senderId, receiverId, text } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });
    res.json(message);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
