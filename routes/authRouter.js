import express from 'express';

import authController from '../controllers/authController.js';
import validateBody from '../utils/decorators/validateBody.js';
import userValidationSchemas from '../utils/validation/userValidationSchemas.js';
import authenticate from '../middlewars/authenticate.js';

const authRouter = express.Router();

authRouter.post(
	'/signup',
	validateBody(userValidationSchemas.registerSchema),
	authController.signup
);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post(
	'/signin',
	validateBody(userValidationSchemas.loginSchema),
	authController.signin
);

authRouter.post('/signout', authenticate, authController.signout);

export default authRouter;
