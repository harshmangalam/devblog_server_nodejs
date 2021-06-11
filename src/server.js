const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const context = require("./context");
const cors = require("cors");
const http = require("http");
const express = require("express");
const { PORT } = require("./config");

const cloudinaryRoute = require("./routes/cloudinary");
async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    tracing: true,
    uploads: false,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use(
    cors({
      optionsSuccessStatus: 200,
      origin: ["http://localhost:3000"],
    })
  );

  app.get("/", (req, res) => {
    return res.status(200).json({ status: "success" });
  });

  app.use("/cloudinary", cloudinaryRoute);

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
