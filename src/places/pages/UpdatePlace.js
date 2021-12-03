import React, {useState, useEffect, useContext} from "react";

import {useHistory} from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";

import Card from "../../shared/components/UIElements/Card";

import Button from "../../shared/components/FormElements/Button";

import {useParams} from "react-router-dom";

import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from "../../shared/util/validators";

import {useForm} from "../../shared/hooks/form-hook";

import {useHttpClient} from "../../shared/hooks/http-hook";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {AuthContext} from "../../shared/context/auth-context";

import './PlaceForm.css';
//
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

const UpdatePlace = (props) => {
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm({
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
    }, false);

    // const loadedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    const [loadedPlace, setLoadedPlace] = useState([]);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const auth = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        const getData = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places/' + placeId);

                setLoadedPlace(responseData.place);
            }
            catch (error) {

            }
        };
        getData();
    }, [placeId, sendRequest]);

    useEffect(() => {
        if (loadedPlace) {
            setFormData({
                title: {
                    value: loadedPlace.title,
                    isValid: true,
                },
                description: {
                    value: loadedPlace.description,
                    isValid: true,
                },
                address: {
                    value: loadedPlace.address,
                    isValid: true,
                },
            }, true);
        }
    }, [setFormData, loadedPlace]);

    const placeSubmitHandler =  async (event) => {
        event.preventDefault();

        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/places/' + placeId,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            history.push('/' + auth.userId + '/places');
        }
        catch (error) {

        }

    };

    if (!isLoading && !loadedPlace && !error) {
        return (
            <div className={"center"}>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <form className={"place-form"} onSubmit={placeSubmitHandler}>
                <Input
                    id={"title"}
                    element={"input"}
                    label={"Title"}
                    type={"text"}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText={"Please enter a valid title"}
                    onInput={inputHandler}
                    value={formState.inputs.title.value}
                    valid={formState.inputs.title.isValid}
                />
                <Input
                    id={"description"}
                    element={"textarea"}
                    label={"Description"}
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText={"Please enter a valid description (at least 5 chars)"}
                    onInput={inputHandler}
                    value={formState.inputs.description.value}
                    valid={formState.inputs.description.isValid}
                />
                <Input
                    id={"address"}
                    element={"input"}
                    label={"Address"}
                    validators={[VALIDATOR_REQUIRE(5)]}
                    errorText={"Please enter a valid address"}
                    onInput={inputHandler}
                    value={formState.inputs.address.value}
                    valid={formState.inputs.address.isValid}
                />
                <Button type={"submit"} disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>
        </React.Fragment>
    );
};

export default UpdatePlace;
