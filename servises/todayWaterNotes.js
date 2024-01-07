import Water from '../models/water.js';

const todayWaterNotes = async(userId) =>{
    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() + 2);
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
				waterRecords: {
					$push: {
					  _id: "$_id",
					  waterVolume: "$waterVolume",
					  time: { $dateToString: { format: "%H:%M", date: "$date" } },
					},
				  },
				
			}
		},
		{
			$sort: {
				"waterRecords.time": 1
			}
		  },
		{
			$project: {
			_id: 0,
			userId: 1,
			waterRate: 1,
			percentage: { $concat: [
				{  $toString: {
					$round: [  
						{
						 $multiply: [ { $divide: ["$totalWaterVolume", "$waterRate"] }, 100,],
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
	  
	return await Water.aggregate(aggregationList);
}

export default todayWaterNotes