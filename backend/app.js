const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const { MONGODB } = require('./config.js');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	// CORS Policy
	res.setHeader('Access-Control-Allow-Origin', '*'); // * - Any
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.use('/api/places', placesRoutes);

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
	return next(new HttpError('Nie znaleziono adresu.', 404));
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		v;
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'Wystąpił nieznany błąd.' });
});

mongoose
	.connect(MONGODB)
	.then(() => {
		app.listen(5000);
		console.log('MongoDB connected!');
	})
	.catch((err) => {
		console.log(err);
	});
