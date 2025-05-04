# Smart Config Loader

[![NPM Version](https://img.shields.io/npm/v/smart-config-loader.svg)](https://www.npmjs.com/package/smart-config-loader)
[![NPM Downloads](https://img.shields.io/npm/dm/smart-config-loader.svg)](https://www.npmjs.com/package/smart-config-loader)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/smart-config-loader.svg)](https://bundlephobia.com/package/smart-config-loader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
<!-- Add Build Status / Test Coverage badges later -->

A simple, type-safe Node.js utility to load and merge application configuration from multiple sources, prioritizing environment variables for flexibility in different deployment scenarios.

## Motivation

Managing configuration across different environments (development, staging, production) using `.env` files and system environment variables is a common task in Node.js development. This utility streamlines the process by providing a consistent way to load and merge these sources with a clear precedence order.

## Features

*   **Multi-Source Loading:** Loads configuration from:
    *   Default `.env` file
    *   Environment-specific `.env` file (e.g., `.env.development`, `.env.production`) based on `NODE_ENV`.
    *   System environment variables (`process.env`).
*   **Clear Precedence:** Merges configurations with the following priority (highest overrides lowest):
    1.  System Environment Variables (`process.env`)
    2.  Environment-specific file (`.env.${NODE_ENV}`)
    3.  Default `.env` file
*   **Type-Safe:** Written in TypeScript, providing basic type definitions for the loader function.
*   **Simple API:** A single function `loadSmartConfig()` to get the final configuration object.

## Installation

```bash
npm install smart-config-loader
# or
yarn add smart-config-loader




Usage
1. Create .env Files

Create .env files in your project root.

.env (Base configuration):

# .env
DATABASE_URL=postgres://user:pass@db_host:5432/default_db
API_KEY=base_api_key_123
LOG_LEVEL=info
PORT=3000



.env.development (Overrides for development):

# .env.development
DATABASE_URL=postgres://dev_user:dev_pass@localhost:5432/dev_db
LOG_LEVEL=debug




.env.production (Overrides for production):

# .env.production
DATABASE_URL=postgres://prod_user:prod_secret@prod_db_host:5432/prod_db
LOG_LEVEL=warn
API_KEY=prod_api_key_789 # Overrides base .env
PORT=80 # Overrides base .env



2. Load Configuration in Your App

Import and call loadSmartConfig early in your application startup.

// your-app.ts
import loadSmartConfig from 'smart-config-loader'; // Or: const loadSmartConfig = require('smart-config-loader').default;
import dotenv from 'dotenv'; // Make sure dotenv is installed if you use .env files

// Load system environment variables FIRST (if using .env files)
// dotenv.config() might overwrite existing process.env vars if not careful
// This library handles loading .env files internally, so you might not need dotenv.config() here
// depending on your setup. Ensure NODE_ENV is set correctly before calling.

// Set NODE_ENV *before* loading config (usually done via system env or start script)
// process.env.NODE_ENV = 'development'; // Example: Or set via command line: NODE_ENV=production node dist/your-app.js

// Optionally set system environment variables which take highest precedence
// process.env.PORT = '8080'; // Example: Overrides any .env file PORT value

// Load the merged configuration
const config = loadSmartConfig();
// If your .env files are not in the project root:
// const config = loadSmartConfig({ projectRoot: '/path/to/your/config/dir' });

console.log(`Running in environment: ${process.env.NODE_ENV || 'undefined'}`);
console.log('--- Loaded Configuration ---');
console.log(config);
console.log('--------------------------');

// Access configuration values
const dbUrl = config.DATABASE_URL;
const apiKey = config.API_KEY;
const logLevel = config.LOG_LEVEL;
const port = config.PORT; // Note: Accessing PORT might return string from process.env

console.log(`Connecting to DB: ${dbUrl}`);
console.log(`Using API Key: ${apiKey}`);
console.log(`Log Level: ${logLevel}`);
console.log(`Server Port: ${port}`);

// Example of accessing a potentially undefined value
const featureFlag = config.MY_FEATURE_FLAG ?? 'default_value';
console.log(`My Feature Flag: ${featureFlag}`);

// Your application logic starts here...
// const server = app.listen(Number(port || 3000), () => { ... });



How Precedence Works (Example)

Assume you have the .env files shown above.

If NODE_ENV is development and process.env.PORT is 8080:

DATABASE_URL comes from .env.development.

API_KEY comes from .env (not present in .env.development).

LOG_LEVEL comes from .env.development.

PORT comes from process.env (8080), overriding .env.

If NODE_ENV is production and no relevant process.env overrides:

DATABASE_URL comes from .env.production.

API_KEY comes from .env.production.

LOG_LEVEL comes from .env.production.

PORT comes from .env.production (80).

If NODE_ENV is not set and no relevant process.env overrides:

All values come from the base .env file.

Future Enhancements (Roadmap)

Schema validation using Zod or similar.

Loading configuration from AWS Parameter Store / Secrets Manager.

Support for JSON/YAML configuration files.

Type inference based on validation schemas.

Caching loaded configuration.

Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

