const mongoose = require("mongoose");

const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("productId quantity _id")
    .populate("productId", "name") // merge the field on other schema, 2: only fetch specific field
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              _id: doc._id,
              productId: doc.productId,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id,
              },
            };
          }),
        });
      } else {
        res.status(404).json({
          message: "No entries yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_create = (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    productId: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          productId: result.productId,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("productId") // merge all field when orderId
    .exec()
    .then((order) => {
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders",
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry found for that ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
