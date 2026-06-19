"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const crops_1 = __importDefault(require("./routes/crops"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const weather_1 = __importDefault(require("./routes/weather"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const errorHandler_1 = require("./middlewares/errorHandler");
const AdvisoryScheduler_1 = require("./services/AdvisoryScheduler");
const supabase_1 = require("./config/supabase");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
// Rate Limiting – more relaxed in development
const isDev = process.env.NODE_ENV !== 'production';
// General API limiter – high for development comfort
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 2000 : 300, // 2000 req/15min in dev, 300 in production
    message: { error: 'Too many requests, please try again later.' },
    skip: () => isDev // Completely skip rate limiting in dev mode
});
app.use('/api/', limiter);
// Request Parsing
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});
// API Routes
app.get('/api/landing-page', async (req, res, next) => {
    try {
        const { data, error } = await supabase_1.supabaseAdmin.from('landing_page_settings').select('*');
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data && data.length > 0 ? data[0] : {});
    }
    catch (err) {
        next(err);
    }
});
app.use('/api/auth', auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/crops', crops_1.default);
app.use('/api/recommendations', recommendations_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/shop', shop_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server (only when running as standalone, not as Vercel serverless function)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Smart Krushi Mitra server running on port ${PORT}`);
        AdvisoryScheduler_1.AdvisoryScheduler.start();
    });
}
exports.default = app;
