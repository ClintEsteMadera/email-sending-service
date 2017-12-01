# E-Mail Sending Service

> A tiny REST API to send e-mails.

---

E-Mail Sending Service is a microservice for sending emails over a REST API.

Starting up the app is as simple as running:

```bash
npm install
node index.js
```

And presto, a mail endpoint! Let's try it out:

```bash
curl -X POST "http://localhost:3000/email" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"from\": \"sender@mymail.com\", \"to\": \"recipient@mymail.com\", \"subject\": \"I'm sending e-mails, yo!\", \"text\": \"This is my super important e-mail!\"}"
```

To send attachments, we use a subset of the [nodemailer attachments syntax](https://community.nodemailer.com/using-attachments/). Example:

```bash
curl -X POST "http://localhost:3000/email" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"from\": \"sender@mymail.com\", \"to\": \"recipient@mymail.com\", \"subject\": \"I'm sending e-mails with attachments, yo!\", \"text\": \"See attached file.\", \"attachments\": [ { \"filename\": \"README.md\", \"href\": \"https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/readme.md\", \"contentType\": \"application/text\", \"contentLength\": 2364 } ]}"
```

You peruse the interactive API docs and even try all the requests and see the results at `/api-docs`:

<p align="center"><img src="https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/src/img/swagger-api.png" width=700></p>
<p align="center"><img src="https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/src/img/swagger-api-2.png" width=700></p>

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
 - `attachments`: one or more attachments, using a subset of the [nodemailer's attachments syntax](https://community.nodemailer.com/using-attachments/)
 - `useSES:` Whether to use Amazon Simple Email Service or not. By default, SMTP will be assumed. Usual AWS-* environment
 variables are assumed to be present at runtime.

## Configuration as environment variables:

```bash
export EMAIL_SENDING_SERVICE_WEBPORT=[web-port]
export EMAIL_SENDING_SERVICE_USESES=[path-to-config.json]
export EMAIL_SENDING_SERVICE_HOST=[host]
export EMAIL_SENDING_SERVICE_PORT=[port]
export EMAIL_SENDING_SERVICE_SECURE=[boolean]
export EMAIL_SENDING_SERVICE_USER=[user]
export EMAIL_SENDING_SERVICE_PASS=[pass]
export EMAIL_SENDING_SERVICE_REJECTUNAUTHORIZED=[boolean]
```

## Auth

This service defaults to no authentication.

E-Mail Sending Service uses Express. The file ./middleware.js at the root of the directory exposes the app so you can add middleware hooks for auth logic.

## Requirements

 - Node.js 7+
