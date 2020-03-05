const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require('./routes/schedulerroutes.js');
const app = express();


const PORT = process.env.PORT || 3000;
app.use(logger("dev"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// app.use(express.static("public"));
app.use(express.static("client"));
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scheduledb", { useNewUrlParser: true, useUnifiedTopology: true });


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
