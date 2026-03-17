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

The new React Native DevTools requires `libnspr4`. If you see an error about `libnspr4.so` when starting Expo, install it:

```bash
sudo apt-get install libnspr4
```

The DevTools debugger is disabled by default in `app.json` (`experiments.reactNativeDevTools: false`) to avoid this error. Re-enable it once the system library is installed.

### Development
```bash
npx expo start
```
or via Turbo from the root:
```bash
npm run dev
```

## Tech Stack

- **Expo**: React Native Framework
- **React Native**: Core mobile framework
- **Shared UI**: Shared components from `@dog-dash/ui`
