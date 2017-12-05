'use strict';

const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const sesTransport = require('nodemailer-ses-transport');

const createTransporter = (config) => {
	let transporter = config.useSes ? createSESTransport() : createSMTPTransport(config);

	return nodemailer.createTransport(transporter);
};

const createSESTransport = () => {
	// key and secret retrieval will be attempted (in order):
	// 1. from AWS Identity and Access Management (IAM) roles for Amazon EC2 (if running on Amazon EC2)
	// 2. from the shared credentials file (~/.aws/credentials), using the profile indicated by AWS_DEFAULT_PROFILE or "default".
	// 3. from environment variables (default prefix: "AWS")
	// 4. from a JSON file on disk (e.g. AWS.config.loadFromPath(<config file path>);)
	// relevant properties are:
	let sesObj = new AWS.SES({
		apiVersion: '2010-12-01'
	});
	return sesTransport({ses: sesObj});
};

const createSMTPTransport = (config) => {
	let smtpTransport = {
		host: config.smtpHost,
		port: config.smtpPort,
		secure: config.smtpSecure,
		connectionTimeout: 5000
	};
	let useAuth = config.smtpUser !== undefined && config.smtpPass !== undefined;

	if (useAuth) {
		smtpTransport.auth = {
			user: config.smtpUser,
			pass: config.smtpPass
		}
	}
	return smtpTransport;
};

module.exports = {
	createTransporter
};