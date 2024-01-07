import DateExtension from '@joi/date';
import JoiImport from 'joi';
const Joi = JoiImport.extend(DateExtension);

const waterSchema = Joi.object({
	waterVolume: Joi.number().integer().min(0).max(2000).required(),

	date: Joi.date().iso().required()
	
});
const waterUpdateSchema = Joi.object({
	waterVolume: Joi.number().integer().min(0).max(2000),

	date: Joi.date().iso()
	
});

const waterValidationSchemas = {
	waterSchema,
	waterUpdateSchema
};

export default waterValidationSchemas;
