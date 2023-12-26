import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
	// name: Joi.string().required(),

	email: Joi.string().required().pattern(new RegExp(emailRegexp)).messages({
		'any.required': `Missing required email field`,
	}),

	password: Joi.string().required().min(8).max(64).messages({
		'any.required': `Missing required password field`,
	}),
});

const loginSchema = Joi.object({
	email: Joi.string().required().pattern(new RegExp(emailRegexp)).messages({
		'any.required': `Missing required email field`,
	}),

	password: Joi.string().required().min(8).max(64).messages({
		'any.required': `Missing required password field`,
	}),
});

// const updateSchema = Joi.object({
// 	email: Joi.string().pattern(new RegExp(emailRegexp)).messages({
// 		'any.required': `Missing required email field`,
// 	}),

// 	password: Joi.string().min(8).max(64).messages({
// 		'any.required': `Missing required password field`,
// 	}),
// 	name: Joi.string().max(32),
// 	gender: Joi.string().'mail', 'femail',

// });

const userValidationSchemas = {
	registerSchema,
	loginSchema,
};

export default userValidationSchemas;
