const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Nie udało się pobrać listy użytkowników.',
			500
		);
		return next(error);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error = new HttpError('Wprowadzone dane są niewłaściwe!');
		return next(error);
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Nie udało się zarejestrować użytkownika, spróbuj ponownie.',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError('Użytkownik już istnieje.', 500);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image: 'https://semantic-ui.com/images/avatar2/small/matthew.png',
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Nie udało się utworzyć użytkownika.', 500);
		return next(error);
	}

	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Nie udało się zalogować, spróbuj ponownie.',
			500
		);
		return next(error);
	}

	if (!existingUser || existingUser.password !== password) {
		const error = new HttpError('Podany email lub hasło są nieprawidłowe.');
		return next(error);
	}

	res.json({ message: 'Zalogowano!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
