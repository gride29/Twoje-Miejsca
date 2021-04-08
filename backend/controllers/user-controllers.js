const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const TEMPORARY_USERS = [
	{
		id: 'uzytkownik1',
		name: 'Tomasz Kowalski',
		email: 'tomasz@test.com',
		password: 'test',
	},
	{
		id: 'uzytkownik2',
		name: 'Jan Nowak',
		email: 'jan@test.com',
		password: '1234',
	},
];

const getUsers = (req, res, next) => {
	res.json({ users: TEMPORARY_USERS });
};

const signup = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new HttpError('Wprowadzone dane są niewłaściwe!');
	}

	const { name, email, password } = req.body;

	const hasUser = TEMPORARY_USERS.find((user) => {
		return user.email === email;
	});

	if (hasUser) {
		throw new HttpError(
			'Nie udało się zarejestrować, użytkownik o podanym adresie email już istnieje.',
			422
		);
	}

	const createdUser = {
		id: uuidv4(),
		name,
		email,
		password,
	};

	TEMPORARY_USERS.push(createdUser);
	res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
	const { email, password } = req.body;

	const identifiedUser = TEMPORARY_USERS.find((user) => {
		return user.email === email;
	});

	if (!identifiedUser || identifiedUser.password !== password) {
		throw new HttpError(
			'Nie znaleziono użytkownika o podanym adresie email i haśle.',
			401
		);
	}
	res.json({ message: 'Zalogowano!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
