import React, {useState, useEffect} from "react";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import UsersList from "../components/UsersList";

import {useHttpClient} from "../../shared/hooks/http-hook";

const Users = () => {
    // const USERS = [
    //     {id: 'u1', name: 'Firat Keler', image: 'https://image.freepik.com/free-vector/person-avatar-design_24877-38137.jpg', places: 3},
    // ];
    const [loadedUsers, setLoadedUsers] = useState();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const getData = async () => {

            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');

                setLoadedUsers(responseData.users);
            }
            catch (error) {

            }
        };
        getData();
    }, [sendRequest]);

    return (
        // <UsersList items={USERS} />
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div className={"center"}><LoadingSpinner /></div>)}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};

export default Users;
