import express from 'express';

import logger from 'morgan';

import cors from 'cors';

import dotenv from 'dotenv';

import usersRouter from './routes/userRouter.js';

import authRouter from './routes/authRouter.js';

import waterRouter from './routes/waterRouter.js';

// SWAGGER

import swaggerui from 'swagger-ui-express';

import swaggerJSDoc from 'swagger-jsdoc';

import { createRequire } from 'module'; // Bring in the ability to create the 'require' method

const require = createRequire(import.meta.url); // construct the require method
const swaggerDocument = require('./swagger.json'); // use the require method

const app = express();

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

// SWAGGER

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/water', waterRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'Server error' } = err;
	res.status(statusCode).json({ message });
});

// app.get('/', (request, response) => {
// 	response.send(0);
// });

// app.get('/water', (request, response) => {});

// app.post('/user', (request, response) => {});

export default app;
