"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Unhandled Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        error: {
            message,
            details: err.details || null,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
}
