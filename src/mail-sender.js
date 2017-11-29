'use strict';

const mailTransporterCreator = require('./mail-transporter-creator');

const MAX_ATTACHMENT_SIZE_IN_MB = 1;
const MAX_ATTACHMENT_SIZE_IN_BYTES = MAX_ATTACHMENT_SIZE_IN_MB * 1024 * 1024;

const sendEmail = (config, options) => {
	return new Promise((resolve, reject) => {
		const transporter = mailTransporterCreator.createTransporter(config);
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
		validateAttachments(attachments, reject);

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

const validateAttachments = (attachments, reject) => {
	for (let attachment of attachments) {
		if (attachment.contentLength && attachment.contentLength >= MAX_ATTACHMENT_SIZE_IN_BYTES) {
			return reject({
				success: false,
				status: 400,
				message: `Attachment too big. Max. allowed size: ${MAX_ATTACHMENT_SIZE_IN_MB} MB`
			});
		}
	}
};

module.exports = {
	sendEmail
};