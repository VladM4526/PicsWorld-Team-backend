import express from 'express';

import usersController from '../controllers/usersController.js';

import authenticate from '../middlewars/authenticate.js';

const usersRouter = express.Router();

usersRouter.post('/signup', usersController.signup);

usersRouter.get('/verify', usersController.verify);

usersRouter.post('/signin', usersController.signin);

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
