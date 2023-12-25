import express from 'express';

import usersController from '../controllers/usersController.js';
import validateBody from '../utils/decorators/validateBody.js'
import userValidationSchemas from '../utils/validation/userValidationSchemas.js'
import authenticate from '../middlewars/authenticate.js';

import { uploadTmp } from '../middlewars/uploadTmp.js';

const usersRouter = express.Router();

usersRouter.post('/signup', validateBody(userValidationSchemas.registerSchema), usersController.signup);

usersRouter.get('/verify/:verificationToken', usersController.verify);

usersRouter.post('/signin',validateBody(userValidationSchemas.loginSchema), usersController.signin);

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.patch(
	'/avatars',
	authenticate,
	uploadTmp.single('avatar'),
	usersController.updateAvatar
);

usersRouter.patch('/userinfo', authenticate, usersController.updateUserInfo);

usersRouter.post('/signout', authenticate, usersController.signout);

export default usersRouter;
