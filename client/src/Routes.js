import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import Grid from "@mui/material/Grid";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";

// Components
import NavBar from "./components/NavBar";
import { ME } from "./GraphQL/Queries";
import ToDo from "./pages/ToDo";

function Routes() {
  const { loading, data } = useQuery(ME);
  if (loading) {
    return (
      <Router>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          rowSpacing={1}
        >
          <Grid item xs={2}>
            <NavBar></NavBar>
          </Grid>

          <Grid item xs={10}>
            <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
            </Segment>
          </Grid>
        </Grid>
      </Router>
    );
  }
  return (
    <Router>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        rowSpacing={1}
      >
        <Grid item xs={2}>
          <NavBar></NavBar>
        </Grid>

        <Grid item xs={10}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Switch>
              <Route exact path="/" element={<Home />} />
              {data && data.me ? (
                <>
                  <Route exact path="/todo" element={<ToDo />} />
                </>
              ) : (
                <>
                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/Login" element={<Login />} />
                </>
              )}
              <Route path="*" element={<Error />} />
            </Switch>
          </Grid>
        </Grid>
      </Grid>
    </Router>
  );
}

export default Routes;
