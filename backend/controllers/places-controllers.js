const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Place = require('../models/place');

let TEMPORARY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'Jeden z najsłynniejszych wieżowców na świecie!',
		location: {
			lat: 40.75,
			lng: -73.99,
		},
		address: '20 W 34th St, New York, NY 10001',
		creator: 'uzytkownik1',
	},
	{
		id: 'p2',
		title: 'Statua Wolności',
		description:
			'Posąg na wyspie Liberty Island u ujścia rzeki Hudson do Oceanu Atlantyckiego w regionie metropolitalnym Nowego Jorku.',
		location: {
			lat: 40.69,
			lng: -74.05,
		},
		address: 'New York, NY 10004',
		creator: 'uzytkownik1',
	},
];

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	if (!place) {
		const error = new HttpError('Nie znaleziono miejsca o podanym ID.', 404);
		return next(error);
	}

	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let places;

	try {
		places = await Place.find({ creator: userId });
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	if (!places || places.length === 0) {
		const error = new HttpError(
			'Nie znaleziono miejsc dla podanego użytkownika.',
			404
		);
		return next(error);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
};

const createPlace = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new HttpError('Wprowadzone dane są niewłaściwe!');
	}

	const { title, description, coordinates, address, creator } = req.body;

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		creator,
	});

	try {
		createdPlace.save();
	} catch (err) {
		const error = new HttpError(
			'Nie udało się utworzyć miejsca, spróbuj ponownie.'
		);
		return next(error);
	}

	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new HttpError('Wprowadzone dane są niewłaściwe!');
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;

	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = Place.findById(placeId);
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	try {
		await place.remove();
	} catch (err) {
		const error = new HttpError('Coś poszło nie tak, spróbuj ponownie.', 500);
		return next(error);
	}

	res.status(200).json({ message: 'Usunięto miejsce.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
