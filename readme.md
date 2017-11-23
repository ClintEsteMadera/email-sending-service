# Mailit

> A tiny drop-in REST API to send emails.

---

Mailit is a drop-in microservice for sending emails over a REST API.

First, create a config.json with your SMTP settings:

```json
{
    "host": "smtp.foobar.net",
    "port": 465,
    "user": "noreply",
    "pass": "foobar!"
}
```

Install the app and start it up to point at the config:


```bash
npm i mailit -g
mailit --config /path/to/config.json
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

<p align="center"><img src="https://raw.githubusercontent.com/thoughtbrew/img/master/mailit-api.png" width=700 alt="Screenshot of API docs for Addict."></p>

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

## Passing Secrets

Though it's not recommended, you can also pass the details at runtime:

```bash
mailit --host [host] --port [smtp-port] --user [user] --pass [pass] --webPort [port]
```

Or reference the `config.json`:

```bash
mailit --config [path-to-config.json]
```

As environment variables:

```bash
export PORT=[web-port]
export MAILIT_CONFIG=[path-to-config.json]
export MAILIT_HOST=[host]
export MAILIT_PORT=[port]
export MAILIT_USER=[user]
export MAILIT_PASS=[pass]
export MAILIT_SECURE=[boolean]
export MAILIT_REJECTUNAUTHORIZED=[boolean]
```

You can [run it from docker as well](https://hub.docker.com/r/dthree/mailit/), using environmental variables or passing it the `config.json`.

## Auth

This service defaults to no authentication. I can't and won't try to guess your flavor.

Mailit uses express. The file ./middleware.js at the root of the directory exposes the app so you can add middleware hooks for auth logic.

## Why?

 - Security. Mailit can act as a relay for a secured environment so emails can be sent. Opening a REST API over HTTP to a DMZ can be better than opening several email ports directly outbound.

 - Holy Wars. Instead of arguing over which language to write that SMTP relay in, we can skip it and use a REST API.

 - Microservices. Keep that monolith at bay.

 - I'll probably add more functionality later. This is what I need right now.

## Requirements

 - Node.js 7+

## License

MIT

