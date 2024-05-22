function getWeather() {
    // Preia numele orașului din câmpul de text
    var city = document.getElementById('city').value;
    // Construiește URL-ul pentru API-ul meteo
    const url = `http://localhost:3000/weather?city=${city}`;

    // Efectuează cererea fetch la API-ul meteo
    fetch(url)
        .then(response => {
            // Verifică dacă răspunsul rețelei este ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Transformă răspunsul în format JSON
            return response.json();
        })
        .then(data => {
            // Actualizează afișajul vremii cu datele noi
            updateWeatherDisplay(data);
        })
        .catch(err => {
            // Gestionează erorile de la fetch
            console.error('Error fetching the weather data:', err);
            document.getElementById('weatherResults').innerHTML = '<p>Error fetching weather data. Please check the city name and try again.</p>';
        });
}

function windDirection(degree) {
    // Direcțiile vântului pe baza gradelor
    const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Vest', 'Vest', 'Nord-Vest'];
    // Calcularea indexului direcției pe baza gradelor
    const index = Math.floor((degree + 22.5) / 45);
    // Returnează direcția vântului
    return directions[index % 8];
}

function updateWeatherDisplay(data) {
    // Verifică dacă datele primite sunt valide
    if (!data || !data.main || !data.weather || !data.wind || !data.sys) {
        console.error('Invalid data format:', data);
        document.getElementById('weatherResults').innerHTML = '<p>Invalid weather data received. Please try again later.</p>';
        return;
    }

    // Preluare temperatură în Celsius direct de la API
    const tempC = data.main.temp;
    // Convertire Celsius în Fahrenheit
    const tempF = tempC * 9/5 + 32;
    // Preluare descrierea vremii
    const description = data.weather[0].description;
    // Preluare viteza vântului
    const windSpeed = data.wind.speed;
    // Calculare direcția vântului
    const windDeg = windDirection(data.wind.deg);
    // Preluare umiditate
    const humidity = data.main.humidity;

    // Preluare fus orar și calculare ora locală pentru răsărit și apus
    const timezoneOffset = data.timezone;
    const sunrise = new Date((data.sys.sunrise + timezoneOffset) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    const sunset = new Date((data.sys.sunset + timezoneOffset) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

    // Determinare dacă este necesară umbrela
    const needUmbrella = description.includes('rain') ? "Yes, take an umbrella." : "No umbrella needed.";
    // Determinare dacă este necesar paltonul
    const needCoat = tempF < 50 ? "Yes, wear a coat." : "No coat needed.";

    // Actualizare HTML cu informațiile meteo
    document.getElementById('weatherResults').innerHTML = `
        <h3><i class="fas fa-temperature-high icon"></i> Weather in ${data.name}</h3>
        <p><i class="fas fa-thermometer-half icon"></i> Temperature: ${tempC.toFixed(1)}°C (${tempF.toFixed(1)}°F)</p>
        <p><i class="fas fa-tint icon"></i> Humidity: ${humidity}%</p>
        <p><i class="fas fa-cloud-rain icon"></i> Description: ${description}</p>
        <p><i class="fas fa-wind icon"></i> Wind: ${windSpeed} m/s, Direction: ${windDeg}</p>
        <p><i class="fas fa-sun icon"></i> Sunrise: ${sunrise}</p>
        <p><i class="fas fa-moon icon"></i> Sunset: ${sunset}</p>
        <p>Day advice: ${tempF >= 70 && description === 'clear' ? 'It\'s a beautiful day!' : 'It\'s not clear today.'}</p>
        <p>${needUmbrella}</p>
        <p>${needCoat}</p>
    `;
}
