require("./utils");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const signUpRouter = require("./routers/signUpRouter");
const loginRouter = require("./routers/loginRouter");

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
