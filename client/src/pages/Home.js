import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Home() {
  const [auth, setAuthor] = useState("");
  const [cont, setContent] = useState("");

  useEffect(() => {
    fetch("https://api.quotable.io/random").then(async (res) => {
      const { author, content } = await res.json();
      setAuthor(author);
      setContent(content);
    });
  }, []);

  return auth && cont ? (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {auth}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cont}
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <h1>Loading...</h1>
  );
}

export default Home;
