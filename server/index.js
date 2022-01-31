require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const cors = require("cors");
const cookieParser = require("cookie-parser");

// schema
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const User = require("./models/User");
const { createRefreshToken } = require("./auth");

// apollo-server-express
async function startApolloServer(typeDefs, resolvers) {
  const port = process.env.port || 3001;
  const app = express();

  // middlewares
  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URI,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  // post refresh token
  app.post("/refresh_token", async (req, res) => {
    const { createAccessToken } = require("./auth");
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "", refreshToken: false });
    }

    let payload = null;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    } catch (err) {
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    res.cookie("jid", createRefreshToken(user), {
      httpOnly: true,
    });

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false,
  });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

// db connection
if(process.env.ROOT_PASSWORD && process.env.ROOT_USERNAME){
  mongoose
  .connect( process.env.DB_URI, {
    authSource: 'admin',
    pass: process.env.ROOT_PASSWORD,
    user: process.env.ROOT_USERNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    startApolloServer(typeDefs, resolvers);
  })
  .catch((err) => console.log(err));
  console.log(process.env.ROOT_PASSWORD, process.env.ROOT_USERNAME)
}else{
  mongoose
  .connect( process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    startApolloServer(typeDefs, resolvers);
  })
  .catch((err) => console.log(err));
  console.log("empty")
}