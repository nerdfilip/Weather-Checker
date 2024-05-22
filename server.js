const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Permite CORS pentru toate solicitările
app.use(cors());

const port = 3000;
// Cheia API pentru OpenWeatherMap
const weatherApiKey = '8b7cee70fc8726302a5842f84dd7a5fe';

// Ruta pentru obținerea datelor meteo
app.get('/weather', (req, res) => {
  // Preia numele orașului din query string
  const city = req.query.city;
  // Construiește URL-ul pentru API-ul OpenWeatherMap
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`; // Specifică unitățile metrice

  // Efectuează cererea fetch la API-ul OpenWeatherMap
  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      // Verifică dacă codul răspunsului este diferit de 200 (OK)
      if (data.cod !== 200) {
        throw new Error(`Failed to fetch data for ${city}`);
      }
      // Trimite datele meteo în format JSON
      res.json(data);
    })
    .catch(error => {
      // Gestionează erorile de la fetch
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    });
});

// Pornește serverul și ascultă pe portul specificat
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});