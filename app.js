const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
app.use(express.json());

// DB Connection Start
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("CONNECTION SUCCESSFUL"))
  .catch((err) => console.log(err));
// DB Connection End

var authRouter = require("./routes/authRoutes");
var categoryRouter = require("./routes/categoryRoutes");




app.use(cors());

app.use("/api", authRouter);
app.use("/api", categoryRouter);

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})