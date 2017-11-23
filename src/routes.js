const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const sesTransport = require('nodemailer-ses-transport');

const createTransporter = (config) => {
	// by default, we will use SMTP
	// TODO Change config file to hold sub-sections for SMTP and SES
	let transport = config.useSES ? createSESTransport() : createSMTPTransport(config);

	return nodemailer.createTransport(transport);
};

const createSESTransport = () => {
	// key and secret retrieval will be attempted (in order):
	// 1. from AWS Identity and Access Management (IAM) roles for Amazon EC2 (if running on Amazon EC2)
	// 2. from the shared credentials file (~/.aws/credentials), using the profile indicated by AWS_DEFAULT_PROFILE or "default".
	// 3. from environment variables (default prefix: "AWS")
	// 4. from a JSON file on disk (e.g. AWS.config.loadFromPath(<config file path>);)
	let sesObj = new AWS.SES({
		apiVersion: '2010-12-01',
		region: 'us-west-2'
	});
	return sesTransport({ses: sesObj});
};

const createSMTPTransport = (config) => {
	let smtpTransport = {
		host: config.host,
		port: config.port,
		secure: config.secure || false,
		connectionTimeout: 5000
	};
	let useAuth = config.user !== undefined && config.pass !== undefined;

	if (useAuth) {
		smtpTransport.auth = {
			user: config.user,
			pass: config.pass
		}
	}
	return smtpTransport;
};

const sendEmail = (config, options) => {
	return new Promise((resolve, reject) => {
		const transporter = createTransporter(config);
		let attachments = null;

		if (options.attachments) {
			try {
				attachments = JSON.parse(options.attachments);
				if (attachments && attachments.error) {
					return reject({success: false, status: 400, message: attachments.error});
				}
			} catch (e) {
				return reject({success: false, status: 400, message: e.error});
			}
		}
		let mailOptions = {
			from: options.from || config.user,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html,
			attachments: attachments
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return reject({success: false, status: 503, message: error.message});
			}
			return resolve({success: true, info: info});
		});
	});
};

module.exports = (app, config, ad) => {
	app.post("/email", async (req, res) => {
		const body = req.body;
		sendEmail(config, body).then(data => {
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
}