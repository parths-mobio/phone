const express = require('express');
const app = express();
const port = 3000;

const cors = require("cors");
require("dotenv").config();


/* db connection */
require("./configs/dbconnection.js");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* routes */
require("./routes")(app);

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})