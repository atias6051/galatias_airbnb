import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/AllSpots";
import SpotShow from "./components/SpotShow";
import NewSpotForm from "./components/NewSpotForm";
import CurrentUserSpots from "./components/CurrentUserSpots";
import EditSpotForm from "./components/EditSpotForm";
import Map from "./components/Map";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <AllSpots />
          </Route>
          <Route path="/spots/new">
            <NewSpotForm />
          </Route>
          <Route path="/spots/current">
            <CurrentUserSpots />
          </Route>
          <Route path="/spots/:spotId/edit">
            <EditSpotForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotShow />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
          <Route>Page not found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
