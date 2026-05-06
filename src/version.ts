import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadPackageVersion() {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      version?: string;
    };

    return packageJson.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export const WEATHER_MCP_VERSION = loadPackageVersion();
