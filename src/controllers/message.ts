import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get messages between two users
  const { userId1, userId2 } = req.body;
  try {
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          { OR: [{ senderId: +userId1 }, { senderId: +userId2 }] },
          { OR: [{ receiverId: +userId1 }, { receiverId: +userId2 }] },
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
      // P2025 is an error code related to  "No 'User' record(s) (needed to inline the relation on 'Message' record(s)) was found for a nested connect on one-to-many relation 'message_receiver'."
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    console.error(error);
    return next(error);
  }
};
