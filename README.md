# Dog Dash Monorepo

Welcome to the **Dog Dash** monorepo. This project is a comprehensive platform for dog management and tracking, built with a shared codebase targeting Web, iOS, and Android.

## Project Structure

This monorepo is managed using [TurboRepo](https://turbo.build/repo).

### `apps/`
- **[web](file:///home/dennis/dog-dash/apps/web)**: Next.js application using React Native Web. Focuses on the administrative and user portal.
- **[expo](file:///home/dennis/dog-dash/apps/expo)**: Expo application (React Native) targeting iOS and Android.

### `packages/`
- **[ui](file:///home/dennis/dog-dash/packages/ui)**: Shared React Native / React Native Web component library.
- **[config](file:///home/dennis/dog-dash/packages/config)**: Centralized configuration for TypeScript, Linting, and other tools.

## Tech Stack

- **Frameworks**: [Next.js](https://nextjs.org), [Expo (React Native)](https://expo.dev)
- **Shared UI**: [React Native Web](https://necolas.github.io/react-native-web/), [Styled Components](https://styled-components.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (Web), [Styled System](https://styled-system.com)
- **Monorepo**: [TurboRepo](https://turbo.build/repo)
- **Auth**: [Clerk](https://clerk.com)

## Getting Started

### Prerequisites
- Node.js (version specified in `package.json`)
- npm

### Installation
Run the following command in the root directory to install all dependencies:
```bash
npm install
```

### Development
Start all applications in development mode:
```bash
npm run dev
```
This runs `turbo dev`, which starts both the web and mobile (if configured) development servers.

### Building
To build all applications and packages:
```bash
npm run build
```

## Documentation
Each sub-project contains its own detailed `README.md` with specific instructions.
