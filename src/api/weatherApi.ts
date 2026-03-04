import type {
  GeoResult,
  WeatherApiResponse,
  WeatherData,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
} from "../types/weather";
import { getWeatherDescription } from "../utils/weatherCodes";

const WEATHER_BASE = "https://api.open-meteo.com/v1";

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchWeather(location: GeoResult): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weathercode",
      "windspeed_10m",
    ].join(","),
    hourly: ["temperature_2m", "weathercode", "precipitation"].join(","),
    daily: [
      "weathercode",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
    ].join(","),
    forecast_days: "7",
    timezone: "auto",
  });

  const res = await fetch(`${WEATHER_BASE}/forecast?${params}`);

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status} ${res.statusText}`);
  }

  const raw: WeatherApiResponse = await res.json();

  return parseWeatherResponse(raw, location);
}

// ─── Parsování ────────────────────────────────────────────────────────────────

function parseWeatherResponse(
  raw: WeatherApiResponse,
  location: GeoResult,
): WeatherData {
  return {
    location,
    current: parseCurrent(raw),
    hourly: parseHourly(raw),
    daily: parseDaily(raw),
  };
}

function parseCurrent(raw: WeatherApiResponse): CurrentWeather {
  const c = raw.current;

  // Precipitation = srážky aktuální hodiny z hourly[0]
  const precipitation = raw.hourly.precipitation[0] ?? 0;

  return {
    temperature: Math.round(c.temperature_2m),
    apparentTemperature: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    weatherCode: c.weathercode,
    description: getWeatherDescription(c.weathercode),
    windSpeed: Math.round(c.windspeed_10m),
    precipitation: Math.round(precipitation * 10) / 10,
    time: new Date(c.time),
  };
}

function parseHourly(raw: WeatherApiResponse): HourlyForecastItem[] {
  const { time, temperature_2m, weathercode } = raw.hourly;

  const now = new Date();
  const startIndex = time.findIndex((t) => new Date(t) >= now);
  const from = startIndex === -1 ? 0 : startIndex;

  return time.slice(from, from + 24).map((t, i) => ({
    time: new Date(t),
    temperature: Math.round(temperature_2m[from + i]),
    weatherCode: weathercode[from + i],
  }));
}

function parseDaily(raw: WeatherApiResponse): DailyForecastItem[] {
  const { time, weathercode, temperature_2m_max, temperature_2m_min } =
    raw.daily;

  return time.map((t, i) => ({
    date: new Date(t),
    weatherCode: weathercode[i],
    description: getWeatherDescription(weathercode[i]),
    tempMax: Math.round(temperature_2m_max[i]),
    tempMin: Math.round(temperature_2m_min[i]),
  }));
}
