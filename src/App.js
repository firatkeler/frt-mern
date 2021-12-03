import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";

import {AuthContext} from "./shared/context/auth-context";

import MainNavigation from "./shared/components/Navigation/MainNavigation";

import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

// import Auth from "./user/pages/Auth";
// import Users from "./user/pages/Users";
// import UserPlaces from "./places/pages/UserPlaces";
// import NewPlace from "./places/pages/NewPlace";
// import UpdatePlace from "./places/pages/UpdatePlace";

import {useAuth} from "./shared/hooks/auth-hook";

const Auth = React.lazy(() => import("./user/pages/Auth"));
const Users = React.lazy(() => import("./user/pages/Users"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));

const App = () => {
    const {token, userId, login, logout} = useAuth();

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path={"/"} exact={true}>
                    <Users />
                </Route>
                <Route path={"/:userId/places"} exact={true}>
                    <UserPlaces />
                </Route>
                <Route path={"/places/new"} exact={true}>
                    <NewPlace />
                </Route>
                <Route path={"/places/:placeId"} exact={true}>
                    <UpdatePlace />
                </Route>
                <Redirect to={"/"} />
            </Switch>
        );
    }
    else {
        routes = (
            <Switch>
                <Route path={"/"} exact={true}>
                    <Users />
                </Route>
                <Route path={"/:userId/places"} exact={true}>
                    <UserPlaces />
                </Route>
                <Route path={"/auth"} exact={true}>
                    <Auth />
                </Route>
                <Redirect to={"/auth"} />
            </Switch>
        );
    }

  return (
      <AuthContext.Provider
          value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout}}
      >
          <Router>
              <MainNavigation />
              <main>
                  <Suspense fallback={<div className={"center"}><LoadingSpinner /></div>}>
                    {routes}
                  </Suspense>
              </main>
          </Router>
      </AuthContext.Provider>
  );
};

export default App;
