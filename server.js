const express = require("express");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })
const app = express();

const error = require('./middlewares/error')

app.use(bodyParser.json());
app.use(express());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



require('./routes/routes')(app);
// app.use('/api/v1/', routes)

const PORT=process.env.PORT || 6000;

const DATABASE = process.env.DATABASE || "mongodb://localhost:27017/FacebookClone";

app.listen(PORT, () => {
  console.log("Listening on port 5000");
});

//create connection to connect to mongoDb:
let db = mongoose.connect(DATABASE, {});

db = mongoose.connection;
//test the connection
db.on("error", () => console.log("error in connecting to database"));
db.once("open", () => console.log("connected to database"));

app.use(error);
