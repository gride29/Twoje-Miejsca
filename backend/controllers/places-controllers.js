const { v4: uuidv4 } = require('uuid');

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
	const placeId = req.params.pid;
	const place = TEMPORARY_PLACES.find((place) => {
		return place.id === placeId;
	});

	if (!place) {
		return next(new HttpError('Nie znaleziono miejsca o podanym ID.', 404));
	}

	res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
	const userId = req.params.uid;
	const places = TEMPORARY_PLACES.filter((place) => {
		return place.creator === userId;
	});

	if (!places || places.length === 0) {
		return next(
			new HttpError('Nie znaleziono miejsc dla podanego użytkownika.', 404)
		);
	}

	res.json({ places });
};

const createPlace = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new HttpError('Wprowadzone dane są niewłaściwe!');
	}

	const { title, description, coordinates, address, creator } = req.body;

	const createdPlace = {
		id: uuidv4(),
		title,
		description,
		location: coordinates,
		address,
		creator,
	};

	TEMPORARY_PLACES.push(createdPlace);

	res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new HttpError('Wprowadzone dane są niewłaściwe!');
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	const updatedPlace = {
		...TEMPORARY_PLACES.find((place) => place.id === placeId),
	};

	const placeIndex = TEMPORARY_PLACES.findIndex(
		(place) => place.id === placeId
	);

	updatedPlace.title = title;
	updatedPlace.description = description;

	TEMPORARY_PLACES[placeIndex] = updatedPlace;

	res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
	const placeId = req.params.pid;

	if (!TEMPORARY_PLACES.find((place) => place.id === placeId)) {
		throw new HttpError('Nie znaleziono miejsca o podanym ID.', 404);
	}

	TEMPORARY_PLACES = TEMPORARY_PLACES.filter((place) => place.id !== placeId);
	res.status(200).json({ message: 'Usunięto miejsce.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
