# Dog Dash Web

This is the web interface for the **Dog Dash** project, built with [Next.js](https://nextjs.org) and [React Native Web](https://necolas.github.io/react-native-web/).

## Overview

The Web application provides a unified user experience by sharing logic and components with the mobile app through `packages/ui`.

## Features

- **Responsive Design**: Powered by React Native Web and Styled System.
- **Authentication**: Integrated with [Clerk](https://clerk.com).
- **Styling**: Uses a hybrid of Styled Components and Tailwind CSS (v4).

## Getting Started

It is recommended to run commands from the root of the monorepo. However, you can run web-specific commands here:

### Development
```bash
npm run dev
```

### Testing
```bash
npm run test
```

## Tech Stack

- **Next.js**: App Router
- **React Native Web**: For cross-platform UI consistency.
- **Styled Components**: Core component styling.
- **Tailwind CSS**: Utility-first styling for layout and quick adjustments.
- **Jest & React Testing Library**: For unit and integration testing.
