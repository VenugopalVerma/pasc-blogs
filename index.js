const express = require("express");
const blogsRoute = require("./routes/blogs");
const projectsRoute = require("./routes/projects");
const homeRoute = require("./routes/home");
const userRoute = require("./routes/users");
const loginRoute = require("./routes/login");
const resetPasswordRoute = require('./routes/password');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

if (!process.env.JWT_KEY) {
  console.log("JWT KEY not defined in environment");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb+srv://{username}:<password>@cluster0-ay5f2.gcp.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    }
  )
  .then(() => console.log("Connected to database"))
  .catch(e => console.error("Could not connect to mongodb", e));

app.use(express.json());
app.use(cors());
app.use("/", homeRoute);
app.use("/blogs", blogsRoute);
app.use("/projects", projectsRoute);
app.use("/users", userRoute);
app.use("/login", loginRoute);
app.use("/resetpassword", resetPasswordRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port 3000"));
