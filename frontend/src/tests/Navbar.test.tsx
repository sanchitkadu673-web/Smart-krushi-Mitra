// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';

// Mock auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    profile: { full_name: 'Sanchit Patil', role: 'farmer' },
    logout: vi.fn()
  })
}));

// Mock translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() }
  })
}));

// Mock theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn()
  })
}));

describe('Navbar Component', () => {
  it('renders farmer profile name and brand heading', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('appName')).toBeDefined();
    expect(screen.getByText('Sanchit Patil')).toBeDefined();
  });
});
