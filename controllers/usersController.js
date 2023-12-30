import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Jimp from 'jimp';

import User from '../models/users.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import HttpError from '../utils/helpers/httpErrors.js';

import ctrlWrapper from '../utils/decorators/ctrlWrapper.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsPath = path.join(__dirname, '../', 'public', 'avatars');

const getCurrent = async (req, res) => {
	const { email } = req.user;
	res.json({
		_id,
		name: UserName,
		email,
		waterRate,
	});
};

const waterRate = async (req, res) => {
	const { waterRate } = req.body;

	const userId = req.params.id;
	const existingUser = User.findById(userId);
	if (waterRate) {
		existingUser.waterRate = waterRate;
	}
	if (!existingUser) {
		return res.status(404).json({ message: 'User not found' });
	}

	const updatedWater = await User.findByIdAndUpdate(
		userId,
		{
			waterRate,
		},
		{ new: true }
	);
	res.json(updatedWater);
	// res.json(updatedWater.waterRate); тільки показник води віддає
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

export default {
	getCurrent: ctrlWrapper(getCurrent),
	waterRate: ctrlWrapper(waterRate),
	updateUserInfo: ctrlWrapper(updateUserInfo),
	updateAvatar: ctrlWrapper(updateAvatar),
};
