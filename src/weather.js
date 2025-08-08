import React, { useState } from 'react';
import './Weather.css';

const WeatherApp = () => {
  const [city, setCity] = useState('Chennai');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key

  const fetchWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setErrorMsg("Please enter a city name.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setErrorMsg('');
      } else {
        setWeatherData(null);
        setErrorMsg('City not found!');
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setErrorMsg('Something went wrong while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const detailInfo = {
    humidity:
      "Humidity measures how much water vapor is in the air. High humidity can make temperatures feel warmer.",
    wind:
      "Wind speed measures how fast air is moving. Higher speeds can make temperatures feel cooler.",
    pressure:
      "Atmospheric pressure is the force exerted by air. Low pressure often indicates stormy weather.",
  };

  return (
    <div>
      <form className="search-section" onSubmit={fetchWeather}>
        <input
          type="text"
          placeholder="Enter city..."
          className="search-box"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {errorMsg && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '-15px' }}>
          {errorMsg}
        </p>
      )}

      <div className="container">
        {weatherData && weatherData.main && (
          <div className="weather-container">
            <div className="temp-summary">
              <div className="maxi">Max: {weatherData.main.temp_max}°C</div>
              <div className="mini">Min: {weatherData.main.temp_min}°C</div>
            </div>

            <div className="main-weather">
              <h2 className="city">{weatherData.name}</h2>

              <div className="temperature-section">
                <h1 className="temperature">{Math.round(weatherData.main.temp)}°C</h1>
                {weatherData.weather[0].icon && (
                  <img
                    src={getWeatherIconUrl(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].main}
                    className="weather-icon"
                  />
                )}
              </div>
            </div>

            <p className="description">{weatherData.weather[0].description}</p>

            <div className="extra-details">
              <div className="detail humidity-box" data-tooltip={detailInfo.humidity}>
                <div className="detail-title">Humidity</div>
                <div className="detail-value">{weatherData.main.humidity}%</div>
              </div>
              <div className="detail wind-box" data-tooltip={detailInfo.wind}>
                <div className="detail-title">Wind</div>
                <div className="detail-value">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</div>
              </div>
              <div className="detail pressure-box" data-tooltip={detailInfo.pressure}>
                <div className="detail-title">Pressure</div>
                <div className="detail-value">{weatherData.main.pressure} hPa</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
