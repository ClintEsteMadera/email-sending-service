'use strict';

const Joi = require('joi');

module.exports = {
	body: {
		from: Joi.string().email().required(),
		to: Joi.string().email().required(),
		subject: Joi.string().required(),
		text: Joi.string().required(),
		html: Joi.string().optional(),
		attachments: Joi.array().optional().items(
			Joi.object().keys({
				contentLength: Joi.number().integer().min(1).max(2097152),
				href: Joi.string().uri(),
		})),
		customerCtx: Joi.object().optional().keys({
			customerId: Joi.string().required()
		})
	}
};