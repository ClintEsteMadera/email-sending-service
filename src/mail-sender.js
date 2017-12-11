'use strict';

const mailTransporterCreator = require('./mail-transporter-creator');

const BYTES_IN_A_MEGABYTE = 1024 * 1024;

class MailSender {
	constructor(config) {
		this.config = config;
		this.transporter = mailTransporterCreator.createTransporter(config);
	}

	sendEmail(options) {
		const self = this;
		return new Promise((resolve, reject) => {
			if (options.attachments) {
				self._validateAttachments(options.attachments, reject);
			}

			let mailOptions = {
				from: options.from || self.config.user,
				to: options.to,
				subject: options.subject,
				text: options.text,
				html: options.html,
				attachments: options.attachments
			};
			// TODO Use Node 8's util.promisify
			self.transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					// TODO try to determine the nature of the failure better, in order to report it more accurately
					return reject({success: false, status: 503, message: error.message});
				}
				return resolve({success: true, info: info});
			});
		});
	}

	_validateAttachments(attachments, reject) {
		for (let attachment of attachments) {
			const contentLength = attachment.contentLength;

			if (!contentLength || !Number.isInteger(contentLength) || contentLength <= 0) {
				return reject({
					success: false,
					status: 400,
					message: `The property "attachment.contentLength" is required and has to be a positive integer.`
				});
			}
			const maxAttachmentSize = this.config.maxAttachmentSizeInMb * BYTES_IN_A_MEGABYTE;

			if (attachment.contentLength > maxAttachmentSize) {
				return reject({
					success: false,
					status: 400,
					message: `The attachment is too big. Max. file size: ${this.config.maxAttachmentSizeInMb} MB`
				});
			}
		}
	}
}

module.exports = MailSender;