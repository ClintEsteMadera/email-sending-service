'use strict';

const _ = require('lodash');
const mailTransporterCreator = require('./mail-transporter-creator');

const BYTES_IN_A_MEGABYTE = 1024 * 1024;
const ATTACHMENTS_FOOTER_PREFIX = "Please see the following link(s):";

class MailSender {
	constructor(config) {
		this.config = config;
		this.transporter = mailTransporterCreator.createTransporter(config);
	}

	sendEmail(options) {
		const self = this;
		return new Promise(async (resolve, reject) => {
			let postProcessedOptions;
			try {
				postProcessedOptions = await self._processAttachments(options);
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

	_processAttachments(options) {
		return new Promise((resolve, reject) => {

			const result = _.pick(options, 'text', 'html');
			result.attachments = [];
			const linksToOversizedAttachments = [];

			const attachments = options.attachments || [];

			if (!(attachments instanceof Array) || attachments.length > this.config.maxAttachments) {
				return reject({
					success: false,
					status: 400,
					message: `The "attachments" option (when present) has to be an array with no more than ${this.config.maxAttachments} attachment(s).`
				});
			}
			for (let attachment of options.attachments) {
				const contentLength = attachment.contentLength;

				if (!contentLength || !Number.isInteger(contentLength) || contentLength <= 0) {
					return reject({
						success: false,
						status: 400,
						message: `The option "attachment.contentLength" is required and has to be a positive integer.`
					});
				}
				const maxAttachmentSize = this.config.maxAttachmentSizeInMb * BYTES_IN_A_MEGABYTE;

				if (attachment.contentLength > maxAttachmentSize) {
					linksToOversizedAttachments.push(attachment.href);
				} else {
					result.attachments.push(attachment);
				}
			}
			if (linksToOversizedAttachments.length > 0) {
				if (result.text) {
					result.text += "\n\n" + ATTACHMENTS_FOOTER_PREFIX + "\n" + _.join(linksToOversizedAttachments, '\n');
				}
				if (result.html) {
					result.html += "<p>" + ATTACHMENTS_FOOTER_PREFIX + "<br>" + _.join(linksToOversizedAttachments, '<br>')
				}
			}
			return resolve(result);
		});
	}
}

module.exports = MailSender;