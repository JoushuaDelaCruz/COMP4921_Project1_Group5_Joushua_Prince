require("./utils");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();
const MongoStore = require("connect-mongo");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

const expireTime = 60 * 60 * 1000; //expires after 1 hr (hours * minutes * seconds * millis)

//** MongoDB Session */
/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

const mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.nbfzg7h.mongodb.net/?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: expireTime, // 1 hour
    },
  })
);

const signUpRouter = require("./routers/signUpRouter");
const loginRouter = require("./routers/loginRouter");
const homeRouter = require("./routers/homeRouter");
const postRouter = require("./routers/postRouter");

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
