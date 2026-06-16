"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WeatherController_1 = require("../controllers/WeatherController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/forecast', auth_1.requireAuth, WeatherController_1.WeatherController.getWeatherForecast);
exports.default = router;
