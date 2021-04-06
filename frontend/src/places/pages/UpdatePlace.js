import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TEMPORARY_PLACES } from './UserPlaces';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import './PlaceForm.css';

const UpdatePlace = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const identifiedPlace = TEMPORARY_PLACES.find((p) => p.id === placeId);

	useEffect(() => {
		if (identifiedPlace) {
			setFormData(
				{
					title: {
						value: identifiedPlace.title,
						isValid: true,
					},
					description: {
						value: identifiedPlace.description,
						isValid: true,
					},
				},
				true
			);
		}

		setIsLoading(false);
	}, [setFormData, identifiedPlace]);

	const placeUpdateSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
	};

	if (!identifiedPlace) {
		return (
			<div className="center">
				<Card>
					<h2>Nie znaleziono miejsca!</h2>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="center">
				<Card>
					<h2>Ładowanie...</h2>
				</Card>
			</div>
		);
	}

	return (
		<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
			<Input
				id="title"
				element="input"
				type="text"
				label="Tytuł"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="Proszę o wpisanie poprawnego tytułu"
				onInput={inputHandler}
				value={formState.inputs.title.value}
				valid={formState.inputs.title.isValid}
			/>
			<Input
				id="description"
				element="textarea"
				label="Opis"
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText="Opis musi zawierać conajmniej 5 znaków"
				onInput={inputHandler}
				value={formState.inputs.description.value}
				valid={formState.inputs.description.isValid}
			/>
			<Button type="submit" disabled={!formState.isValid}>
				ZAPISZ
			</Button>
		</form>
	);
};

export default UpdatePlace;
