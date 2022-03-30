const express = require("express");

const checkAuth = require("../middleware/checkAuth");
const OrdersController = require("../controllers/orders");

const router = express.Router();

router.get("/", checkAuth, OrdersController.orders_get_all);
router.post("/", checkAuth, OrdersController.orders_create);
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
