# Dog Dash Expo

This is the mobile application for the **Dog Dash** project, built with [Expo](https://expo.dev) (React Native).

## Overview

The Expo application targets iOS and Android. It shares UI components with the Web application via `packages/ui`.

## Current Status

> [!NOTE]
> This application is currently in the initial setup phase.

## Getting Started

It is recommended to run commands from the root of the monorepo.

### Prerequisites (Linux)

Expo's React Native DevTools (`@react-native/debugger-shell`) requires `libnspr4`. The start scripts set `EXPO_UNSTABLE_HEADLESS=1` to skip auto-launching DevTools, which avoids this error.

To use React Native DevTools interactively (press `j` in the terminal), install the library first:

```bash
sudo apt-get install libnspr4
```

Then run Expo without the env var:

```bash
npx expo start
```

### Development
```bash
npm start
```
or via Turbo from the root:
```bash
npm run dev
```

## Tech Stack

- **Expo**: React Native Framework
- **React Native**: Core mobile framework
- **Shared UI**: Shared components from `@dog-dash/ui`
