"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = require("../controllers/ProfileController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, ProfileController_1.ProfileController.getProfile);
router.put('/', auth_1.requireAuth, ProfileController_1.ProfileController.updateProfile);
exports.default = router;
