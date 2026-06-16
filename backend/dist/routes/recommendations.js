"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RecommendationController_1 = require("../controllers/RecommendationController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/:cropId', auth_1.requireAuth, RecommendationController_1.RecommendationController.getRecommendations);
exports.default = router;
