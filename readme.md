# E-Mail Sending Service

> A tiny REST API to send e-mails.

---

E-Mail Sending Service is a microservice for sending emails over a REST API.

First, create a config.json with your SMTP settings:

```json
{
    "host": "smtp.foobar.net",
    "port": 465,
    "user": "noreply",
    "pass": "foobar!"
}
```

Starting up the app is as simple as running:


```bash
npm install
node index.js
```

And presto, a mail endpoint! Let's try it out:

```bash
curl --data "to=d@me.net&subject=hi&text=hey world" http://127.0.0.1:3000/email
```

To send attachments use the nodemailer attachments syntax.
[Link to nodemailer documents](https://community.nodemailer.com/using-attachments/)

```bash
curl --data "to=d@me.net&subject=hi&text=hey world&attachments=[{\"filename\": \"text1.txt\",\"content\":\"Hello World!\"}]" http://127.0.0.1:3000/email
```

You can browse to interactive API docs at `/api`:

<p align="center"><img src="https://raw.githubusercontent.com/ClintEsteMadera/email-sending-service/master/src/img/swagger-api.png" width=700 alt="API docs logo."></p>

These docs let you add arguments, try the requests and see the results.

## API

### POST /email

Sends an email.

#### Arguments:

Required:

 - `to:` The destination email address
 - `subject:` The re: line
 - `text:` The body of the email

Optional:

 - `useSES:` Whether to use Amazon Simple Email Service or not. By default, SMTP will be assumed. Usual AWS-* environment
 variables are assumed to be present at runtime.
 - `from:` Originator
 - `html:` HTML version of the email body
 - `attachments`: one or more attachments, using [nodemailer's attachments syntax](https://community.nodemailer.com/using-attachments/)

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
