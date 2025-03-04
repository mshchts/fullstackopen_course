import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries';
// const allCountries = '/api/all';
// const searchedCountry = '/api/name/';

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/all`);
  return request.then(response => response.data);
};

export default { getAll };
