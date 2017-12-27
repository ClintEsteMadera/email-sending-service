"use strict";

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('..');
chai.should(); // do not remove this line unless you're sure about what you're doing.

const _ = require('lodash');

chai.use(chaiHttp);

const VALID_EMAIL = {
	"from": "jchiocchio@gmail.com",
	"to": "jchiocchio@gmail.com",
	"subject": "Sent from Mocha",
	"text": "This is a plain text body for the e-mail",
	"html": "This is an <b>html body</b> for the e-mail",
	"attachments": [
		{
			"filename": "README.md",
			"href": "https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/readme.md",
			"contentType": "application/text",
			"contentLength": 2364
		}
	],
	"customerCtx": {
		"customerId": "12345"
	}
};

describe('Email', () => {
	describe('/POST email', () => {
		it("should return a 200 OK when all params are present", (done) => {
			chai.request(server)
				.post('/email')
				.send(VALID_EMAIL)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.success.should.equal(true);
					res.body.should.have.property('info');
					done();
				});
		});

		it("should return a 200 OK when all required params are present", (done) => {
			let validPayload = _.omit(VALID_EMAIL, ["html", "attachments", "customerCtx"]);

			chai.request(server)
				.post('/email')
				.send(validPayload)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.success.should.equal(true);
					res.body.should.have.property('info');
					done();
				});
		});

		it("should return a 400 error when more than one attachment is specified", (done) => {
			let extraAttachment = {
				"filename": "swagger.json",
				"href": "https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/swagger.json",
				"contentType": "application/text",
				"contentLength": 1075
			};
			let payloadWithMoreThanOneAttachment = _.extend(VALID_EMAIL);
			payloadWithMoreThanOneAttachment.attachments.push(extraAttachment);

			chai.request(server)
				.post('/email')
				.send(payloadWithMoreThanOneAttachment)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.success.should.equal(false);
					done();
				});
		});

		it("should return a 400 error when the 'from' param is missing", (done) => {
			verifySingleMissingParamIsValidated(done, "from");
		});

		it("should return a 400 error when the 'to' param is missing", (done) => {
			verifySingleMissingParamIsValidated(done, "to");
		});

		it("should return a 400 error when the 'subject' param is missing", (done) => {
			verifySingleMissingParamIsValidated(done, "subject");
		});

		it("should return a 400 error when the 'text' param is missing", (done) => {
			verifySingleMissingParamIsValidated(done, "text");
		});

		function verifySingleMissingParamIsValidated(done, requiredParam) {
			let payloadWithRequiredFieldMissing = _.omit(VALID_EMAIL, requiredParam);

			chai.request(server)
				.post('/email')
				.send(payloadWithRequiredFieldMissing)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.length.should.equal(1);
					res.body.errors[0].messages.length.should.equal(1);
					res.body.errors[0].messages[0].should.equal(`"` + requiredParam + "\" is required");
					done();
				});
		}
	});
});
