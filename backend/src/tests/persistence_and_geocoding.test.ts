import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '../config/supabase';
import { WeatherService } from '../services/WeatherService';

const DB_FILE = path.join(__dirname, '../../.dev-database.json');

describe('Mock DB Persistence and Geocoding', () => {
  let originalDbFileExists = false;
  let originalDbContent = '';

  beforeAll(() => {
    // Backup original db file if it exists
    if (fs.existsSync(DB_FILE)) {
      originalDbFileExists = true;
      originalDbContent = fs.readFileSync(DB_FILE, 'utf-8');
    }
  });

  afterAll(() => {
    // Restore original db file
    if (originalDbFileExists) {
      fs.writeFileSync(DB_FILE, originalDbContent, 'utf-8');
    } else if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
  });

  it('persists inserts and updates to file', async () => {
    const uniqueMobile = '9999999999';
    // Insert profile
    const { data: inserted, error } = await supabaseAdmin.from('profiles').insert({
      user_id: 'test-persistent-user-id',
      full_name: 'Test Persistent',
      mobile: uniqueMobile,
      role: 'farmer',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Manjri'
    }).select().single();

    expect(error).toBeNull();
    expect(inserted).not.toBeNull();
    expect(inserted.mobile).toBe(uniqueMobile);

    // Verify file is created and contains the record
    expect(fs.existsSync(DB_FILE)).toBe(true);
    const savedData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const savedProfile = savedData.db.profiles.find((p: any) => p.mobile === uniqueMobile);
    expect(savedProfile).toBeDefined();
    expect(savedProfile.full_name).toBe('Test Persistent');

    // Update profile
    const { data: updated, error: updateError } = await supabaseAdmin.from('profiles')
      .update({ full_name: 'Test Persistent Updated' })
      .eq('mobile', uniqueMobile)
      .select()
      .single();

    expect(updateError).toBeNull();
    expect(updated.full_name).toBe('Test Persistent Updated');

    // Verify file is updated
    const updatedData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const updatedProfile = updatedData.db.profiles.find((p: any) => p.mobile === uniqueMobile);
    expect(updatedProfile.full_name).toBe('Test Persistent Updated');
  });

  it('supports admin stats count options', async () => {
    const { data: nullData, count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'farmer');

    expect(error).toBeNull();
    expect(nullData).toBeNull();
    expect(count).toBeGreaterThan(0);
  });

  it('geocodes coordinates for named locations with and without commas', async () => {
    // Test weather retrieval with a named location string
    const weather = await WeatherService.getWeather('Manjri, Pune');
    expect(weather).toBeDefined();
    expect(weather.temperature).toBeDefined();
    expect(weather.forecast).toBeInstanceOf(Array);
  });
});
