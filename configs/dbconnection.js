const mongoose = require("mongoose");

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