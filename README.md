# Weather MCP

[![CI](https://github.com/yourusername/weather-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/weather-mcp/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/weather-mcp.svg)](https://www.npmjs.com/package/weather-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个简单易用的天气查询 MCP 工具，支持 CLI 命令行和 MCP Server 两种使用方式。

## 功能特性

- 🌤️ **实时天气查询** - 获取全球任意城市的当前天气
- 🔧 **CLI 支持** - 命令行直接查询天气
- 🤖 **MCP 协议** - 支持 Claude、Cursor 等 AI 客户端
- 🌍 **全球覆盖** - 支持中文、英文等多种语言城市名
- ⚡ **免费 API** - 使用 Open-Meteo 免费天气服务，无需 API Key
- 📝 **类型安全** - TypeScript + Zod 全面类型支持

## 安装

### 方式一：npm 全局安装（推荐）

```bash
npm install -g weather-mcp
```

### 方式二：npx 直接使用

```bash
npx weather-mcp weather 北京
```

### 方式三：源码安装

```bash
git clone https://github.com/tengzhijian/weather-mcp.git
cd weather-mcp
npm install
npm run build
```

## CLI 使用

```bash
# 查询天气
weather-mcp weather 北京
weather-mcp weather Shanghai

# 查看帮助
weather-mcp --help
weather-mcp --version
```

### 示例输出

```json
{
  "ok": true,
  "data": {
    "city": "北京 (中国)",
    "temperature": 22,
    "humidity": 70,
    "description": "多云",
    "windSpeed": 9.3,
    "updatedAt": "2024-01-15T08:30:00.000Z"
  }
}
```

## MCP Server 配置

### Claude Desktop

编辑 `%APPDATA%/Claude/settings.json`（Windows）或 `~/Library/Application Support/Claude/settings.json`（Mac）：

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "weather-mcp", "--mcp"]
    }
  }
}
```

### Cursor

在 Cursor Settings → MCP 中添加：

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "weather-mcp", "--mcp"]
    }
  }
}
```

### 本地开发版本

如果你从源码运行：

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/weather-mcp/dist/index.js", "--mcp"]
    }
  }
}
```

## 可用工具

### getWeather

查询指定城市的天气信息。

**参数：**
- `city` (string, 必需): 城市名称，例如：北京、上海、广州、London、Tokyo

**返回：**
- `city`: 城市名称（包含国家）
- `temperature`: 温度（摄氏度）
- `humidity`: 湿度（百分比）
- `description`: 天气描述（晴朗、多云等）
- `windSpeed`: 风速（km/h）
- `updatedAt`: 数据更新时间

### listSupportedCities

获取支持查询的城市列表示例。

**返回：**
- `cities`: 常用城市列表示例
- `note`: 说明（实际上支持全球任何城市）

## AI 客户端使用示例

配置完成后，在 Claude、Cursor 等客户端中可以直接询问：

> "北京今天天气怎么样？"
> "上海明天会下雨吗？"
> "查询一下纽约的天气"

AI 会自动调用 `getWeather` 工具获取天气信息。

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev weather 北京

# 运行测试
npm test

# 类型检查
npm run typecheck

# 构建
npm run build
```

## 技术栈

- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Model Context Protocol
- [Commander.js](https://github.com/tj/commander.js/) - CLI 框架
- [Zod](https://github.com/colinhacks/zod) - Schema 验证
- [Vitest](https://vitest.dev/) - 测试框架
- [Open-Meteo](https://open-meteo.com/) - 免费天气 API

## 项目结构

```
weather-mcp/
├── src/
│   ├── index.ts           # 入口文件
│   ├── cli.ts             # CLI 命令
│   ├── mcp-server.ts      # MCP Server
│   ├── weather-gateway.ts # 天气 API 封装
│   └── version.ts         # 版本号
├── tests/                 # 测试文件
├── .github/workflows/     # GitHub Actions
├── package.json
├── tsconfig.json
└── README.md
```

## CI/CD

项目使用 GitHub Actions 实现自动化：

- **CI**: 每次 PR 和 Push 时自动运行测试（Node.js 18/20/22）
- **Release**: 手动触发发布到 npm

## 许可证

[MIT](LICENSE)

## 致谢

- 天气数据由 [Open-Meteo](https://open-meteo.com/) 提供免费 API 支持
- 遵循 [Model Context Protocol](https://modelcontextprotocol.io/) 规范
