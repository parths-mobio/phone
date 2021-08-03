const apiRoute = "/api";
var authRouter = require("./authRoutes");
var categoryRouter = require("./categoryRoutes");
var keywordRouter = require("./keywordRoutes");
var userRouter = require("./userRoutes");


/* routes */
module.exports = (app) => {

app.use(`${apiRoute}`, authRouter);
app.use(`${apiRoute}`, categoryRouter);
app.use(`${apiRoute}`, keywordRouter);
app.use(`${apiRoute}`, userRouter);
};