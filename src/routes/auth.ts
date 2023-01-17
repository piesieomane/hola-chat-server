import { Router } from 'express';
import { check } from 'express-validator';
import { login, signup, getUsers } from '../controllers/auth';

const router = Router();

// @route   POST api/users/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// @route   POST api/users/signup
// @desc    Register a user
router.post(
  '/signup',
  [
    check('username', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  signup
);

router.get('/', getUsers);

export default router;
