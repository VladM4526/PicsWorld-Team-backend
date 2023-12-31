import Water from '../models/water.js';
import { handleMongooseError } from '../utils/helpers/index.js';
import { HttpError } from '../utils/helpers/index.js';

import { ctrlWrapper } from '../utils/decorators/index.js';
import { todayWaterNotes } from '../servises/index.js';
import { monthWaterNotes } from '../servises/index.js';

const createWaterNote = async (req, res) => {
	try {
		const { date, waterVolume } = req.body;
		const owner = req.user._id;
		const newWaterNote = await Water.create({ 
			...req.body,
			date:date, 
			waterVolume:waterVolume, 
			owner:owner
		 });

		res.status(201).json(newWaterNote);
	} catch (error) {
		handleMongooseError(error, res);
	}
};

const updateWaterNote = async (req, res) => {
	try {
		const { date, waterVolume } = req.body;
		const ownerId = req.user._id;
		const updatedWaterNote = await Water.findOneAndUpdate(
			{ _id: req.params.id, owner: ownerId },
			{ date, waterVolume },
			{ new: true }
		);
		if (!updatedWaterNote) {
			return res.status(404).json({ message: 'Water note not found' });
		}
		res.json(updatedWaterNote);
	} catch (error) {
		handleMongooseError(error, res);
	}
};

const deleteWaterNote = async (req, res) => {
	try {
		const ownerId = req.user._id;

		const deletedWaterNote = await Water.findOneAndDelete({
			_id: req.params.id,
			owner: ownerId,
		});

		if (!deletedWaterNote) {
			throw new HttpError(404, 'Water note not found');
		}

		res.json({
			message: 'Water note deleted',
		});
	} catch (error) {
		handleMongooseError(error, res);
	}
};

const todayWater = async (req, res) => {
	const result = await todayWaterNotes(req.user._id);
	res.json(result)
};

const monthWater = async (req, res) => {
	const result = await monthWaterNotes(req.user._id, req.params.month);

	res.json(result);
};

export default {
	createWaterNote: ctrlWrapper(createWaterNote),
	updateWaterNote: ctrlWrapper(updateWaterNote),
	deleteWaterNote: ctrlWrapper(deleteWaterNote),
	todayWater: ctrlWrapper(todayWater),
	monthWater: ctrlWrapper(monthWater),
};
