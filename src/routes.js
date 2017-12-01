"use strict";

const MailSender = require('./mail-sender');

module.exports = (app, config) => {
	const mailSender = new MailSender(config);

	app.post("/email", async (req, res) => {
		const options = req.body;
		mailSender.sendEmail(options).then(data => {
			res.json(data);
		}).catch(err => {
			res.status(err.status || 503);
			res.send(err);
		});
	});

	const startTime = new Date();

	app.get("/status", async (req, res) => {
		let upTime = new Date() - startTime;
		res.send({online: true, uptime: upTime});
	});
};