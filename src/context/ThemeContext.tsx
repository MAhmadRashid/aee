"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'midnight-gold' | 'obsidian-silver' | 'amber-oud';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('midnight-gold');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage first for immediate UI render (to avoid flash)
    const savedTheme = localStorage.getItem('site_theme') as ThemeType;
    if (savedTheme && ['midnight-gold', 'obsidian-silver', 'amber-oud'].includes(savedTheme)) {
      applyTheme(savedTheme);
    } else {
      applyTheme('midnight-gold');
    }
    
    // Then fetch the global source of truth from Firebase
    const fetchGlobalTheme = async () => {
      try {
        const res = await fetch('/api/settings/theme');
        if (res.ok) {
          const data = await res.json();
          if (data.theme && data.theme !== savedTheme) {
             applyTheme(data.theme);
             localStorage.setItem('site_theme', data.theme);
          }
        }
      } catch (error) {
        console.error("Failed to fetch global theme", error);
      }
    };
    
    fetchGlobalTheme();
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    // Apply locally first for immediate feedback
    applyTheme(newTheme);
    localStorage.setItem('site_theme', newTheme);
    
    // Update global state in Firebase
    try {
      await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      });
    } catch (error) {
      console.error('Failed to update global theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
