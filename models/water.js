import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../utils/helpers/index.js';

import { preUpdate } from '../utils/helpers/index.js';

const waterNotesSchema = new Schema(
	{
		date: {
			type: Date,
			required: [true, 'Set date'],
		},
		waterVolume: {
			type: Number,
			required: [true, 'Set water'],
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
	},
	{ versionKey: false, timestamps: true }
);

waterNotesSchema.post('save', handleMongooseError);
waterNotesSchema.pre('findOneAndUpdate', preUpdate);
waterNotesSchema.post('findOneAndUpdate', handleMongooseError);

const Water = model('water', waterNotesSchema, 'waters');

// const schemas =  {
//     createContactValidationSchema,
//     updateContactValidationSchema,
//     contactFavoriteSchema,
// }

export default Water;
