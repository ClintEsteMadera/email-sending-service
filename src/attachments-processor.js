'use strict';

const _ = require('lodash');

const BYTES_IN_A_MEGABYTE = 1024 * 1024;
const ATTACHMENTS_FOOTER_PREFIX = "Please see the following link(s):";

class AttachmentsProcessor {
	constructor(config) {
		this.config = config;
	}

	async processAttachments(params) {
		const self = this;
		return new Promise((resolve, reject) => {

			const result = _.pick(params, 'text', 'html');
			result.attachments = [];
			const linksToOversizedAttachments = [];

			const attachments = params.attachments || [];

			if (!(attachments instanceof Array) || attachments.length > self.config.maxAttachments) {
				return reject({
					success: false,
					status: 400,
					message: `The "attachments" option (when present) has to be an array with no more than ${self.config.maxAttachments} attachment(s).`
				});
			}
			for (let attachment of params.attachments) {
				const contentLength = attachment.contentLength;

				if (!contentLength || !Number.isInteger(contentLength) || contentLength <= 0) {
					return reject({
						success: false,
						status: 400,
						message: `The option "attachment.contentLength" is required and has to be a positive integer.`
					});
				}
				const maxAttachmentSize = self.config.maxAttachmentSizeInMb * BYTES_IN_A_MEGABYTE;

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
					result.html += "<p>" + ATTACHMENTS_FOOTER_PREFIX + "<br>" + _.join(linksToOversizedAttachments, '<br>');
				}
			}
			return resolve(result);
		});
	}
}

module.exports = AttachmentsProcessor;