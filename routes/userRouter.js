import express from 'express';

import usersController from '../controllers/usersController.js';
import { validateBody } from '../utils/decorators/index.js';
import userValidationSchemas from '../utils/validation/userValidationSchemas.js';
import { authenticate } from '../middlewars/index.js';

import { uploadTmp } from '../middlewars/index.js';

const usersRouter = express.Router();

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.patch(
	'/avatars',
	authenticate,
	uploadTmp.single('avatar'),
	usersController.updateAvatar
);

usersRouter.put('/waterrate', authenticate, usersController.waterRate);

usersRouter.patch(
	'/userinfo',
	authenticate,
	validateBody(userValidationSchemas.updateSchema),
	usersController.updateUserInfo
);

export default usersRouter;
