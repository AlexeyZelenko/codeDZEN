import { WebSocketServer } from "ws";
import express from "express";
import morgan from "morgan";
import { ApolloServer, gql } from "apollo-server-express";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import chalk from "chalk";

const firebaseConfig = {
  apiKey: "AIzaSyBesyV5IKoTpCO-0ymeBV9QqsYFgctHSzs",
  authDomain: "friendlychat-you-tube-short.firebaseapp.com",
  databaseURL: "https://friendlychat-you-tube-short.firebaseio.com",
  projectId: "friendlychat-you-tube-short",
  storageBucket: "friendlychat-you-tube-short.appspot.com",
  messagingSenderId: "411845781736",
  appId: "1:411845781736:web:10ef79fa60b229c954415d",
  measurementId: "G-52D6W1Z78W",
};

// Инициализация Firebase
const appFirebase = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const db = getFirestore(appFirebase);

// Логирование коллекции продуктов
const checkCollectionExists = async () => {
  try {
    console.log(chalk.yellow("Checking products collection..."));
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      console.log(chalk.red("No products found in the collection."));
      return false;
    }
    console.log(
      chalk.green("Products collection is accessible and contains data."),
    );
    return true;
  } catch (error) {
    console.error(chalk.red("Error checking products collection:", error));
    return false;
  }
};

// Создание схемы GraphQL
const typeDefs = gql`
  type Query {
    hello: String
    getProduct(id: String!): Product
    updateProduct(id: String!, updatedData: ProductInput!): Product
  }

  type Product {
    id: String
    title: String
    serialNumber: String
    specification: String
    date: String
    photo: String
    priceUAH: Float
    priceUSD: Float
  }

  input ProductInput {
    title: String
    serialNumber: String
    specification: String
    date: String
  }
`;

// Резолверы для GraphQL
const resolvers = {
  Query: {
    hello: () => {
      console.log(chalk.green("Fetching hello query"));
      return "Hello, world!";
    },
    getProduct: async (_, { id }) => {
      console.log(chalk.blue(`Fetching product with ID: ${id}`));
      const docSnap = await getDocs(
        query(collection(db, "products"), where("id", "==", id)),
      );
      if (!docSnap.empty) {
        return docSnap.docs[0].data();
      } else {
        throw new Error(`Product with ID ${id} not found.`);
      }
    },
    updateProduct: async (_, { id, updatedData }) => {
      console.log(chalk.blue(`Updating product with ID: ${id}`));
      const productRef = doc(db, "products", id);
      try {
        const docSnap = await getDocs(
          query(collection(db, "products"), where("id", "==", id)),
        );
        if (!docSnap.empty) {
          await updateDoc(productRef, updatedData);
          console.log(
            chalk.green(`Product with ID ${id} updated successfully.`),
          );
          return { id, ...updatedData };
        } else {
          throw new Error(`Product with ID ${id} not found.`);
        }
      } catch (error) {
        console.error(chalk.red("Error updating product:", error));
        throw new Error("Failed to update product.");
      }
    },
  },
};

// Создание экземпляра ApolloServer
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// Создание экземпляра Express
const app = express();
const port = process.env.PORT || 8080;

// Логирование запросов
app.use(morgan("dev"));

// Асинхронная функция для старта Apollo Server и WebSocket сервера
const startApolloServer = async () => {
  console.log(chalk.yellow("Starting Apollo Server..."));
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.get("/", (req, res) => {
    res.send("Hello from Express with WebSocket and GraphQL!");
  });

  const server = app.listen(port, () => {
    console.log(chalk.green(`HTTP server running on http://localhost:${port}`));
  });

  // Проверка доступности коллекции перед запуском WebSocket сервера
  const isCollectionAccessible = await checkCollectionExists();
  if (!isCollectionAccessible) {
    console.error(
      chalk.red("Cannot proceed, products collection is not accessible."),
    );
    return;
  }

  const wsServer = new WebSocketServer({ server });

  wsServer.on("connection", (ws, req) => {
    const clientId = req.socket.remoteAddress;
    console.log(chalk.green(`WebSocket client connected: ${clientId}`));

    ws.send(JSON.stringify({ type: "sessions", count: 1 }));

    ws.on("message", (message) => {
      console.log(chalk.cyan(`Received message from ${clientId}:`, message));
    });

    ws.on("close", () => {
      console.log(chalk.yellow(`WebSocket client disconnected: ${clientId}`));
    });
  });

  server.on("error", (error) => {
    console.error(chalk.red(`Server error: ${error.message}`));
  });

  console.log(
    chalk.green(`WebSocket server running on ws://localhost:${port}`),
  );
};

// Запуск ApolloServer и WebSocket сервера
startApolloServer();
