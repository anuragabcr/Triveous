const express = require("express");
const router = express.Router();
const authController = require("./authController");
const categoryController = require("./categoryController");
const productController = require("./productController");
const cartController = require("./cartController");
const orderController = require("./orderController");
const authMiddleware = require("./authMiddleware");

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.get("/categories", categoryController.getCategories);

router.get("/products", productController.getProductsByCategory);
router.get("/products/:productId", productController.getProductById);

router.use(authMiddleware);

router.post("/cart/add", cartController.addToCart);
router.get("/cart", cartController.getCart);
router.put("/cart/update/:cartItemId", cartController.updateCartItem);
router.delete("/cart/remove/:cartItemId", cartController.removeCartItem);

router.post("/orders/place", orderController.placeOrder);
router.get("/orders/history", orderController.getOrderHistory);
router.get("/orders/:orderId", orderController.getOrderById);

module.exports = router;
