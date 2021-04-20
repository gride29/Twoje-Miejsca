const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);

app.use('/api/users', userRoutes);

app.use((req, res, next) => {
	return next(new HttpError('Nie znaleziono adresu.', 404));
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'Wystąpił nieznany błąd.' });
});

mongoose
	.connect(
		'mongodb+srv://gride:9VyKsZCA3G2RJwpN@cluster1.qec8u.mongodb.net/places?retryWrites=true&w=majority'
	)
	.then(() => {
		app.listen(5000);
		console.log('MongoDB connected!');
	})
	.catch((err) => {
		console.log(err);
	});
