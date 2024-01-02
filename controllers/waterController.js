import Water from '../models/water.js';
import {
	handleMongooseError
} from '../utils/helpers/handleMongooseError.js';
import HttpError from '../utils/helpers/httpErrors.js';

import ctrlWrapper from '../utils/decorators/ctrlWrapper.js';

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
	}catch (error) {
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
			throw new HttpError(404,'Water note not found');
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
			throw new HttpError (404, 'Water note not found');
		}

		res.json(deletedWaterNote);
	} catch (error) {
		handleMongooseError(error, res);
	}
};

const todayWater = async(req, res) => {
	const userId = req.user._id;
	const { date} = req.body;
	const today = new Date(date);

	const aggregationList = [
		{
			$match: {
				owner: userId,
				date: {
					$gte: today,
					$lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Для вибору всіх записів за день
				}
			}
		},
		{
			$lookup: {
			    from: "users", // Назва колекції користувачів
			    localField: "owner",
			    foreignField: "_id",
			    as: "user"
			}
		},
		{
			$unwind: "$user"
		},
		{
			$group: {
				_id: null,
				userId: { $first: "$user._id" },
				waterRate: { $first: "$user.waterRate" },
				number_of_records: { $sum: 1 },
				totalWaterVolume: { $sum: "$waterVolume" }, 
				waterRecords: { $push: "$$ROOT" },
				// percentage: { $divide: [ "$totalWaterVolume", "$user.waterRate" ] }
			}
		},
		
	  ];
	  
	  const result = await Water.aggregate(aggregationList);

	  res.json(result[0])

};

export default {
	createWaterNote: ctrlWrapper(createWaterNote),
	updateWaterNote: ctrlWrapper(updateWaterNote),
	deleteWaterNote: ctrlWrapper(deleteWaterNote),
	todayWater: ctrlWrapper(todayWater)
};
