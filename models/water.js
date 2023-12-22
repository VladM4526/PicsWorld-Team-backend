const { Schema, model } = require('mongoose');
const {handleMongooseError, preUpdate} = require('../utils/helpers/handleMongooseError');
// const {createContactValidationSchema,
//       updateContactValidationSchema,
//       contactFavoriteSchema }= require('../utils/validation/contactValidationSchemas')

const waterSchema = new Schema({
    waterRate: {
      type: Number,
      required: [true, 'Set rate'],
    },
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
    }
}, 
{ versionKey: false, timestamps: true })

waterSchema.post('save', handleMongooseError );
waterSchema.pre("findOneAndUpdate", preUpdate);
waterSchema.post('findOneAndUpdate', handleMongooseError );

const Water = model('water', waterSchema);

// const schemas =  {
//     createContactValidationSchema,
//     updateContactValidationSchema,
//     contactFavoriteSchema,
// }

module.exports = { 
    Water,
    // schemas
};