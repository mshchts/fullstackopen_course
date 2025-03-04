import axios from 'axios';

const api_key = import.meta.env.VITE_SOME_KEY;
// variable api_key now has the value set in startup

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const getWeather = city => {
  const url = `${baseUrl}?q=${city}&appid=${api_key}&units=metric`;
  return axios.get(url).then(response => response.data);
};

export default { getWeather };
