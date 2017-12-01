"use strict";

const MailSender = require('./mail-sender');

module.exports = (app, config) => {
	const startTime = new Date();
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

	app.get("/status", async (req, res) => {
		let uptime = Math.round((new Date() - startTime) / 1000 / 60);
		let displayableUpTime = uptime <= 1 ? "1 minute" : `${uptime} minutes`;
		res.send({online: true, uptime: displayableUpTime});
	});
};