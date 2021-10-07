const express = require('express');
const router = express.Router();
const loggedoutRedirect = require("../middlewares/loggedoutRedirect.js");

const productsController = require('../controllers/products-controller');

router.get('/', productsController.list);
router.get('/detalle/:id?', productsController.detail);
router.get('/carrito', loggedoutRedirect, productsController.cart);
router.post('/carrito/:id', loggedoutRedirect, productsController.addToCart); // agrega 
router.delete('/carrito/:id/delete', loggedoutRedirect, productsController.deleteCart);
router.put('/carrito/:id/comprar', loggedoutRedirect, productsController.comprar);

module.exports = router;