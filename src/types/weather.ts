// Geocoding

export interface GeoResult {
  id: number;
  name: string;
  country: string;
  country_code: string;
  admin1?: string; // region/state
  latitude: number;
  longitude: number;
}

export interface GeocodingResponse {
  results?: GeoResult[];
}

// Open-Meteo API raw response

export interface CurrentWeatherRaw {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weathercode: number;
  windspeed_10m: number;
  winddirection_10m: number;
  surface_pressure: number;
  visibility: number;
}

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  precipitation_probability: number[];
}

export interface DailyWeatherRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface WeatherApiResponse {
  current: CurrentWeatherRaw;
  hourly: HourlyWeatherRaw;
  daily: DailyWeatherRaw;
}

// Internal models (used in components)

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  time: Date;
}

export interface HourlyForecastItem {
  time: Date;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface DailyForecastItem {
  date: Date;
  weatherCode: number;
  description: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherData {
  location: GeoResult;
  current: CurrentWeather;
  hourly: HourlyForecastItem[]; // next 24h
  daily: DailyForecastItem[]; // next 7 days
}

// Hook state

export type WeatherStatus = "idle" | "loading" | "success" | "error";

export interface WeatherState {
  status: WeatherStatus;
  data: WeatherData | null;
  error: string | null;
}
