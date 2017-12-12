const winston = require('winston');
const camelCase = require('camelcase');

class ConfigLoader {

	loadConfig() {
		const prefix = 'EMAIL_SENDING_SERVICE';
		const requiredProperties = ['WEB_PORT', 'USE_SES', 'MAX_ATTACHMENTS', 'MAX_ATTACHMENT_SIZE_IN_MB'];
		const smtpProperties = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS'];
		const awsProperties = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'];
		const allProperties = requiredProperties.concat(smtpProperties);

		const config = {};
		allProperties.forEach(prop => {
			const envVariableName = `${prefix}_${prop}`;

			const value = this._readEnvVariable(envVariableName);
			if (!this._configValueIsEmptyOrAbsent(value)) {
				config[camelCase(prop)] = value;
			}
		});

		const missing = (config.useSes ? requiredProperties : allProperties).filter(prop => {
			return this._configValueIsEmptyOrAbsent(config[camelCase(prop)]);
		});

		if (config.useSes) {
			awsProperties.forEach(awsProperty => {
				if (!this._readEnvVariable(awsProperty)) {
					missing.push(awsProperty);
				}
			});
		}

		if (missing.length > 0) {
			throw new Error(`Missing (or empty) environment variables: ${missing.join(', ')}`);
		}
		winston.log('info', '\nUsing:', JSON.stringify(config, null, 2));

		return config;
	}

	/**
	 * Reads an environment variable, attempting to first coherce to number or boolean, if possible.
	 * @param envVariableName the env variable name to read
	 * @returns {*} the value for that property as a string, number or boolean (only if it matches either "true" or "false"), or undefined if it's not present.
	 * @private
	 */
	_readEnvVariable(envVariableName) {
		const value = process.env[envVariableName];

		if (this._isOnlyDigits(value)) {
			return parseInt(value);
		}
		switch (value) {
			case "true":
			case "false":
				return value === "true";
			default:
				return value;
		}
	}

	_configValueIsEmptyOrAbsent(value) {
		return (typeof value !== 'boolean') && !value;
	}

	_isOnlyDigits(string) {
		return /^[0-9]+$/.test(string);
	}
}

module.exports = ConfigLoader;
