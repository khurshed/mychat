const Joi = require('@hapi/joi');

const messageValidation = data => {
	const schema = Joi.object({
	    message:Joi.string().min(1).required(),
	    sender:Joi.string().min(10).required(),
	    to:Joi.string().min(10).required()
	});
	return schema.validate(data);
}
module.exports.messageValidation = messageValidation;