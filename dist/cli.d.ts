import { Command } from 'commander';
export interface RunCliResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
export declare function createProgram(): Command;
export declare function runCli(argv: string[]): Promise<RunCliResult>;
//# sourceMappingURL=cli.d.ts.map