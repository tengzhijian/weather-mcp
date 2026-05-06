import { Command, CommanderError } from 'commander';
import { createWeatherGateway, WeatherGatewayError } from './weather-gateway.js';
import { WEATHER_MCP_VERSION } from './version.js';

export interface RunCliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function serializeError(error: unknown): string {
  if (error instanceof WeatherGatewayError) {
    return JSON.stringify(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          city: error.city,
          status: error.status
        }
      },
      null,
      2
    );
  }

  if (error instanceof Error) {
    return JSON.stringify(
      {
        ok: false,
        error: {
          code: 'unknown_error',
          message: error.message
        }
      },
      null,
      2
    );
  }

  return JSON.stringify(
    {
      ok: false,
      error: {
        code: 'unknown_error',
        message: '未知错误'
      }
    },
    null,
    2
  );
}

export function createProgram() {
  const program = new Command();

  program
    .name('weather-mcp')
    .description('天气查询 MCP 工具')
    .version(WEATHER_MCP_VERSION);

  program
    .command('weather <city>')
    .description('查询城市天气')
    .action(async (city: string) => {
      const gateway = createWeatherGateway();
      const result = await gateway.getWeather(city);
      console.log(JSON.stringify(result, null, 2));
    });

  return program;
}

export async function runCli(argv: string[]): Promise<RunCliResult> {
  let stdout = '';
  let stderr = '';

  const program = createProgram();
  program.configureOutput({
    writeOut: (str) => { stdout += str; },
    writeErr: (str) => { stderr += str; },
    outputError: (str, write) => { write(str); }
  });
  program.exitOverride();

  // 捕获 console.log/console.error
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => { stdout += args.join(' ') + '\n'; };
  console.error = (...args) => { stderr += args.join(' ') + '\n'; };

  try {
    await program.parseAsync(argv, { from: 'user' });    return {
      exitCode: 0,
      stdout,
      stderr
    };
  } catch (error) {
    if (error instanceof CommanderError) {
      return {
        exitCode: error.exitCode,
        stdout,
        stderr
      };
    }

    stderr += serializeError(error) + '\n';

    return {
      exitCode: 1,
      stdout,
      stderr
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}
