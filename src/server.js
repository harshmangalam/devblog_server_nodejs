const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const context = require("./context");
const cors = require("cors");
const http = require("http");
const express = require("express");
const { PORT } = require("./config");

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    tracing: true,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use(
    cors({
      credentials: true,
      optionsSuccessStatus: 200,
      origin: "*",
    })
  );

  app.use((req, res, next) => {
    return res.status(200).json({
      success: true,
      message: "Express server up & running",
    });
  });

  const httpServer = http.createServer(app);

  server.installSubscriptionHandlers(httpServer);

  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`🚀 Express Server ready at http://localhost:${PORT}`);
  console.log(
    `🚀 Graphql Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
}

startApolloServer();
