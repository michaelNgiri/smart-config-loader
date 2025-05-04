
import loadSmartConfig from '../src/index'; 

// --- Simulate setting environment variables for testing ---
// Set NODE_ENV to load .env.development
process.env.NODE_ENV = 'development';
// Set a system env variable to test override
process.env.PORT = '8080';
process.env.SYSTEM_ONLY_VAR = 'hello_from_system';
// ---------------------------------------------------------

console.log(`Running example with NODE_ENV=${process.env.NODE_ENV}`);
console.log(`System PORT is set to: ${process.env.PORT}`);
console.log('----------------------------------------');

const config = loadSmartConfig(); // Load using defaults

console.log('----------------------------------------');
console.log('Final Config Object:');
console.log(config);
console.log('----------------------------------------');

// Access specific variables
console.log(`Database URL: ${config.DATABASE_URL}`); // Should be from .env.development
console.log(`API Key: ${config.API_KEY}`);         // Should be from .env (not overridden by dev)
console.log(`Log Level: ${config.LOG_LEVEL}`);       // Should be from .env.development
console.log(`Port: ${config.PORT}`);             // Should be from process.env override
console.log(`System Only Var: ${config.SYSTEM_ONLY_VAR}`); // Should be from process.env

// Example: Accessing a potentially undefined variable
console.log(`Optional Feature Flag: ${config.FEATURE_FLAG_X ?? 'disabled'}`); // Using nullish coalescing