import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import Button from '../FormElements/Button';
import './NavLinks.css';

const NavLinks = (props) => {
	const auth = useContext(AuthContext);

	return (
		<ul className="nav-links">
			<li>
				<NavLink to="/" exact>
					WSZYSCY UŻYTKOWNICY
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<li>
					<NavLink to={`/${auth.userId}/places`} exact>
						MOJE MIEJSCA
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<NavLink to="/places/new" exact>
						DODAJ MIEJSCE
					</NavLink>
				</li>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to="/auth" exact>
						UWIERZYTELNIJ
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<Button logout onClick={auth.logout}>
						WYLOGUJ
					</Button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
