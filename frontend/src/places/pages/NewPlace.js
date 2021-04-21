import React, { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router-dom';

const NewPlace = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const auth = useContext(AuthContext);

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
		lat: {
			value: '',
			isValid: false,
		},
		lng: {
			value: '',
			isValid: false,
		},
	});

	const history = useHistory();

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				'http://localhost:5000/api/places',
				'POST',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
					address: formState.inputs.address.value,
					coordinates: {
						lat: formState.inputs.lat.value,
						lng: formState.inputs.lng.value,
					},
					creator: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
				}
			);
			history.push('/');
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className="place-form" onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
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
				<Input
					id="lat"
					type="number"
					element="input"
					label="Szerokość geograficzna"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Proszę o wpisanie poprawnego adresu"
					onInput={inputHandler}
				/>
				<Input
					id="lng"
					type="number"
					element="input"
					label="Wysokość geograficzna"
					validators={[VALIDATOR_REQUIRE()]}
					errorText="Proszę o wpisanie poprawnego adresu"
					onInput={inputHandler}
				/>
				<Button type="submit" disabled={!formState.isValid}>
					DODAJ MIEJSCE
				</Button>
			</form>
		</React.Fragment>
	);
};

export default NewPlace;
