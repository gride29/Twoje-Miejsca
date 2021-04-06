import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

export const TEMPORARY_PLACES = [
	{
		id: 'p1',
		title: 'Empire State Building',
		description: 'Jeden z najsłynniejszych wieżowców na świecie!',
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
		address: '20 W 34th St, New York, NY 10001',
		location: {
			lat: 40.75,
			lng: -73.99,
		},
		creator: 'uzytkownik1',
	},
	{
		id: 'p2',
		title: 'Madison Square Garden',
		description:
			'Hala sportowo-widowiskowa znajdująca się w Nowym Jorku w Stanach Zjednoczonych.',
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Madison_Square_Garden_%28MSG%29_-_Full_%2848124330357%29.jpg/1200px-Madison_Square_Garden_%28MSG%29_-_Full_%2848124330357%29.jpg',
		address: '20 W 34th St, New York, NY 10001',
		location: {
			lat: 40.75,
			lng: -73.99,
		},
		creator: 'uzytkownik2',
	},
];

const UserPlaces = (props) => {
	const userId = useParams().userId;
	const loadedPlaces = TEMPORARY_PLACES.filter(
		(place) => place.creator === userId
	);
	return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
