import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { setAccessToken } from "./accessToken";
import Routes from "./Routes";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URI}/refresh_token`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (x) => {
        const { accessToken } = await x.json();
        setAccessToken(accessToken);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  } else if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <CssBaseline />
      <Container fixed>
        <Box sx={{ height: "100vh" }}>
          <Routes />
        </Box>
      </Container>
    </>
  );
}

export default App;
