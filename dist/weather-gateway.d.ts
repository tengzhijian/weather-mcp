export interface WeatherData {
    city: string;
    temperature: number;
    humidity: number;
    description: string;
    windSpeed: number;
    updatedAt: string;
}
export interface WeatherGatewayOptions {
    fetch?: typeof fetch;
    timeoutMs?: number;
}
export declare class WeatherGatewayError extends Error {
    code: string;
    city?: string;
    status?: number;
    constructor(input: {
        code: string;
        message: string;
        city?: string;
        status?: number;
    });
}
export declare function fetchWeather(city: string, options?: WeatherGatewayOptions): Promise<WeatherData>;
export declare function createWeatherGateway(options?: WeatherGatewayOptions): {
    getWeather(city: string): Promise<{
        ok: true;
        data: WeatherData;
    }>;
};
export type WeatherGateway = ReturnType<typeof createWeatherGateway>;
//# sourceMappingURL=weather-gateway.d.ts.map