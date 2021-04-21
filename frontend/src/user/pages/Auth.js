import React, { useState, useContext } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
	VALIDATOR_MINLENGTH,
	VALIDATOR_EMAIL,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import '../../places/pages/PlaceForm.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Auth = () => {
	const auth = useContext(AuthContext);

	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: '',
				isValid: false,
			},
			password: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const loginHandler = async (event) => {
		event.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					'http://localhost:5000/api/users/login',
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				auth.login(responseData.user.id);
			} catch (err) {}
		} else {
			try {
				const responseData = await sendRequest(
					'http://localhost:5000/api/users/signup',
					'POST',
					JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						'Content-Type': 'application/json',
					}
				);
				auth.login(responseData.user.id);
			} catch (err) {}
		}
	};

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form className="place-form" onSubmit={loginHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2 style={{ textAlign: 'center' }}>
					{isLoginMode ? 'ZALOGUJ SIĘ' : 'ZAREJESTRUJ SIĘ'}
				</h2>
				<hr />
				{!isLoginMode && (
					<Input
						element="input"
						id="name"
						type="text"
						label="Imię"
						validators={[VALIDATOR_REQUIRE()]}
						errorText="Proszę o wprowadzenie imienia"
						onInput={inputHandler}
					/>
				)}
				<Input
					id="email"
					element="input"
					type="text"
					label="Email"
					validators={[VALIDATOR_EMAIL()]}
					errorText="Proszę o wpisanie poprawnego emailu"
					onInput={inputHandler}
				/>
				<Input
					id="password"
					element="input"
					type="password"
					label="Hasło"
					validators={[VALIDATOR_MINLENGTH(6)]}
					errorText="Proszę o wpisanie poprawnego hasła, conajmniej 6 znaków"
					onInput={inputHandler}
				/>
				<Button type="submit" disabled={!formState.isValid}>
					{isLoginMode ? 'ZALOGUJ' : 'ZAREJESTRUJ'}
				</Button>
				<Button type="button" onClick={switchModeHandler}>
					PRZEŁĄCZ NA {isLoginMode ? 'ZAREJESTRUJ' : 'ZALOGUJ'}
				</Button>
			</form>
		</React.Fragment>
	);
};

export default Auth;
