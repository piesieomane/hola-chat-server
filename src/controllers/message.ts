import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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
        sender: { connect: { id: +senderId } },
        receiver: { connect: { id: +receiverId } },
        text,
      },
    });
    res.json(message);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 error code is related to Prisma's "Connect Error: No node found" error
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    console.error(error);
    return next(error);
  }
};
