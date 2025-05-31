# Dog-Dash Design System

## Overview
This document outlines the design system for Dog-Dash, a cross-platform application built with React Native, Expo, and React Native Web. The system is designed to be consistent across web and mobile platforms while maintaining flexibility for future updates.

## Core Principles

1. **Consistency** - Uniform design language across all platforms
2. **Accessibility** - WCAG 2.1 AA compliance
3. **Performance** - Optimized for fast rendering
4. **Maintainability** - Easy to update and extend
5. **Responsive** - Works on all screen sizes

## Color System

### Primary Colors
- `primary`: #3B82F6 (Blue 500)
  - Used for primary actions, buttons, and interactive elements
  - Dark mode: #60A5FA (Blue 400)

### Semantic Colors
- `success`: #10B981 (Green 500)
- `error`: #EF4444 (Red 500)
- `warning`: #F59E0B (Amber 500)
- `info`: #3B82F6 (Blue 500)

### Surface Colors
- `background`: #FFFFFF (Light), #0F172A (Dark)
- `surface`: #F8FAFC (Light), #1E293B (Dark)
- `border`: #E2E8F0 (Light), #334155 (Dark)

### Text Colors
- `text.primary`: #0F172A (Light), #F8FAFC (Dark)
- `text.secondary`: #475569 (Light), #94A3B8 (Dark)
- `text.disabled`: #94A3B8 (Light), #475569 (Dark)

## Typography

### Font Family
- **Primary**: Geist (Sans-serif)
- **Monospace**: Geist Mono

### Type Scale
- `display`: 48px (3rem)
- `h1`: 36px (2.25rem)
- `h2`: 30px (1.875rem)
- `h3`: 24px (1.5rem)
- `h4`: 20px (1.25rem)
- `body1`: 16px (1rem)
- `body2`: 14px (0.875rem)
- `caption`: 12px (0.75rem)

## Spacing

### Base Unit: 4px

| Name   | Size  | Example Usage            |
|--------|-------|--------------------------|
| xs     | 4px   | Tight spacing            |
| sm     | 8px   | Between related elements |
| md     | 16px  | Section spacing          |
| lg     | 24px  | Between major sections   |
| xl     | 32px  | Large spacing            |
| xxl    | 48px  | Extra large spacing      |

## Components

### Buttons

#### Primary Button
- Background: `primary`
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Elevation: 2 (mobile), none (web)

#### Secondary Button
- Background: Transparent
- Border: 1px solid `border`
- Text: `text.primary`
- Padding: 12px 24px
- Border Radius: 8px

### Forms

#### Text Input
- Height: 48px
- Border: 1px solid `border`
- Border Radius: 8px
- Padding: 0 16px
- Focus: 2px primary outline

### Cards
- Background: `surface`
- Border Radius: 12px
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
- Padding: 16px

## Icons

### Icon Set
- **Primary**: Material Community Icons (via `@expo/vector-icons`)
- **Size Scale**: 16px, 20px, 24px, 32px, 48px

### Usage
```typescript
import { MaterialCommunityIcons } from '@expo/vector-icons';

<MaterialCommunityIcons 
  name="dog" 
  size={24} 
  color={theme.colors.primary} 
/>
```

## Animation

### Duration
- `short`: 150ms
- `medium`: 250ms
- `long`: 350ms

### Easing
- `standard`: cubic-bezier(0.4, 0, 0.2, 1)
- `decelerate`: cubic-bezier(0.0, 0.0, 0.2, 1)
- `accelerate`: cubic-bezier(0.4, 0.0, 1, 1)

## Responsive Design

### Breakpoints
- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

### Hooks
```typescript
import { useWindowDimensions } from 'react-native';

function MyComponent() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  return (
    <View style={{
      flexDirection: isTablet ? 'row' : 'column'
    }}>
      {/* Content */}
    </View>
  );
}
```

## Dark Mode

### Implementation
```typescript
// theme/theme.ts
export const lightTheme = {
  colors: {
    primary: '#3B82F6',
    background: '#FFFFFF',
    // ... other colors
  },
  // ... other theme values
};

export const darkTheme = {
  colors: {
    primary: '#60A5FA',
    background: '#0F172A',
    // ... dark theme overrides
  },
  // ... other theme values
};
```

## Best Practices

1. **Theming**
   - Always use theme values instead of hardcoded colors
   - Test components in both light and dark modes

2. **Accessibility**
   - Ensure sufficient color contrast (4.5:1 for normal text)
   - Support system font size changes
   - Include proper ARIA labels

3. **Performance**
   - Use `memo` for expensive components
   - Optimize image sizes
   - Lazy load non-critical components

## Future Considerations

1. **Design Tokens**
   - Migrate to a design token system if the design system grows
   - Consider tools like Style Dictionary or Amazon Style Dictionary

2. **Component Library**
   - Document components in Storybook
   - Add visual regression testing

3. **Design Handoff**
   - Maintain a Figma/Sketch library in sync with code
  
## Implementation Notes
- All measurements are in density-independent pixels (dp)
- Use platform-specific code when necessary using `Platform.select`
- Test on multiple devices and screen sizes

## Resources
- [Material Design Guidelines](https://material.io/design)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Expo Vector Icons](https://icons.expo.fyi/)
