import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Define the expected return type (can be refined later)
export type LoadedConfig = Record<string, string | undefined>;

/**
 * Loads configuration from .env files and process.env, merging them.
 * Precedence Order (Highest to Lowest):
 * 1. System Environment Variables (process.env)
 * 2. Environment-specific file (.env.[NODE_ENV])
 * 3. Default .env file
 *
 * @param options - Configuration options.
 * @param options.projectRoot - Optional path to the project root containing .env files. Defaults to process.cwd().
 * @returns The merged configuration object.
 */
export function loadSmartConfig(options?: { projectRoot?: string }): LoadedConfig {
    const projectRoot = options?.projectRoot || process.cwd();
    const nodeEnv = process.env.NODE_ENV;

    const defaultEnvPath = path.resolve(projectRoot, '.env');
    const environmentEnvPath = nodeEnv ? path.resolve(projectRoot, `.env.${nodeEnv}`) : null;

    let combinedConfig: LoadedConfig = {};

    // 1. Load default .env file (if exists)
    if (fs.existsSync(defaultEnvPath)) {
        try {
            const defaultEnvConfig = dotenv.parse(fs.readFileSync(defaultEnvPath));
            combinedConfig = { ...combinedConfig, ...defaultEnvConfig };
            console.log(`Loaded config from: ${defaultEnvPath}`);
        } catch (err) {
            console.warn(`Warning: Could not parse ${defaultEnvPath}`, err);
        }
    }

    // 2. Load environment-specific .env file (if exists) and merge ON TOP of default
    if (environmentEnvPath && fs.existsSync(environmentEnvPath)) {
        try {
            const environmentEnvConfig = dotenv.parse(fs.readFileSync(environmentEnvPath));
            combinedConfig = { ...combinedConfig, ...environmentEnvConfig }; // Override base .env
            console.log(`Loaded config from: ${environmentEnvPath}`);
        } catch (err) {
            console.warn(`Warning: Could not parse ${environmentEnvPath}`, err);
        }
    }

    // 3. Merge system environment variables ON TOP of file configs
    //    Only merge variables that are explicitly set (not inherited prototype stuff)
    const systemEnv: LoadedConfig = {};
    for (const key in process.env) {
        if (Object.prototype.hasOwnProperty.call(process.env, key)) {
            systemEnv[key] = process.env[key];
        }
    }
    combinedConfig = { ...combinedConfig, ...systemEnv }; // process.env overrides file values

    console.log('Final merged config loaded (values may be overridden by process.env)');
    return combinedConfig;
}

// Export the main function
export default loadSmartConfig;