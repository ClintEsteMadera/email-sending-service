'use strict';

const mailTransporterCreator = require('./mail-transporter-creator');

const MAX_ATTACHMENT_SIZE_IN_MB = 1;
const MAX_ATTACHMENT_SIZE_IN_BYTES = MAX_ATTACHMENT_SIZE_IN_MB * 1024 * 1024;

// Constructor
function MailSender(config) {
	this.config = config;
	this.transporter = mailTransporterCreator.createTransporter(config);
}

MailSender.prototype.sendEmail = function sendEmail(options) {
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
		self.transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				// TODO try to determine the nature of the failure better, in order to report it more accurately
				return reject({success: false, status: 503, message: error.message});
			}
			return resolve({success: true, info: info});
		});
	});
};

MailSender.prototype._validateAttachments = function _validateAttachments(attachments, reject) {
	for (let attachment of attachments) {
		if (!attachment.contentLength) {
			return reject({
				success: false,
				status: 400,
				message: `The property "attachment.contentLength" is required.`
			});
		}
		if (attachment.contentLength >= MAX_ATTACHMENT_SIZE_IN_BYTES) {
			return reject({
				success: false,
				status: 400,
				message: `The attachment is too big. Max. file size: ${MAX_ATTACHMENT_SIZE_IN_MB} MB`
			});
		}
	}
};

module.exports = MailSender;
