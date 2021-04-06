import React from 'react';
import UsersList from '../components/UserList';

const Users = () => {
	const USERS = [
		{
			id: 'uzytkownik1',
			name: 'Tomasz Kowalski',
			image: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
			places: 1,
		},
	];

	return <UsersList items={USERS} />;
};

export default Users;
