import React, { useState, useEffect } from "react";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import wind_icon from "../assets/wind.png";
import snow_icon from "../assets/snow.png";
import current_icon from "../assets/current_location.png";
import "./weather.css";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ must import CSS

export const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [loader, setLoader] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "04d": cloud_icon,
    "04n": drizzle_icon,
    "09d": drizzle_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // ✅ Get weather by city
  const searchByCity = async (cityName) => {
    if (!cityName) {
      toast.warn("⚠️ Please enter a city name!");
      return;
    }

    try {
      setLoader(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=5167bd5f62268a107f176419f56c1ddf`;
      const response = await fetch(url);
      const data = await response.json();
      setLoader(false);
      setCity(""); // clear input

      if (data.cod !== 200) {
        toast.error(`❌ ${data.message}`);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: allIcons[data.weather[0].icon] || clear_icon,
      });

      toast.success(`✅ Weather updated for ${data.name}`);
    } catch (error) {
      toast.error("❌ Error fetching weather data");
      setLoader(false);
    }
  };

  // ✅ Get weather by coordinates
  const searchByCoords = async (lat, lon) => {
    try {
      setLoader(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=5167bd5f62268a107f176419f56c1ddf`;
      const response = await fetch(url);
      const data = await response.json();
      setLoader(false);

      if (data.cod !== 200) {
        toast.error(`❌ ${data.message}`);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: allIcons[data.weather[0].icon] || clear_icon,
      });

      toast.success(`✅ Weather updated for ${data.name}`);
    } catch (error) {
      toast.error("❌ Error fetching weather data");
      setLoader(false);
    }
  };

  // ✅ Current location weather
  const handleCurrentLocation = () => {
    setCity("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          searchByCoords(latitude, longitude);
        },
        () => {
          toast.error("❌ Unable to retrieve your location");
        }
      );
    } else {
      toast.error("❌ Geolocation not supported by your browser");
    }
  };

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchByCity(city);
        }}
        className="weather"
      >
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <img
            src={search_icon}
            alt="search"
            onClick={() => searchByCity(city)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {loader && <Spinner />}

        {!loader && weatherData && (
          <>
            <img src={weatherData.icon} alt="" className="weather-icon" />
            <p className="temperature">{weatherData.temperature} °C</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
            <div className="set-current">
              <img
                onClick={handleCurrentLocation}
                src={current_icon}
                alt="current"
              />
            </div>
          </>
        )}
      </form>

      {/* ✅ Toast container must be at root */}
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </>
  );
};
