import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';

import { generateAvatarUrl } from '../utils/helpers/index.js';

import { HttpError } from '../utils/helpers/index.js';
import { ctrlWrapper } from '../utils/decorators/index.js';
import { token } from 'morgan';

dotenv.config();
const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (user) {
		throw new HttpError(409, 'User with such email already exists');
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const verificationToken = nanoid();

	const avatar = generateAvatarUrl(email, {
		defaultImage: 'monsterid',
	});

	const newUser = await User.create({
		...req.body,
		name: null,
		gender: null,
		email: email,
		waterRate: null,
		password: hashPassword,
		verificationToken,
		avatarURL: avatar,
	});

	res.status(201).json({
		email: newUser.email,
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });
	if (!user) {
		throw new HttpError(404, 'User not found');
	}

	await User.updateOne(
		{ verificationToken },
		{ verified: true, verificationToken: null }
	);

	res.json({ message: 'Verification successful' });
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	const userIn = await User.findOne({ email });
	if (!userIn) {
		throw new HttpError(401, 'User with such email not found');
	}

	// if (!user.verify) {
	// 	throw new HttpError(401, 'email not verify');
	// }

	const passwordCompare = await bcrypt.compare(password, userIn.password);
	if (!passwordCompare) {
		throw new HttpError(403, 'Provided password is incorrect');
	}

	const payload = {
		userId: userIn._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
	const user = await User.findByIdAndUpdate(userIn._id, { token });

	res.json({
		user,
	});
};

const signout = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, { token: '' });

	if (!result) {
		throw new HttpError(401, 'Bearer Auth failed');
	}

	res.json({
		message: 'User signed out',
	});
};

export default {
	signup: ctrlWrapper(signup),
	verify: ctrlWrapper(verify),
	signin: ctrlWrapper(signin),
	signout: ctrlWrapper(signout),
};
