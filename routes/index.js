const apiRoute = "/api";
var authRouter = require("./authRoutes");
var categoryRouter = require("./categoryRoutes");
var keywordRouter = require("./keywordRoutes");
var userRouter = require("./userRoutes");
var glimpulseRouter = require("./masterGlimpulseRoutes");
var cronRouter = require("./cronRoutes");
const express = require("express");

/* routes */
module.exports = (app) => {
app.use(express.urlencoded({ extended: false }));
app.use(`${apiRoute}/auth`, authRouter);
app.use(`${apiRoute}/category`, categoryRouter);
app.use(`${apiRoute}/keyword`, keywordRouter);
app.use(`${apiRoute}/user`, userRouter);
app.use(`${apiRoute}/glimpulse`, glimpulseRouter);
app.use(`${apiRoute}/cronjob`, cronRouter);
};