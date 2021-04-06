import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';

const PlaceItem = (props) => {
	const auth = useContext(AuthContext);

	const [showMap, setShowMap] = useState(false);

	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const openMapHandler = () => {
		setShowMap(true);
	};

	const closeMapHandler = () => {
		setShowMap(false);
	};

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = () => {
		setShowConfirmModal(false);
		console.log('USUWANIE...');
	};

	return (
		<React.Fragment>
			<Modal
				show={showMap}
				onCancel={cancelDeleteHandler}
				header={props.address}
				contentClass="place-item__modal-content"
				footerClass="place-item__modal-actions"
				footer={<Button onClick={closeMapHandler}>ZAMKNIJ</Button>}
			>
				<div className="map-container">
					<Map center={props.coordinates} zoom={16} />
				</div>
			</Modal>
			<Modal
				show={showConfirmModal}
				onCancel={showDeleteWarningHandler}
				header="Czy jesteś pewien?"
				footerClass="place-item__modal-actions"
				footer={
					<React.Fragment>
						<Button inverse onClick={cancelDeleteHandler}>
							ANULUJ
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							USUŃ
						</Button>
					</React.Fragment>
				}
			>
				<p>Czy na pewno chcesz usunąć miejsce? Operacji nie można cofnąć.</p>
			</Modal>
			<li className="place-item">
				<Card className="place-item__content">
					<div className="place-item__image">
						<img src={props.image} alt={props.title} />
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className="place-item__actions">
						<Button onClick={openMapHandler}>ZOBACZ NA MAPIE</Button>
						{auth.isLoggedIn && (
							<Button to={`/places/${props.id}`}>EDYTUJ</Button>
						)}
						{auth.isLoggedIn && (
							<Button danger onClick={showDeleteWarningHandler}>
								USUŃ
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
