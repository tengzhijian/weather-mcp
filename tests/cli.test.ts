import { describe, it, expect } from 'vitest';
import { runCli } from '../src/cli.js';

describe('cli', () => {
  it('should show help', async () => {
    const result = await runCli(['--help']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('weather-mcp');
    expect(result.stdout).toContain('天气查询');
  });

  it('should show version', async () => {
    const result = await runCli(['--version']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should query weather for a city', async () => {
    const result = await runCli(['weather', '上海']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('ok');
    expect(result.stdout).toContain('temperature');
  }, 30000);

  it('should handle non-existent city gracefully', async () => {
    const result = await runCli(['weather', 'XYZ123NONEXISTENT']);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('city_not_found');
  });
});
