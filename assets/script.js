//setting empty url global variables so they can be called throughout document
var geocodeUrl ='';
var weatherUrl ='';
//setting empty lat and long variable to build urls later
var lat = 0;
var long = 0;
//selectors for name, icon, temp, windspeed, humidity, and uv on the jumbotron
var cityName = $("#city-name");
var currentIcon = $('#current-icon');
var temperature = $('#current-temp');
var windSpeed = $('#current-wind');
var humidity = $('#current-humidity');
var uvIndex = $('#current-uvIndex');
//selector for the container of the forecast cards
var forecastEl = $('#forecast');
//selector for the city that is being searched
var cityInput = $("#citySearch");
//selector for the array of buttons with pre-made city names in them
var supplyBtnEl = $('#supply-btns');
//global arrays to take in called data
var geocodeData = [];
var weatherData = [];
//api key for url build
var apiKey='4c94f4694462733770c73418781b71f1';
//setting the day
var today = moment().format("MMM Do");
//default possible cities to populate the buttons
var possibleCities = {
  0: {
    city: 'Orlando',
    btn: false}, 
  1:{ 
    city: 'New York',
    btn: false},
  2:{
    city: 'Boston',
    btn: false},
  3:{
    city: 'Chicago',
    btn: false},
  4:{
    city: 'San Francisco',
    btn: false},
  5:{
    city: 'Miami',
    btn: false},
  6:{
    city: 'Los Angeles',
    btn: false},
  7: {
    city: 'Seattle',
    btn: false}
  };
var possibleCitiesLength = Object.keys(possibleCities).length;

//empty array to populate buttons with recently searched cities in local storage
var recentlySearchedCities = [];
for (var i =0; i<=localStorage.length; i++){
  recentlySearchedCities.push(localStorage.getItem('city'+i));
}


//######################################### Get API ###########################################
function getAPI (e) {
  e.preventDefault();
  var searchCity = cityInput.val();
  geocodeUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+searchCity+'&limit=1&appid='+apiKey;
  fetch(geocodeUrl, {
      method: 'GET', //GET is the default.
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
  })
      .then(function (response) {
        //checking response before returing
        if (response.status == 200) {
        return response.json();
        }
      })
      .then(function (data) {
        saveSearchData();
        //saves the geocode to a global array, and then sets the lat and long of the city
        geocodeData = data[0];
        lat = geocodeData.lat;
        long = geocodeData.lon;
        //sets the jumbtron name to the searched city
        cityName.text(geocodeData.name+' ' + today);
        //uses lat and long to call for weather info
        weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&units=imperial&appid='+apiKey;
        fetch(weatherUrl, {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
          })
          .then(function (response) {
          return response.json();
          })
          .then(function (data) {
          //saves the weather data to global array
          weatherData = data;
          console.log(weatherData);
          })
       //generates the jumbotron stats and the future forecast stats
        .then(generateCurrentWeatherStats);
      });
        
     
}
//######################################### Set Jumbotron and Cards ###########################################

//sets up default jumbotron on load
function  setJumbotron() {
  cityName.text(today);
  currentIcon.attr('src', 'http://openweathermap.org/img/wn/01d@2x.png');
  temperature.text("Temp: \xB0F");
  windSpeed.text("Wind:  MPH");
  humidity.text("Humidity: %");
  uvIndex.text("UV Index: ");
}
//sets up default forecast cards on load
function setForecastCards() {
  for (var i=0; i<5; i++){ 
    var forecastDay = moment().add(i+1, 'day').format('M/D');
    var iconurl = 'http://openweathermap.org/img/wn/01d@2x.png';
    var card = $('<div>').addClass('card ').attr('id', i);
    var cardBody = $('<div>').addClass('card-body');
    var forecastDayTitle = $('<h5>').addClass('card-title').text(forecastDay);
    var iconDisplay = $('<img>').attr('src', iconurl);
    var temp = $('<p>').attr('id', 'forecast-temp').text('Temp: \xB0F');
    var wind = $('<p>').attr('id', 'forecast-wind').text('Wind:  MPH');
    var humidity = $('<p>').attr('id', 'forecast-humidity').text('Humidity: %');
    cardBody.append(forecastDayTitle, iconDisplay, temp, wind, humidity);
    card.append(cardBody);
    forecastEl.append(card);
}
}
//######################################### Generate Forecast, Curent, and Form Buttons ###########################################

//populates the forecast cards with data
function generateFutureForecast () { 
  for (var i=0; i<5; i++){
    var forecastCard = $('#'+i);
    console.log(forecastCard.val());
    var iconurl = 'http://openweathermap.org/img/wn/'+weatherData.daily[i].weather[0].icon+'@2x.png';
    forecastCard.find('img').attr('src', iconurl);
    forecastCard.find('#forecast-temp').text('Temp: '+weatherData.daily[i].temp.max+"\xB0F");
    forecastCard.find('#forecast-wind').text('Wind: '+weatherData.daily[i].wind_speed+" MPH");
    forecastCard.find('#forecast-humidity').text('Humidity: '+weatherData.daily[i].humidity+"%");
  }
}

//populates the jumbtron with weather data
function generateCurrentWeatherStats(){
  currentIcon.attr('src', 'http://openweathermap.org/img/wn/'+weatherData.current.weather[0].icon+'@2x.png');
  temperature.text("Temp: " +weatherData.current.temp+"\xB0F");
  windSpeed.text("Wind: "+ weatherData.current.wind_speed+" MPH");
  humidity.text("Humidity: "+ weatherData.current.humidity+"%");
  uvIndex.text("UV Index: "+ weatherData.current.uvi);
  generateFutureForecast();
}
//creates the pre-texted city buttons to put into the input
function generateSupplyBtns (){
  //adds locally stored items to the recently searched array
  for (var i=0; i<recentlySearchedCities.length-1; i++){
    console.log(recentlySearchedCities[i])
    //creates a button for each saved city
    var savedCity = recentlySearchedCities[i];
    
    supplyBtnEl.append($('<button>').addClass('btn btn-secondary col m-1').val(savedCity).text(savedCity));
  }
  //creates random buttons from the default
  function generateDefaultBtn () {
    var rndCity=possibleCities[Math.floor(Math.random()*8)];
    if (rndCity.btn == true){
      generateDefaultBtn();
    }
    else {
    supplyBtnEl.append($('<button>').addClass('btn btn-secondary col m-1').val(rndCity.city).text(rndCity.city));
    rndCity.btn=true;
    }
  }
  if (recentlySearchedCities.length<8)
  {
  for (var j=0; j< 8 - recentlySearchedCities.length; j++){
    generateDefaultBtn()
  }};
  };

//######################################### Save Search Data ###########################################

//saves searchdata with a key based on the number of saves
function saveSearchData () {
  //checks if local storage has less than the default buttons
  if (cityInput.val()!==''){
  //sets a stored boolean to check if local storage already contains recent search
    var stored = false;
    for (var i = 0; i < localStorage.length-1; i++){
    //checks if local storage has the searched city and returns true if it does
      if (cityInput.val()==localStorage.getItem('city'+i)){
      stored = true;
      }
    }
  //if the city isn't stored then it is added to local storage, recently searched array, and the number of saves is iterated
    if (stored == false){
    recentlySearchedCities.push(cityInput.val());
    localStorage.setItem('city'+localStorage.length, cityInput.val());
    }
    
    }
}
//######################################### Send City Input ###########################################

//gives the api a city to search for on the #searchBtn click below
//function supplyCity (event) {
  
//}

//######################################### Load ###########################################

function load(){
  generateSupplyBtns();
  setJumbotron();
  setForecastCards();
}

//event listeners for the search button as well as the pre-made city buttons
$('#searchBtn').on('click', getAPI);

supplyBtnEl.on('click','button', function (event){
  event.preventDefault();
  cityInput.val($(this).text());
  console.log(cityInput.val());
  getAPI(event);
});

//creates the defaults elements on the page
load();

  