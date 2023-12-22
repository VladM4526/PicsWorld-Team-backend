import express from 'express';

import usersController from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.post('/signup', usersController.signup);

usersRouter.get('/verify', usersController.verify);

usersRouter.post('/signin', usersController.signin);

usersRouter.get('/current', usersController.getCurrent);

usersRouter.patch(
	'/avatars',
	uploadTmp.single('avatar'),
	usersController.updateAvatar
);

usersRouter.patch('/userinfo', usersController.updateUserInfo);

usersRouter.post('/signout', usersController.signout);

export default usersRouter;
