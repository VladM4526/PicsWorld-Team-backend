import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from '../models/users.js';

import fs from 'fs/promises';
import { HttpError } from '../utils/helpers/index.js';

import { cloudinary } from '../utils/helpers/index.js';

import { ctrlWrapper } from '../utils/decorators/index.js';

dotenv.config();

const getCurrent = async (req, res) => {
	const { _id, name, email, waterRate, gender, avatarURL } = req.user;
	res.json({
		_id,
		name,
		email,
		gender,
		waterRate,
		avatarURL,
	});
};

const waterRate = async (req, res) => {
	const { waterRate } = req.body;

	const userId = req.user._id;
	const existingUser = User.findById(userId);
	if (waterRate) {
		existingUser.waterRate = waterRate;
	}
	if (!existingUser) {
		throw new HttpError(404, 'User not found');
	}

	const updatedWater = await User.findByIdAndUpdate(
		userId,
		{
			waterRate,
		},
		{ new: true }
	);
	res.json(updatedWater);
};

const updateUserInfo = async (req, res) => {
	const { name, email, gender, oldPassword, newPassword } = req.body;

	const userId = req.user._id;

	const existingUser = await User.findById(userId);

	if (!existingUser) {
		throw new HttpError(404, 'User not found');
	}

	if (newPassword) {
		const isPasswordValid = await bcrypt.compare(
			oldPassword,
			existingUser.password
		);
		if (!isPasswordValid) {
			throw new HttpError(401, 'Invalid old password');
		}
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);
		existingUser.password = hashedNewPassword;
	}

	if (name) {
		existingUser.name = name;
	}
	if (email) {
		const user = await User.findOne({ email });
		if (user) {
			throw new HttpError(409, 'User with such email already exists');
		}
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
	const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
		folder: 'avatars',
	});
	await fs.unlink(req.file.path);

	const result = await User.findByIdAndUpdate(
		_id,
		{ avatarURL },
		{ new: true }
	);

	res.status(200).json({ result });
};

export default {
	getCurrent: ctrlWrapper(getCurrent),
	waterRate: ctrlWrapper(waterRate),
	updateUserInfo: ctrlWrapper(updateUserInfo),
	updateAvatar: ctrlWrapper(updateAvatar),
};
