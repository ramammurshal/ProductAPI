const express = require("express");

const checkAuth = require("../middleware/checkAuth");
const UserController = require("../controllers/users");

const router = express.Router();

router.post("/signup", UserController.user_signup);
router.post("/login", UserController.users_login);
router.get("/", checkAuth, UserController.users_get_user);
router.delete("/:userId", checkAuth, UserController.users_delete_user);

module.exports = router;
