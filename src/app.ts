import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import "reflect-metadata";
import { Server as SocketIOServer, Socket } from "socket.io";
import authenticationRouter from "./routes/authentication";
import { AppDataSource } from "./utils/Database";

//------------------------------------------------------------------------------------
// Initializations
//------------------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

//------------------------------------------------------------------------------------
// Middlewares
//------------------------------------------------------------------------------------

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

//------------------------------------------------------------------------------------
// Routes
//------------------------------------------------------------------------------------

app.use("/auth", authenticationRouter);

//------------------------------------------------------------------------------------
// Sockets
//------------------------------------------------------------------------------------

let interval: NodeJS.Timer;

io.on("connection", (socket) => {
  console.log("A user connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket: Socket) => {
  const response = new Date();

  socket.emit("FromAPI", response);
};

//------------------------------------------------------------------------------------
// Initialization of app
//------------------------------------------------------------------------------------

// We want to initialize the db connection then run the app
const PORT = 5000;
AppDataSource.initialize().then(() => {
  server.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });
});
