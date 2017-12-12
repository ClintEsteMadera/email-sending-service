'use strict';

const _ = require('lodash');
const mailTransporterCreator = require('./mail-transporter-creator');
const AttachmentsProcessor = require('./attachments-processor');

class MailSender {
	constructor(config) {
		this.config = config;
		this.transporter = mailTransporterCreator.createTransporter(config);
		this.attachmentsProcessor = new AttachmentsProcessor(config);
	}

	sendEmail(options) {
		const self = this;
		return new Promise(async (resolve, reject) => {
			let postProcessedOptions;
			try {
				postProcessedOptions = await self.attachmentsProcessor.processAttachments(options);
			} catch (err) {
				return reject(err);
			}
			let mailOptions = {
				from: options.from || self.config.user,
				to: options.to,
				subject: options.subject,
				text: postProcessedOptions.text,
				html: postProcessedOptions.html,
				attachments: postProcessedOptions.attachments
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
}

module.exports = MailSender;