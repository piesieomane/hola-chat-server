import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/message';

const router = Router();

// @route   GET api/messages
// @desc    Get all messages
// @access  Public
router.get('/', getMessages);

// @route POST api/messages
// @desc  POST a message to a user
// @access Public
router.post('/', sendMessage);

export default router;
