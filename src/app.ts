import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import http from "http";
import passport from "passport";
import "reflect-metadata";
import { Server as SocketIOServer, Socket } from "socket.io";
import authenticationRouter from "./routes/authentication";
import { AppDataSource } from "./utils/Database";
import { localPassportConfig } from "./utils/passport";

//------------------------------------------------------------------------------------
// Initializations
//------------------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);
// TODO: Add origin as environment variable
const io = new SocketIOServer(server, {
  cors: { origin: "http://localhost:3000" },
});

//------------------------------------------------------------------------------------
// Middlewares
//------------------------------------------------------------------------------------

// TODO: Add origin as environment variable
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());

// Sessions

// TODO: Put secret in env variable
app.use(
  expressSession({
    secret: "supersecrettestsecret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("supersecrettestsecret"));

app.use(passport.initialize());
app.use(passport.session());
localPassportConfig(passport);

//------------------------------------------------------------------------------------
// Routes
//------------------------------------------------------------------------------------

app.use("/auth", authenticationRouter);

app.get("/user", async (req, res) => {
  const user = await req.user;

  console.log("USER");
  console.log(req.user);
  res.send(user);
});

//------------------------------------------------------------------------------------
// Sockets
//------------------------------------------------------------------------------------

const intervals = {};

let interval: NodeJS.Timer;

io.on("connection", (socket) => {
  console.log("A user connected");
  // console.log(socket);

  socket.join(socket.id);

  if (intervals[socket.id]) {
    clearInterval(interval);
  }

  intervals[socket.id] = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
    socket.leave(socket.id);
    clearInterval(intervals[socket.id]);
  });
});

const getApiAndEmit = (socket: Socket) => {
  console.log(socket.rooms);
  console.log(Math.random());

  io.to(socket.id).emit("FromAPI", Math.random() * (100 - 1) + 1);
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
