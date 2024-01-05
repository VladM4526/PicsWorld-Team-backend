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
	const todayDate = new Date();

	const startDay = new Date(todayDate.toISOString().slice(0, 10));

	const aggregationList = [
		{
			$match: {
				owner: userId,
				date: {
					$gte: startDay,
					$lt: new Date(startDay.getTime() + 24 * 60 * 60 * 1000)
				}
			}
		},
		{
			$lookup: {
			    from: "users",
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
			}
		},
		{
			$project: {
			_id: 0,
			userId: 1,
			waterRate: 1,
			// date: 1,
			percentage: { $concat: [
				{  $toString: {
					$round: [  
						{
						 $multiply: [ { $divide: ["$totalWaterVolume", "$waterRate"] }, 100,	],
					 	 },
					  0,
					],
				  },
				},
				"%",
			  ],
			},
			waterRecords: 1,
		  },
		 },
		
	  ];
	  
	  const result = await Water.aggregate(aggregationList);

	  res.json(result)
};

const monthWater = async(req, res) => {
	const userId = req.user._id;
	const date = req.params.month;
	const [year, month] = date.split("-").map(Number);

	let yearLt = year;
	let monthLt = month;
	 
    if (month === 12){
		yearLt = year+1;
	    monthLt = month-12;
	}
    
	const aggregationList = [
		{
			$match: {
			  owner: userId,
			  date: {
				$gte: new Date(`${year}-${month}-01`),
				$lt: new Date(`${yearLt}-${parseInt(monthLt) + 1}-01`)
			  }
			}
		  },
		  {
			$lookup: {
			    from: "users",
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
			  _id: { $dayOfMonth: "$date" },
			  date: {
				$first: {
					$concat: [
						
						{ $dateToString: { format: "%d", date: "$date" } },
						",",
					  {
						$switch: {
						  branches: [
							{ case: { $eq: [{ $month: "$date" }, 1] }, then: "January" },
							{ case: { $eq: [{ $month: "$date" }, 2] }, then: "February" },
							{ case: { $eq: [{ $month: "$date" }, 3] }, then: "March" },
							{ case: { $eq: [{ $month: "$date" }, 4] }, then: "April" },
							{ case: { $eq: [{ $month: "$date" }, 5] }, then: "May" },
							{ case: { $eq: [{ $month: "$date" }, 6] }, then: "June" },
							{ case: { $eq: [{ $month: "$date" }, 7] }, then: "July" },
							{ case: { $eq: [{ $month: "$date" }, 8] }, then: "August" },
							{ case: { $eq: [{ $month: "$date" }, 9] }, then: "September" },
							{ case: { $eq: [{ $month: "$date" }, 10] }, then: "October" },
							{ case: { $eq: [{ $month: "$date" }, 11] }, then: "November" },
							{ case: { $eq: [{ $month: "$date" }, 12] }, then: "December" },
						  ],
						  default: ""
						}
					  }
					 
					]
				  }
			  },
			  waterRate: { $first: "$user.waterRate" },
			  totalWaterVolume: { $sum: "$waterVolume" },
			  count: { $sum: 1 }
			}
		  },
		{
			$project: {
			  _id: 0,
			  date:1,
			  dailyWaterRate: {
				$concat: [
				  { $toString: { $divide: ["$waterRate", 1000] } },
				  " L",
				],
			  },
			  count: 1,
			  percentage: {
				$concat: [
				  {
					$toString: {
					  $round: [
						{
						  $multiply: [{ $divide: ["$totalWaterVolume", "$waterRate"] },100,],
						},0,
					  ],
					},
				  },
				  "%",
				],
			  },
			},
		  },
		  {
			$sort: {
			  date: 1
			}
		  }
	];

	const result = await Water.aggregate(aggregationList);

	res.json(result)
}

export default {
	createWaterNote: ctrlWrapper(createWaterNote),
	updateWaterNote: ctrlWrapper(updateWaterNote),
	deleteWaterNote: ctrlWrapper(deleteWaterNote),
	todayWater: ctrlWrapper(todayWater),
	monthWater: ctrlWrapper(monthWater)
};
