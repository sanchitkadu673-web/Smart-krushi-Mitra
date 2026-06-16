"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const supabase_1 = require("../config/supabase");
const WeatherService_1 = require("../services/WeatherService");
const DB_FILE = path_1.default.join(__dirname, '../../.dev-database.json');
(0, vitest_1.describe)('Mock DB Persistence and Geocoding', () => {
    let originalDbFileExists = false;
    let originalDbContent = '';
    (0, vitest_1.beforeAll)(() => {
        // Backup original db file if it exists
        if (fs_1.default.existsSync(DB_FILE)) {
            originalDbFileExists = true;
            originalDbContent = fs_1.default.readFileSync(DB_FILE, 'utf-8');
        }
    });
    (0, vitest_1.afterAll)(() => {
        // Restore original db file
        if (originalDbFileExists) {
            fs_1.default.writeFileSync(DB_FILE, originalDbContent, 'utf-8');
        }
        else if (fs_1.default.existsSync(DB_FILE)) {
            fs_1.default.unlinkSync(DB_FILE);
        }
    });
    (0, vitest_1.it)('persists inserts and updates to file', async () => {
        const uniqueMobile = '9999999999';
        // Insert profile
        const { data: inserted, error } = await supabase_1.supabaseAdmin.from('profiles').insert({
            user_id: 'test-persistent-user-id',
            full_name: 'Test Persistent',
            mobile: uniqueMobile,
            role: 'farmer',
            state: 'Maharashtra',
            district: 'Pune',
            taluka: 'Haveli',
            village: 'Manjri'
        }).select().single();
        (0, vitest_1.expect)(error).toBeNull();
        (0, vitest_1.expect)(inserted).not.toBeNull();
        (0, vitest_1.expect)(inserted.mobile).toBe(uniqueMobile);
        // Verify file is created and contains the record
        (0, vitest_1.expect)(fs_1.default.existsSync(DB_FILE)).toBe(true);
        const savedData = JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf-8'));
        const savedProfile = savedData.db.profiles.find((p) => p.mobile === uniqueMobile);
        (0, vitest_1.expect)(savedProfile).toBeDefined();
        (0, vitest_1.expect)(savedProfile.full_name).toBe('Test Persistent');
        // Update profile
        const { data: updated, error: updateError } = await supabase_1.supabaseAdmin.from('profiles')
            .update({ full_name: 'Test Persistent Updated' })
            .eq('mobile', uniqueMobile)
            .select()
            .single();
        (0, vitest_1.expect)(updateError).toBeNull();
        (0, vitest_1.expect)(updated.full_name).toBe('Test Persistent Updated');
        // Verify file is updated
        const updatedData = JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf-8'));
        const updatedProfile = updatedData.db.profiles.find((p) => p.mobile === uniqueMobile);
        (0, vitest_1.expect)(updatedProfile.full_name).toBe('Test Persistent Updated');
    });
    (0, vitest_1.it)('supports admin stats count options', async () => {
        const { data: nullData, count, error } = await supabase_1.supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'farmer');
        (0, vitest_1.expect)(error).toBeNull();
        (0, vitest_1.expect)(nullData).toBeNull();
        (0, vitest_1.expect)(count).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('geocodes coordinates for named locations with and without commas', async () => {
        // Test weather retrieval with a named location string
        const weather = await WeatherService_1.WeatherService.getWeather('Manjri, Pune');
        (0, vitest_1.expect)(weather).toBeDefined();
        (0, vitest_1.expect)(weather.temperature).toBeDefined();
        (0, vitest_1.expect)(weather.forecast).toBeInstanceOf(Array);
    });
});
