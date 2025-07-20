const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const usersRouter = require("./app/user/user.controller");
const makananRouter = require("./app/makan/makan.controller");
const minumanRouter = require("./app/minum/minum.controller");   

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter);
app.use("/", makananRouter);
app.use("/", minumanRouter);

module.exports = app;
