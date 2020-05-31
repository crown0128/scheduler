const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const routes = require('./routes/schedulerroutes.js');  // to handle api calls


const PORT = process.env.PORT || 3000;
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// app.use(express.static("public"));
// app.use(express.static("client"));
// Serve static files from the Vue app build directory
app.use(express.static(path.join(__dirname, 'client/dist'))); 
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scheduledb", { useNewUrlParser: true, useUnifiedTopology: true });

// matches other routes to compiled code in dist folder...entrypoint to client side.
// all other routes must go above this one.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html')); 
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
