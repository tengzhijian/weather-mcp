import { describe, it, expect } from 'vitest';
import { fetchWeather, WeatherGatewayError } from '../src/weather-gateway.js';

describe('weather-gateway', () => {
  it('should return weather data for valid city', async () => {
    const weather = await fetchWeather('北京');

    expect(weather).toHaveProperty('city');
    expect(weather).toHaveProperty('temperature');
    expect(weather).toHaveProperty('humidity');
    expect(weather).toHaveProperty('description');
    expect(weather).toHaveProperty('windSpeed');
    expect(weather).toHaveProperty('updatedAt');

    expect(typeof weather.temperature).toBe('number');
    expect(typeof weather.humidity).toBe('number');
  });

  it('should throw error for non-existent city', async () => {
    await expect(fetchWeather('不存在的城市12345')).rejects.toThrow(WeatherGatewayError);
  });

  it('should work with English city names', async () => {
    const weather = await fetchWeather('London');
    expect(weather).toHaveProperty('city');
    // API 可能返回本地化的城市名
    expect(weather.city.length).toBeGreaterThan(0);
  });
});
