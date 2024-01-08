import Water from '../models/water.js';

const todayWaterNotes = async(userId) =>{
//     const todayDate = new Date();
// //    console.log(todayDate);
// 	const startDay = new Date (todayDate.setHours(0, 0, 0, 0));
// 	// console.log(startDay);
// 	const endDay = new Date (todayDate.setHours(23, 59, 59, 999));
// 	// console.log(endDay);


	const todayDate = new Date();
	const hours = Number(todayDate.getHours());
	todayDate.setUTCHours(hours, 0, 0, 0);

	const currentDate = new Date(todayDate);

	currentDate.setUTCHours(0, 0, 0, 0);
	const startDay = new Date(currentDate.toISOString());
	currentDate.setUTCHours(23, 59, 59, 999);
	const endDay = new Date(currentDate.toISOString());

	const aggregationList = [
		{
			$match: {
				owner: userId,
				date: {
					$gte: startDay,
					$lt: endDay
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
					  date: "$date",
					},
				  },
				
			}
		},
		// {
		// 	$sort: {
		// 		"waterRecords.date": 1
		// 	}
		//   },
		{
			$project: {
			_id: 0,
			// userId: 1,
			// waterRate: 1,
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
		 {
            $replaceRoot: {
                newRoot: {
                    percentage: "$percentage",
                    waterRecords: "$waterRecords"
                }
            }
        }
	  ];
	  
	return await Water.aggregate(aggregationList);
}

export default todayWaterNotes