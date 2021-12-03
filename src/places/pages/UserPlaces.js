import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';

import PlaceList from "../components/PlaceList";

import {useHttpClient} from "../../shared/hooks/http-hook";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the famous buildings in the world',
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg',
//         address: '20 W 34th St, New York, NY 10001, USA',
//         location: {
//             lat: 40.748817,
//             lng: -73.985428,
//         },
//         userId: 'u1',
//     },
//     {
//         id: 'p2',
//         title: 'Time Square',
//         description: 'A really famous square',
//         imageUrl: 'https://cdn.britannica.com/66/154566-050-36E73C15/Times-Square-New-York-City.jpg',
//         address: 'Manhattan, NY 10036, USA',
//         location: {
//             lat: 40.757974,
//             lng: -73.987731,
//         },
//         userId: 'u2',
//     }
// ];

const UserPlaces = () => {
    const userId = useParams().userId;

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [loadedPlaces, setLoadedPlaces] = useState();

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.userId === userId);

    useEffect(() => {
        const getData = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places/user/' + userId);

                setLoadedPlaces(responseData.places);
            }
            catch (error) {

            }
        };
        getData();
    }, [userId, sendRequest]);

    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(places => places.id !== deletedPlaceId));
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div className={"center"}><LoadingSpinner /></div>)}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>
    );
};

export default UserPlaces;
