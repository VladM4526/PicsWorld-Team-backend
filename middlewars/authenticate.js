import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

import User from '../models/users.js';

import { HttpError } from '../utils/helpers/index.js';

import ctrlWrapper from '../utils/decorators/ctrlWrapper.js';

dotenv.config();

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		throw new HttpError(401, 'Authorization header not found');
	}
	const [bearer, token] = authorization.split(' ');
	if (bearer !== 'Bearer') {
		throw new HttpError(401, 'Invalid signature');
	}
	try {
		const { userId } = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(userId);
		if (!user || !user.token || user.token !== token) {
			throw new HttpError(401, 'User not found');
		}

		req.user = user;
		next();
	} catch (error) {
		throw new HttpError(401, 'Unauthorized');
	}
};

export default ctrlWrapper(authenticate);
