"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const ShopController_1 = require("../controllers/ShopController");
const router = (0, express_1.Router)();
// Shop Owner routes
router.post('/register', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.registerShop);
router.get('/me', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.getShopDetails);
// Shop Products
router.get('/products', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.getProducts);
router.post('/products', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.addProduct);
router.put('/products/:id', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.updateProduct);
router.delete('/products/:id', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.deleteProduct);
router.post('/scan-bill', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.scanBillAndAddToStock);
// Shop Farmers (Shetkari Users)
router.get('/farmers', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.getFarmers);
router.post('/farmers', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.registerFarmer);
router.post('/broadcast', auth_1.requireAuth, (0, auth_1.requireRole)(['shop_owner']), ShopController_1.ShopController.broadcastToFarmers);
// Farmer link route
router.get('/linked', auth_1.requireAuth, (0, auth_1.requireRole)(['farmer']), ShopController_1.ShopController.getLinkedShopForFarmer);
router.get('/all', auth_1.requireAuth, (0, auth_1.requireRole)(['farmer']), ShopController_1.ShopController.listAllShops);
exports.default = router;
