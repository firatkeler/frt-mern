import React from "react";

import Card from "../../shared/components/UIElements/Card";

import Button from "../../shared/components/FormElements/Button";

import PlaceItem from "./PlaceItem";

import './PlaceList.css';

const PlaceList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className={"place-list center"}>
                <Card>
                    <h2>No places found, you want one?</h2>
                    <Button to={"/places/new"}>Share Place</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className={"place-list"}>
            {props.items.map(place => {
                return <PlaceItem
                    key={place.id}
                    id={place.id}
                    image={place.imageUrl}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    userId={place.userId}
                    coordinates={place.location}
                    onDelete={props.onDeletePlace}
                />
            })}
        </ul>
    );
};

export default PlaceList;
