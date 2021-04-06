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

const Auth = () => {
	const auth = useContext(AuthContext);

	const [isLoginMode, setIsLoginMode] = useState(true);

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

	const loginHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs);
		auth.login();
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
		<form className="place-form" onSubmit={loginHandler}>
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
				type="text"
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
	);
};

export default Auth;
