import express from 'express';

import usersController from '../controllers/usersController.js';
import validateBody from '../utils/decorators/validateBody.js';
import userValidationSchemas from '../utils/validation/userValidationSchemas.js';
import authenticate from '../middlewars/authenticate.js';

import { uploadTmp } from '../middlewars/uploadTmp.js';

const usersRouter = express.Router();

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.patch(
	'/avatars',
	authenticate,
	uploadTmp.single('avatar'),
	usersController.updateAvatar
);

usersRouter.put('/waterrate', authenticate, usersController.waterRate);

usersRouter.patch('/userinfo', authenticate, usersController.updateUserInfo);

export default usersRouter;
