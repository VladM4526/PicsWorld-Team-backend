import bcrypt from 'bcryptjs';
// hash password
import dotenv from 'dotenv';
import Jimp from 'jimp';
// images
import { nanoid } from 'nanoid';

import User from '../models/users.js';
import jwt from 'jsonwebtoken';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import generateAvatarUrl from '../utils/helpers/gravatar.js';

import HttpError from '../utils/helpers/httpErrors.js';

import ctrlWrapper from '../utils/decorators/ctrlWrapper.js';

dotenv.config();
const { JWT_SECRET } = process.env;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsPath = path.join(__dirname, '../', 'public', 'avatars');

const signup = async (req, res) => {
	const { email, password, name } = req.body;

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
		name: name,
		email: email,
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
	const user = await User.findOne({ email });
	if (!user) {
		throw new HttpError(401, 'User with such email not found');
	}

	// if (!user.verify) {
	// 	throw new HttpError(401, 'email not verify');
	// }

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw new HttpError(403, 'Provided password is incorrect');
	}

	const payload = {
		contactId: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		user: {
			email,
		},
		token,
	});
};

const getCurrent = async (req, res) => {
	const { email } = req.user;
	res.json({
		// _id,
		// name: UserName,
		email,
	});
};

const updateUserInfo = async (req, res) => {
	const { name, email, gender, oldPassword, newPassword, confirmPassword } =
		req.body;
	const userId = req.user._id;

	const existingUser = await User.findById(userId);

	if (!existingUser) {
		return res.status(404).json({ message: 'User not found' });
	}

	if (newPassword) {
		const isPasswordValid = await bcrypt.compare(
			oldPassword,
			existingUser.password
		);
		if (!isPasswordValid) {
			throw new HttpError(401, 'Invalid old password');
		}

		if (newPassword !== confirmPassword) {
			throw new HttpError(400, 'New password and confirmation do not match');
		}
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);
		existingUser.password = hashedNewPassword;
	}

	if (name) {
		existingUser.name = name;
	}
	if (email) {
		existingUser.email = email;
	}
	if (gender) {
		existingUser.gender = gender;
	}

	const updatedUser = await existingUser.save();

	res.json(updatedUser);
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;

	const { path: oldPath, filename } = req.file;

	const newPath = path.join(avatarsPath, filename);

	const img = await Jimp.read(oldPath);
	await img.resize(250, 250).writeAsync(oldPath);

	await fs.rename(oldPath, newPath);
	const avatarURL = path.join('avatars', filename);

	await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });

	res.status(200).json({ avatarURL });
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
	getCurrent: ctrlWrapper(getCurrent),
	updateUserInfo: ctrlWrapper(updateUserInfo),
	updateAvatar: ctrlWrapper(updateAvatar),
	signout: ctrlWrapper(signout),
};
