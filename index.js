const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const winston = require('winston');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const middleware = require('./middleware');
const routes = require('./src/routes');
const ConfigLoader = require('./src/config-loader');

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());		// must parse body before morganBody as body will be logged
app.use(morgan('dev')); // TODO Change this to 'tiny' when going live
morganBody(app);
middleware.call(app);

try {
	const config = new ConfigLoader().loadConfig();
	app.listen(config.webPort);
	routes(app, config);
} catch(err) {
	winston.log('error', err.message);
	process.exit();
}

winston.log('info', 'E-Mail Sending Service has started.');
