import React, {useState, useContext} from "react";

import {AuthContext} from "../../shared/context/auth-context";

import Card from "../../shared/components/UIElements/Card";

import Button from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UIElements/Modal";

import Map from "../../shared/components/UIElements/Map";

import {useHttpClient} from "../../shared/hooks/http-hook";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import './PlaceItem.css';

const PlaceItem = (props) => {
    const auth = useContext(AuthContext);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

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

    const hideDeleteWarningHandler = () => {
        setShowConfirmModal(false);
    };

    const deleteHandler = async () => {
        setShowConfirmModal(false);

        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/places/' + props.id,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            );

            props.onDelete(props.id);

        }
        catch (error) {

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClassName={"place-item__modal-content"}
                footerClassName={"place-item__modal-actions"}
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className={"map-container"}>
                    <Map center={props.coordinates} zoom={18} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal}
                onCancel={hideDeleteWarningHandler}
                header={"Are You Sure?"}
                footerClassName={"place-item__modal-actions"}
                footer={
                    <React.Fragment>
                        <Button inverse onClick={hideDeleteWarningHandler}>CANCEL</Button>
                        <Button danger onClick={deleteHandler}>DELETE</Button>
                    </React.Fragment>
                }
            >
                <p>Do you want to proceed and delete this place?</p>
            </Modal>
            <li className={"place-item"}>
                <Card className={"place-item__content"}>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className={"place-item__imag"}>
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className={"place-item__info"}>
                        <h2>{props.title}</h2>
                        <h2>{props.address}</h2>
                        <p>{props.description}</p>
                    </div>
                    <div className={"place-item__actions"}>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn && auth.userId === props.userId ? (<Button to={`/places/${props.id}`}>EDIT</Button>) : null}
                        {auth.isLoggedIn && auth.userId === props.userId ? (<Button danger onClick={showDeleteWarningHandler}>DELETE</Button>) : null}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

export default PlaceItem;
