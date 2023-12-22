import express from 'express';

// SWAGGER

import swaggerui from 'swagger-ui-express';

import swaggerJSDoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '5.0.0',
		info: {
			title: 'PicsWorldProject API',
			version: '1.0.0',
			description: 'Documentation for PicsWorldProject',
		},
		servers: [
			{
				url: 'http://localhost:3001',
			},
		],
	},
	apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

const app = express();

app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

// SWAGGER

app.get('/', (request, response) => {
	response.send(0);
});

app.get('/water', (request, response) => {});

app.post('/user', (request, response) => {});

app.listen(3001, () => console.log('Server running on 3001 PORT'));
