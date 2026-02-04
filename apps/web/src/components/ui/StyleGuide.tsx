"use client";

import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

/**
 * StyleGuide component to showcase the design system elements
 */
export const StyleGuide: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  
  return (
    <div className="p-4">
      <div className="mb-8">
        <h1>Design System</h1>
        <p>A comprehensive design system for the application with ligth and dark mode.</p>
        <button 
          onClick={toggleTheme}
          className="bg-primary text-inverse rounded-lg p-3 transition-fast hover:opacity-90"
        >
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      
      {/* Typography */}
      <section className="mb-8">
        <h2>Typography</h2>
        <div className="bg-surface p-4 rounded-lg">
          <h1 className="mb-4">Heading 1 (36px)</h1>
          <h2 className="mb-4">Heading 2 (30px)</h2>
          <h3 className="mb-4">Heading 3 (24px)</h3>
          <h4 className="mb-4">Heading 4 (20px)</h4>
          <p className="mb-4">Body 1 (16px) - Main text for content areas.</p>
          <p className="body2 mb-4">Body 2 (14px) - Secondary text for content areas.</p>
          <p className="caption mb-4">Caption (12px) - Small text for labels and metadata.</p>
          <p className="small">Small (10px) - Very small text for fine details.</p>
        </div>
      </section>
      
      {/* Colors */}
      <section className="mb-8">
        <h2>Colors</h2>
        <h3 className="mb-2">Primary Colors</h3>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
            <div key={weight} className="text-center">
              <div 
                className="w-16 h-16 rounded-md mb-1"
                style={{ backgroundColor: `var(--color-primary-${weight})` }}
              ></div>
              <span className="caption">{weight}</span>
            </div>
          ))}
        </div>
        
        <h3 className="mb-2">Semantic Colors</h3>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {['success', 'error', 'warning', 'info'].map((color) => (
            <div key={color} className="text-center">
              <div 
                className="w-16 h-16 rounded-md mb-1"
                style={{ backgroundColor: `var(--color-${color}-500)` }}
              ></div>
              <span className="caption">{color}</span>
            </div>
          ))}
        </div>
        
        <h3 className="mb-2">Neutral Colors</h3>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => (
            <div key={weight} className="text-center">
              <div 
                className="w-16 h-16 rounded-md mb-1"
                style={{ backgroundColor: `var(--color-neutral-${weight})` }}
              ></div>
              <span className="caption">{weight}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Spacing */}
      <section className="mb-8">
        <h2>Spacing</h2>
        <div className="bg-surface p-4 rounded-lg">
          <div className="d-flex flex-column gap-2">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((size) => (
              <div key={size} className="d-flex items-center">
                <div 
                  className="bg-primary"
                  style={{ 
                    width: `var(--spacing-${size})`, 
                    height: '24px',
                    marginRight: '16px'
                  }}
                ></div>
                <span className="caption">{`--spacing-${size}`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Border Radius */}
      <section className="mb-8">
        <h2>Border Radius</h2>
        <div className="d-flex flex-wrap gap-4 mb-4">
          {['sm', 'md', 'lg', 'xl', '2xl', 'full'].map((size) => (
            <div key={size} className="text-center">
              <div 
                className="w-16 h-16 bg-primary mb-1"
                style={{ borderRadius: `var(--radius-${size})` }}
              ></div>
              <span className="caption">{size}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Shadows */}
      <section className="mb-8">
        <h2>Shadows</h2>
        <div className="d-flex flex-wrap gap-4 mb-4">
          {['sm', 'md', 'lg', 'xl'].map((size) => (
            <div key={size} className="text-center">
              <div 
                className="w-24 h-24 bg-surface mb-1"
                style={{ boxShadow: `var(--shadow-${size})` }}
              ></div>
              <span className="caption">{size}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Buttons */}
      <section className="mb-8">
        <h2>Button Examples</h2>
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button className="bg-primary text-inverse rounded-lg p-3 transition-fast hover:opacity-90">
            Primary Button
          </button>
          <button className="bg-transparent border border-solid border-neutral-200 text-brand rounded-lg p-3 transition-fast hover:bg-neutral-50">
            Secondary Button
          </button>
          <button className="bg-transparent text-brand p-3 transition-fast hover:opacity-70">
            Text Button
          </button>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;
