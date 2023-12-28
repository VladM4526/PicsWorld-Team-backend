import { Schema, model } from 'mongoose';
import {
	handleMongooseError,
	preUpdate,
} from '../utils/helpers/handleMongooseError.js';
// const {createContactValidationSchema,
//       updateContactValidationSchema,
//       contactFavoriteSchema }= require('../utils/validation/contactValidationSchemas')

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

const Water = model('water', waterNotesSchema);

// const schemas =  {
//     createContactValidationSchema,
//     updateContactValidationSchema,
//     contactFavoriteSchema,
// }

export default {
	Water,
	// schemas
};
