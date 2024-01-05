import DateExtension from '@joi/date';
import JoiImport from 'joi';
const Joi = JoiImport.extend(DateExtension);

const waterSchema = Joi.object({
	waterVolume: Joi.number().integer().min(0).max(2000).required(),

	date: Joi.date().format('YYYY-MM-DD HH:mm').required(),
});

const waterValidationSchemas = {
	waterSchema,
};

export default waterValidationSchemas;
