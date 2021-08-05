const apiRoute = "/api";
var authRouter = require("./authRoutes");
var categoryRouter = require("./categoryRoutes");
var keywordRouter = require("./keywordRoutes");
var userRouter = require("./userRoutes");
var glimpulseRouter = require("./masterGlimpulseRoutes");
const express = require("express");

/* routes */
module.exports = (app) => {
app.use(express.urlencoded({ extended: false }));
app.use(`${apiRoute}`, authRouter);
app.use(`${apiRoute}`, categoryRouter);
app.use(`${apiRoute}`, keywordRouter);
app.use(`${apiRoute}`, userRouter);
app.use(`${apiRoute}`, glimpulseRouter);
};