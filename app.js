const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

const app = express();
mongoose.connect("mongodb+srv://testmongo:" + process.env.MONGO_ATLAS_PW + "@ramz-node-api.shly4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

app.use(morgan("dev")); // log the request
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow cors origin (from different port)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // set what type of header that we alloc
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // set type of method that we allow
    return res.status(200).json({});
  }
  next();
});

// add middleware routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error); // pass to the first argument in next routes
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message,
    },
  });
});

module.exports = app;
