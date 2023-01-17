import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { env } from '../misc/env';
import { UserStatus } from '@prisma/client';
dotenv.config();

//Register a user
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check if there are errors in the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //if there are no errors in the req body get all the properties on the req body
  const { username, email, password } = req.body;

  try {
    // check if user exists in the db
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    //if not encrpt the password into the db and create new user

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        status: UserStatus.OFFLINE,
      },
    });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) {
          err.name = 'ValidationError';
          return next(err);
        }
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

//Authenticate a user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) {
          err.name = 'ValidationError';
          return next(err);
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
