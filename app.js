import express from 'express';

const app = express();

app.get('/', (request, response) => {
	response.send(0);
});

app.get('/water', (request, response) => {});

app.post('/user', (request, response) => {});

app.listen(3001, () => console.log('Server running on 3001 PORT'));
