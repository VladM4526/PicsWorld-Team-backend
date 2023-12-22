import express from 'express';

const app = express();

import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (request, response) => {
	response.send(0);
});

app.get('/water', (request, response) => {});

app.post('/user', (request, response) => {});

app.listen(3001, () => console.log('Server running on 3001 PORT'));
