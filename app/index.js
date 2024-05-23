const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const contactRoute = require("./routes/contact");

// Logging
app.use(morgan("dev"));

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({ message: `${req.method}` });
});

// Contact Route
app.use("/v1/contacts", contactRoute);

module.exports = app;
