module.exports = {
	"Email": [
		{
			verb: 'POST',
			route: "/email",
			title: "Send an email",
			description: "Sends an email using the configured transport (Amazon SES or SMTP)",
			queries: {
				"from": {
					description: 'Sender email address.', 
					optional: true
				},
				"to": {
					description: 'Recipient email address(es).', 
					optional: false
				},
				"subject": {
					description: 'Email subject.', 
					optional: false
				},
				"text": {
					description: 'Text version of the email.', 
					optional: false
				},
				"html": {
					description: 'HTML version of the email.', 
					optional: true
				},
				"attachments": {
					"type": "object",
					"description": "an array of attachment objects.",
					"properties": {
						"filename": {
							"description": "filename to be reported as the name of the attached file. Use of unicode is allowed."
						},
						"href": {
							"description": "an URL to the file (data uris are allowed as well)"
						}
					}
				}
			}
		}
	]
};
