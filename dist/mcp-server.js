import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';
import { fetchWeather } from './weather-gateway.js';
import { WEATHER_MCP_VERSION } from './version.js';
export function shouldRunMcpServer(argv) {
    return argv.includes('--mcp') || argv[0] === 'mcp-serve';
}
export async function createMcpServer() {
    const server = new McpServer({
        name: 'weather-mcp',
        version: WEATHER_MCP_VERSION
    });
    // 注册天气查询工具
    server.registerTool('getWeather', {
        description: '查询指定城市的当前天气信息',
        inputSchema: {
            city: z.string().min(1).describe('城市名称，例如：北京、上海、广州')
        }
    }, async ({ city }) => {
        try {
            const weather = await fetchWeather(city);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            ok: true,
                            data: weather
                        }, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            if (error instanceof Error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                ok: false,
                                error: {
                                    code: 'weather_error',
                                    message: error.message
                                }
                            }, null, 2)
                        }
                    ],
                    isError: true
                };
            }
            throw error;
        }
    });
    // 注册城市列表工具（演示用）
    server.registerTool('listSupportedCities', {
        description: '获取支持查询天气的城市列表示例',
        inputSchema: {}
    }, async () => {
        const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        ok: true,
                        data: {
                            cities,
                            note: '实际上支持全球任何城市，这里只是常用示例'
                        }
                    }, null, 2)
                }
            ]
        };
    });
    return server;
}
export async function runMcpServer() {
    const server = await createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
//# sourceMappingURL=mcp-server.js.map