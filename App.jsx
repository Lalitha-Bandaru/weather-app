import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // 🌈 BACKGROUND CHANGE
  const getBackground = () => {
    const type = (weather?.type || "").toLowerCase();

    if (type.includes("rain")) {
      return "linear-gradient(135deg, #4e54c8, #8f94fb)";
    }

    if (type.includes("cloud")) {
      return "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    }

    if (type.includes("clear")) {
      return "linear-gradient(135deg, #fceabb, #f8b500)";
    }

    return "linear-gradient(135deg, #74ebd5, #9face6)";
  };

  // 🌤️ ICON
  const getWeatherIcon = (type) => {
    const t = (type || "").toLowerCase();

    if (t.includes("clear")) return "☀️";
    if (t.includes("cloud")) return "☁️";
    if (t.includes("rain")) return "🌧️";
    if (t.includes("thunder")) return "⛈️";
    if (t.includes("snow")) return "❄️";

    return "🌤️";
  };

  // 📍 LOCATION WEATHER
  const getMyLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );

          const data = await res.json();

          setWeather({
            name: "Your Location 📍",
            temp: data.current_weather.temperature,
            wind: data.current_weather.windspeed,
            type: "Current Weather",
          });

          setError("");
        } catch {
          setError("Failed to get location weather 😢");
        }
      },
      () => setError("Location permission denied 😢")
    );
  };

  // 🔥 AUTO LOCATION ON OPEN
  useEffect(() => {
    getMyLocationWeather();
  }, []);

  // 🔍 CITY WEATHER
  const getWeather = async () => {
    if (!city) return;

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      const geoData = await geoRes.json();

      if (!geoData.results) {
        setError("City not found 😢");
        setWeather(null);
        return;
      }

      const place = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`
      );

      const data = await weatherRes.json();

      setWeather({
        name: place.name,
        temp: data.current_weather.temperature,
        wind: data.current_weather.windspeed,
        type: "Weather",
      });

      setError("");
    } catch {
      setError("Something went wrong 😢");
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: getBackground(),
        transition: "0.5s",
        padding: "20px"
      }}
    >
      <h1>🌤️ Weather App Pro</h1>

      {/* SEARCH */}
      <div className="search">
        <input
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={getWeather}>Search</button>

        <button onClick={getMyLocationWeather}>
          📍 My Location
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* WEATHER CARD */}
      {weather && (
        <div className="card">
          <h2>{weather.name}</h2>

          <div style={{ fontSize: "60px" }}>
            {getWeatherIcon(weather.type)}
          </div>

          <h1>{weather.temp}°C</h1>
          <p>{weather.type}</p>
          <p>🌬️ {weather.wind} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;