const express = require("express");
const { dbConnection } = require("./config/database.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");

const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const requestRouter = require("./routes/requestRouter.js");
const userRouter = require("./routes/userRouter.js");
const chatRouter = require("./routes/chatRouter.js");
const intialiseSocket = require("./utils/socket.js");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

const server = http.createServer(app);
intialiseSocket(server);

dbConnection()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(3333, () => {
      console.log("Server is running on port 3333");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
