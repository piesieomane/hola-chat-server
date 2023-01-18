import { Router } from 'express';
import { getBlockedUsers, blockUser } from '../controllers/blockedUser';

const router = Router();

// @route   GET api/blockedUser/user/:id
// @desc    Get all blocked users by a user
// @access  Public
router.get('/user/:blackListerId', getBlockedUsers);

// @route   POST api/blockedUser/user/:id
// @desc    Block a user
// @access  Public
router.post('/user/:blackListerId', blockUser);

export default router;
