# Dog Dash Config

Centralized configuration for the **Dog Dash** monorepo.

## Overview

This package provides shared configurations for development tools to ensure consistency across the codebase.

## Contents

- **TypeScript**: Base configurations in `tsconfig.base.json`.

## Usage

### TypeScript
In a sub-project's `tsconfig.json`:
```json
{
  "extends": "@dog-dash/config/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"]
    }
  }
}
```
