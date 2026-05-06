export class WeatherGatewayError extends Error {
    code;
    city;
    status;
    constructor(input) {
        super(input.message);
        this.name = 'WeatherGatewayError';
        this.code = input.code;
        this.city = input.city;
        this.status = input.status;
    }
}
const DEFAULT_TIMEOUT_MS = 10_000;
// 使用 Open-Meteo 免费天气 API (无需 API Key)
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEO_API_BASE = 'https://geocoding-api.open-meteo.com/v1';
// WMO Weather interpretation codes
function getWeatherDescription(code) {
    const codes = {
        0: '晴朗',
        1: '主要晴朗', 2: '部分多云', 3: '多云',
        45: '雾', 48: '沉积雾',
        51: '毛毛雨', 53: '中度毛毛雨', 55: '密集毛毛雨',
        61: '小雨', 63: '中雨', 65: '大雨',
        71: '小雪', 73: '中雪', 75: '大雪',
        95: '雷雨', 96: '雷雨伴有冰雹', 99: '强雷雨伴有冰雹'
    };
    return codes[code] ?? '未知天气';
}
export async function fetchWeather(city, options = {}) {
    const fetchImpl = options.fetch ?? fetch;
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        // 1. 获取城市坐标
        const geoUrl = `${GEO_API_BASE}/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`;
        const geoResponse = await fetchImpl(geoUrl, { signal: controller.signal });
        if (!geoResponse.ok) {
            throw new WeatherGatewayError({
                code: 'geo_api_error',
                message: `地理编码 API 错误: ${geoResponse.status}`,
                city,
                status: geoResponse.status
            });
        }
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            throw new WeatherGatewayError({
                code: 'city_not_found',
                message: `未找到城市: ${city}`,
                city
            });
        }
        const { latitude, longitude, name, country } = geoData.results[0];
        // 2. 获取天气数据
        const weatherUrl = `${WEATHER_API_BASE}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`;
        const weatherResponse = await fetchImpl(weatherUrl, { signal: controller.signal });
        if (!weatherResponse.ok) {
            throw new WeatherGatewayError({
                code: 'weather_api_error',
                message: `天气 API 错误: ${weatherResponse.status}`,
                city,
                status: weatherResponse.status
            });
        }
        const weatherData = await weatherResponse.json();
        const current = weatherData.current_weather;
        return {
            city: `${name} (${country})`,
            temperature: current.temperature,
            humidity: weatherData.hourly.relativehumidity_2m[0] ?? 0,
            description: getWeatherDescription(current.weathercode),
            windSpeed: current.windspeed,
            updatedAt: new Date().toISOString()
        };
    }
    catch (error) {
        if (error instanceof WeatherGatewayError) {
            throw error;
        }
        if (error instanceof Error && error.name === 'AbortError') {
            throw new WeatherGatewayError({
                code: 'timeout',
                message: `请求超时 (${timeoutMs}ms)`,
                city
            });
        }
        throw new WeatherGatewayError({
            code: 'network_error',
            message: error instanceof Error ? error.message : '网络错误',
            city
        });
    }
    finally {
        clearTimeout(timeoutId);
    }
}
export function createWeatherGateway(options = {}) {
    return {
        async getWeather(city) {
            const data = await fetchWeather(city, options);
            return {
                ok: true,
                data
            };
        }
    };
}
//# sourceMappingURL=weather-gateway.js.map