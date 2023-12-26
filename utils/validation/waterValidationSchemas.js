// import Joi from 'joi';

const Joi = require('joi').extend(require('@joi/date'));

const waterSchema = Joi.object({
	waterVolume: Joi.number().integer().min(0).max(2000).required(),

	date: Joi.date().format('YYYY-MM-DD HH:mm').required(),
});

const waterValidationSchemas = {
	waterSchema,
};

export default waterValidationSchemas;
