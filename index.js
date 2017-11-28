const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const swagpi = require('swagpi');

const swagpiConfig = require('./src/swagpi.config.js');
const middleware = require('./middleware');
const loadConfig = require('./src/util/loadConfig');
const routes = require('./src/routes');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
middleware.call(app);

swagpi(app, {
	logo: './src/img/logo.png',
	css: 'img { width: 96px !important; margin-top: 8px !important; }',
	config: swagpiConfig
});

try {
	const config = loadConfig();
	app.listen(config.webPort || 3000);
	routes(app, config);
} catch(err) {
	winston.log('error', err.message);
	process.exit();
}

winston.log('info', 'E-Mail Sending Service has started.');
