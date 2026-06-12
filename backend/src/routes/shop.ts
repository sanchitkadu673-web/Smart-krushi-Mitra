import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth';
import { ShopController } from '../controllers/ShopController';

const router = Router();

// Shop Owner routes
router.post('/register', requireAuth, requireRole(['shop_owner']), ShopController.registerShop);
router.get('/me', requireAuth, requireRole(['shop_owner']), ShopController.getShopDetails);

// Shop Products
router.get('/products', requireAuth, requireRole(['shop_owner']), ShopController.getProducts);
router.post('/products', requireAuth, requireRole(['shop_owner']), ShopController.addProduct);
router.put('/products/:id', requireAuth, requireRole(['shop_owner']), ShopController.updateProduct);
router.delete('/products/:id', requireAuth, requireRole(['shop_owner']), ShopController.deleteProduct);
router.post('/scan-bill', requireAuth, requireRole(['shop_owner']), ShopController.scanBillAndAddToStock);


// Shop Farmers (Shetkari Users)
router.get('/farmers', requireAuth, requireRole(['shop_owner']), ShopController.getFarmers);
router.post('/farmers', requireAuth, requireRole(['shop_owner']), ShopController.registerFarmer);

// Farmer link route
router.get('/linked', requireAuth, requireRole(['farmer']), ShopController.getLinkedShopForFarmer);

export default router;
