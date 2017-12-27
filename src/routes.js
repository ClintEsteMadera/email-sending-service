"use strict";

const validate = require('express-validation');
const emailValidationRules = require('./validation/email');
const MailSender = require('./mail-sender');

module.exports = async (app, config) => {
	const startTime = new Date();
	const mailSender = new MailSender(config);

	app.post("/email", validate(emailValidationRules), async (req, res) => {
		try {
			const email = req.body;
			let response = await mailSender.sendEmail(email);
			res.json(response);
		} catch (err) {
			res.status(err.status || 503);
			res.send(err);
		}
	});

	app.get("/status", async (req, res) => {
		let uptime = Math.round((new Date() - startTime) / 1000 / 60);
		let displayableUpTime = uptime <= 1 ? "1 minute" : `${uptime} minutes`;
		res.send({online: true, uptime: displayableUpTime});
	});

	// error handler
	app.use(function (err, req, res, next) {
		if (err instanceof validate.ValidationError) return res.status(err.status).json(err);

		// other type of errors, it *might* also be a Runtime Error
		// example handling
		if (process.env.NODE_ENV !== 'production') {
			return res.status(500).send(err.stack);
		} else {
			return res.status(500);
		}
	});
};