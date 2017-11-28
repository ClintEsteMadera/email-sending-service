const winston = require('winston');
const config = require('../../config.json');

module.exports = () => {
	const vendor = 'EMAIL_SENDING_SERVICE';
	const fields = ['webPort', 'useSES', 'host', 'port', 'secure', 'user', 'pass', 'rejectUnauthorized'];
	const required = ['host', 'port'];

	fields.forEach(field => {
		const property = `${vendor}_${field}`.toUpperCase();
		if (process.env[property] !== undefined) {
			config[field] = process.env[property];
		}
	});

	const missing = required.filter(field => {
		return !config[field];
	});

	if (missing.length > 0) {
		throw new Error(`No ${missing.join(', ')} specified in config.`);
	}
	winston.log('info', '');
	winston.log('info', 'Using:');
	Object.keys(config).forEach(item => {
		winston.log('info', `  ${item}: ${config[item]}`);
	});
	winston.log('info', '');

	return config;
};
