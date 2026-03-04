// ─── Geocoding ────────────────────────────────────────────────────────────────

export interface GeoResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface GeocodingResponse {
  results?: GeoResult[];
}

// ─── Open-Meteo API raw response ──────────────────────────────────────────────

export interface CurrentWeatherRaw {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weathercode: number;
  windspeed_10m: number;
}

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  precipitation: number[]; // mm za danou hodinu
}

export interface DailyWeatherRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherApiResponse {
  current: CurrentWeatherRaw;
  hourly: HourlyWeatherRaw;
  daily: DailyWeatherRaw;
}

// ─── Internal models ───────────────────────────────────────────────────────────

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  description: string;
  windSpeed: number; // km/h (převod na mph v utils)
  precipitation: number; // mm aktuální hodiny (převod na in v utils)
  time: Date;
}

export interface HourlyForecastItem {
  time: Date;
  temperature: number;
  weatherCode: number;
}

export interface DailyForecastItem {
  date: Date;
  weatherCode: number;
  description: string;
  tempMax: number;
  tempMin: number;
}

export interface WeatherData {
  location: GeoResult;
  current: CurrentWeather;
  hourly: HourlyForecastItem[]; // příštích 24h
  daily: DailyForecastItem[]; // 7 dní
}

// ─── Units ────────────────────────────────────────────────────────────────────

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";
export type PrecipitationUnit = "mm" | "in";

export interface Units {
  temperature: TemperatureUnit;
  wind: WindUnit;
  precipitation: PrecipitationUnit;
}

// ─── Hook state ────────────────────────────────────────────────────────────────

export type WeatherStatus = "idle" | "loading" | "success" | "error";

export interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  error: string | null;
}
