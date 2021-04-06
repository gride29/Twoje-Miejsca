import React from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

const NewPlace = () => {
	const [formState, inputHandler] = useForm({
		title: {
			value: '',
			isValid: false,
		},
		description: {
			value: '',
			isValid: false,
		},
		address: {
			value: '',
			isValid: false,
		},
	});

	const placeSubmitHandler = (event) => {
		event.preventDefault();
	};

	return (
		<form className="place-form" onSubmit={placeSubmitHandler}>
			<Input
				id="title"
				element="input"
				type="text"
				label="Tytuł"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="Proszę o wpisanie poprawnego tytułu"
				onInput={inputHandler}
			/>
			<Input
				id="description"
				element="textarea"
				label="Opis"
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText="Opis musi zawierać conajmniej 5 znaków"
				onInput={inputHandler}
			/>
			<Input
				id="address"
				element="input"
				label="Adres"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="Proszę o wpisanie poprawnego adresu"
				onInput={inputHandler}
			/>
			<Button type="submit" disabled={!formState.isValid}>
				DODAJ MIEJSCE
			</Button>
		</form>
	);
};

export default NewPlace;
