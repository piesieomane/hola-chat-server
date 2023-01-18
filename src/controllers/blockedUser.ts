import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get userid from params
  const { blackListerId } = req.params;
  //get blockedUserId from body
  const { blockedUserId } = req.body;
  try {
    const blockedUser = await prisma.blackList.create({
      data: {
        blackLister: { connect: { id: +blackListerId } },
        blackListee: { connect: { id: +blockedUserId } },
      },
    });
    res.json(blockedUser);
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
