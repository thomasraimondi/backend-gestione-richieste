const express = require("express");
const app = express();
const connection = require("./db/db");
const registerRouter = require("./routers/registerRouter");
const loginRouter = require("./routers/loginRouter");
const checkTokenRouter = require("./routers/checkTokenRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logoutRouter = require("./routers/logoutRouter");
const profileRouter = require("./routers/profileRouter");
const { notFount, errorHandler } = require("./middleware/errorHandler");
const requestsRouter = require("./routers/requestsRouter");
const usersRouter = require("./routers/usersRouter");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/check-token", checkTokenRouter);
app.use("/logout", logoutRouter);
app.use("/profile", profileRouter);
app.use("/requests", requestsRouter);
app.use("/users", usersRouter);

app.use(notFount);
app.use(errorHandler);

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
