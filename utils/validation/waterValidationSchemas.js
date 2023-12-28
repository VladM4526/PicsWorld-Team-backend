// import Joi from 'joi';

// import Joi from 'joi';
// import JoiDate from '@joi/date';

import DateExtension from '@joi/date';
import JoiImport from 'joi';
const Joi = JoiImport.extend(DateExtension);

// const JoiExtended = Joi.extend(JoiDate);

// const Joi = require('joi').extend(require('@joi/date'));

const waterSchema = Joi.object({
	waterVolume: Joi.number().integer().min(0).max(2000).required(),

	date: Joi.date().format('YYYY-MM-DD HH:mm').required(),
});

const waterValidationSchemas = {
	waterSchema,
};

export default waterValidationSchemas;
