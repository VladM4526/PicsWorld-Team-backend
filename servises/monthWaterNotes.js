import Water from '../models/water.js';

const monthWaterNotes = async (userId, date) => {
    // const userId = req.user._id;
	// const date = req.params.month;
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

	return await Water.aggregate(aggregationList);
}

export default monthWaterNotes