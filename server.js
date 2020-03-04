const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require('./routes/schedulerroutes.js');
const app = express();


const PORT = process.env.PORT || 8080;
app.use(logger("dev"));


// const db = require("./models");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(express.static("public"));
app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/scheduledb", { useNewUrlParser: true, useUnifiedTopology: true });


// app.post("/submit", ({ body }, res) => {
//   db.Note.create(body)
//     .then(({ _id }) => db.User.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true }))
//     .then(dbUser => {
//       res.json(dbUser);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.get("/populateduser", (req, res) => {
//   db.User.find({})
//     .populate("notes")
//     .then(dbUser => {
//       res.json(dbUser);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
