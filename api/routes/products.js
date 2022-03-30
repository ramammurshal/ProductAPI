const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/checkAuth");
const ProductsController = require("../controllers/products");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb: callback
    cb(null, "./uploads/"); // 1: error expected, 2: the file destinations
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:|\./g, "") + " - " + file.originalname); // 2: set filename
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("System only accept jpeg or png type of file"), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", ProductsController.products_get_all);
router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_create_product);
router.get("/:productId", ProductsController.products_get_product);
router.patch("/:productId", checkAuth, ProductsController.products_patch_product);
router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;
