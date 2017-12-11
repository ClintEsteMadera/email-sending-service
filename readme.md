# E-Mail Sending Service

> A tiny REST API to send e-mails.

---

Microservice for sending emails over a REST API.

## Configuration

The microservice is configured entirely through environment variables:

Required:

```bash
AWS_ACCESS_KEY_ID=[aws_access_key]
AWS_SECRET_ACCESS_KEY=[aws_secret_key]
AWS_REGION=[aws_region]
EMAIL_SENDING_SERVICE_WEB_PORT=[web-listening-port]
EMAIL_SENDING_SERVICE_USE_SES=[boolean]
EMAIL_SENDING_SERVICE_MAX_ATTACHMENT_SIZE_IN_MB=[number]
```

Required only when using an SMTP transport:

```bash
EMAIL_SENDING_SERVICE_SMTP_HOST=[host]
EMAIL_SENDING_SERVICE_SMTP_PORT=[port]
EMAIL_SENDING_SERVICE_SMTP_SECURE=[boolean]
EMAIL_SENDING_SERVICE_SMTP_USER=[user]
EMAIL_SENDING_SERVICE_SMTP_PASS=[pass]
```

## Start up

Setting up and starting up the app is as simple as running:

```bash
npm install
node index.js
```

## Usage Examples

Sending a simple e-mail without attachments:

```bash
curl -X POST "http://localhost:3000/email" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"from\": \"sender@mymail.com\", \"to\": \"recipient@mymail.com\", \"subject\": \"I'm sending e-mails, yo!\", \"text\": \"This is my super important e-mail!\"}"
```

To send attachments, the service uses a subset of the [nodemailer attachments syntax](https://community.nodemailer.com/using-attachments/). Example:

```bash
curl -X POST "http://localhost:3000/email" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"from\": \"sender@mymail.com\", \"to\": \"recipient@mymail.com\", \"subject\": \"I'm sending e-mails with attachments, yo!\", \"text\": \"See attached file.\", \"attachments\": [ { \"filename\": \"README.md\", \"href\": \"https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/readme.md\", \"contentType\": \"application/text\", \"contentLength\": 2364 } ]}"
```

Through the interactive API docs (at `/api-docs`), you can inspect and run all the requests:

<p align="center"><img src="https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/img/swagger-api.png" width=700></p>
<p align="center"><img src="https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/img/swagger-api-2.png" width=700></p>

## API

### POST /email

Sends an email.

#### Arguments:

The request expects a JSON payload in the body of the POST request. The relevant parameters are:

Required:

 - `to:` The destination email address
 - `subject:` The re: line
 - `text:` The body of the email

Optional:

 - `from:` Originator
 - `html:` HTML version of the email body. If present, this parameter takes precedence over whatever is conveyed by the `text` parameter.
 - `attachments`: one or more attachments. See the interactive documentation for further detail.

## Auth

This service defaults to no authentication.

E-Mail Sending Service uses Express. The file `middleware.js` at the root of the directory exposes the app so you can add middleware hooks for auth logic.

## Requirements

 - Node.js 7+
