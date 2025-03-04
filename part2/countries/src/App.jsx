import { useState, useEffect } from 'react';
import countriesService from './services/countries';
import weatherService from './services/weather';
import './App.css';

const Filter = ({ handleFilterName }) => {
  return (
    <div>
      find countries:
      <input name="country" type="text" onChange={handleFilterName} />
    </div>
  );
};
const Country = ({ selectedCountry, weather }) => {
  // console.log('weather ==> ', weather);
  // console.log('COUNTRY component ==> ', selectedCountry);

  const languages = selectedCountry.languages;
  const imgSource = selectedCountry.flags.svg;

  return (
    <div>
      <h1>{selectedCountry.name.common}</h1>
      <p>Capital {selectedCountry.capital[0]}</p>
      <p>Area {selectedCountry.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.entries(languages).map(([key, map]) => (
          <li key={key}>{map}</li>
        ))}
      </ul>
      <img src={imgSource} alt={`Flag of ${selectedCountry.name.common}`}></img>

      {!weather ? (
        <p>Loading weather...</p>
      ) : (
        <div>
          <h3>Weather in {weather.name}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Icon ${weather.weather[0].description}`}
          ></img>
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const Countries = ({ filteredCountries, filteredText, handleSetCountry }) => {
  // console.log('filteredCountries ==> ', filteredCountries);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      handleSetCountry(filteredCountries[0]);
    }
  }, [filteredCountries, handleSetCountry]);

  if (
    filteredText === null ||
    filteredText === '' ||
    filteredText === undefined
  ) {
    return;
  }

  if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
    return (
      <ul>
        {filteredCountries.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleSetCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  } else if (filteredCountries.length === 1) {
    // handleSetCountry(filteredCountries[0]);
    return null;
  } else {
    return <p>Too many matches, please specify another filter.</p>;
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredText, setFilteredText] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService.getAll().then(allCountries => {
      setCountries(allCountries);
    });
  }, []);

  const handleFilterName = event => {
    setFilteredText(event.target.value);
    setSelectedCountry(null);
    setWeather(null);
    // console.log('handleFilterName event.target.value ==> ', event.target.value);
  };

  const filteredCountries = filteredText
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(filteredText.toLowerCase())
      )
    : countries;

  const handleSetCountry = country => {
    console.log('handleSetCountry country ==> ', country);
    // if (selectedCountry.capital[0] !== country.capital) {
    setSelectedCountry(country);
    // }
    // const capital = selectedCountry.capital[0];
    const capital = country.capital[0];

    if (capital) {
      weatherService
        .getWeather(capital)
        .then(weatherData => {
          console.log('weather ==> ', weatherData);
          setWeather(weatherData);
        })
        .catch(err => {
          console.error('Error fetching weather', err);
          setWeather(null);
        });
    }
  };

  return (
    <>
      {/* <h1>Countries</h1> */}
      <Filter handleFilterName={handleFilterName} />
      {selectedCountry ? (
        <Country selectedCountry={selectedCountry} weather={weather} />
      ) : (
        <Countries
          filteredCountries={filteredCountries}
          filteredText={filteredText}
          handleSetCountry={handleSetCountry}
        />
      )}
    </>
  );
}

export default App;
