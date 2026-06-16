"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Protect all admin endpoints
router.use(auth_1.requireAuth);
router.use((0, auth_1.requireRole)(['admin', 'super_admin']));
router.get('/stats', AdminController_1.AdminController.getStats);
router.put('/landing-page', AdminController_1.AdminController.updateLandingPage);
router.get('/farmers', AdminController_1.AdminController.listFarmers);
router.get('/shops', AdminController_1.AdminController.listShops);
router.post('/broadcast', AdminController_1.AdminController.broadcastNotification);
router.delete('/farmers/:id', AdminController_1.AdminController.deleteFarmer);
router.delete('/shops/:id', AdminController_1.AdminController.deleteShop);
router.put('/shops/:id/approve', AdminController_1.AdminController.toggleShopApproval);
// Crop Master
router.get('/crops', AdminController_1.AdminController.listCropMasters);
router.post('/crops', AdminController_1.AdminController.createCropMaster);
router.put('/crops/:id', AdminController_1.AdminController.updateCropMaster);
router.delete('/crops/:id', AdminController_1.AdminController.deleteCropMaster);
// Stages
router.get('/stages', AdminController_1.AdminController.listStages);
router.post('/stages', AdminController_1.AdminController.createStage);
router.put('/stages/:id', AdminController_1.AdminController.updateStage);
router.delete('/stages/:id', AdminController_1.AdminController.deleteStage);
// Diseases
router.get('/diseases', AdminController_1.AdminController.listDiseases);
router.post('/diseases', AdminController_1.AdminController.createDisease);
router.put('/diseases/:id', AdminController_1.AdminController.updateDisease);
router.delete('/diseases/:id', AdminController_1.AdminController.deleteDisease);
// Pests
router.get('/pests', AdminController_1.AdminController.listPests);
router.post('/pests', AdminController_1.AdminController.createPest);
router.put('/pests/:id', AdminController_1.AdminController.updatePest);
router.delete('/pests/:id', AdminController_1.AdminController.deletePest);
router.post('/weather-advisories/trigger', AdminController_1.AdminController.triggerWeatherAdvisories);
exports.default = router;
