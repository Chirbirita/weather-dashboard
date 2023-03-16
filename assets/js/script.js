
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIkey = "5f2721207aa80036d47d268cb258589b";
let searchHistory = []

let searchInput = $("#search-input")
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history")

function renderSearchHistory() {
    searchHistoryContainer.html("")

    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button")
        btn.addClass("history-btn btn-history")

        btn.attr("data-search", searchHistory[i])
        btn.text(searchHistory[i])
        searchHistoryContainer.append(btn)

    }
}

function appendSearchHistory(search) {
    if (searchHistory.indexOf(search) !== -1) {
        return
    }
    searchHistory.push(search)

    localStorage.setItem("search-history", JSON.stringify(searchHistory))
    renderSearchHistory()
}

function renderCurrentWeather(city, weatherData) {
    let date = moment().format("DD/MM/YYYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];

}

function fetchWeather(location) {
    //console.log(location);
    let latitude = location.lat;
    let longitude = location.lon;

    let city = location.name;

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon${longitude}&units=metric&appid=${weatherAPIkey}`

    console.log(queryWeatherURL)

    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function (response) {
        renderCurrentWeather(city, response.list[0]);
        //renderForecast(data.list);
    })


}

function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIkey}`
    //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

    console.log(queryURL)

    fetch(queryURL, { method: "GET" })
        .then(function (data) {
            return data.json()
        })
        .then(function (response) {
            if (!response[0]) {
                alert("Location not found")
            } else {
                appendSearchHistory(search)
                fetchWeather(response[0])
            }
        })
}

function initialiseHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if (storedHistory) {

        searchHistory = JSON.parse(storedHistory);
        renderSearchHistory()
    }
}


function submitSearchForm(event) {

    event.preventDefault();
    let search = searchInput.val().trim();


    fetchCoord(search);
    searchInput.val("");
}

initialiseHistory()
searchForm.on("submit", submitSearchForm);















