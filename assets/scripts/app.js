//var map;
$(document).ready(function () {

    
    $("#submitBtn").click(function () {
        console.log("TEST");
//         hide and clear existing fields
        $("#result").addClass('hidden');
        $("#googleMap").addClass('hidden');

        clearFields();
        getData();

        $("#googleMap").removeClass('hidden');
        $("#result").removeClass('hidden');
        return false;
    });
});

// use the CODE (two digit number) to replace the '30' in the below example
// EXAMPLE: var imgBaseURL"<img src='http://l.yimg.com/a/i/us/we/52/30.gif'/>"
var _imgBaseURL = "<img src='http://l.yimg.com/a/i/us/we/52/";
var _imgBackURL = ".gif'/>";

var _baseURL = "https://query.yahooapis.com/v1/public/yql?q=";
var _geoLocationQuery = "select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D'";
//var latitude = "";
//var longitude = "";
var jsonData = "";

function handleResult(json){
        $.each(json, function (i, field) {
            jsonData = field.results.channel;
            console.log(jsonData);
             $("#desc").text(jsonData);
            setFields();
            myMap();
        });
}

function getData() {
    jsonData = "";
    var geoLocationQuery = _geoLocationQuery;
    var baseURL = _baseURL;

    // create URL with user's query strings
    var userInput = $("#userLocation").val();
//     console.log("User input: " + userInput);
    geoLocationQuery += encodeURI(userInput);
    geoLocationQuery += "')&format=json";
    baseURL += geoLocationQuery;

    $.getJSON(baseURL, handleResult);
}
function setFields(){
    setCurrentWeather();
    setForecasts();
}
function setCurrentWeather() {
    
//    // UPDATE BACKGROUND BASED ON CURRENT TIME
//    var currentTime = jsonData.lastBuildDate;
//    console.log(currentTime);
    
    
    // FORMAT TITLE
    var title = jsonData.item.title.split(' ');
    var splitIndex = title.indexOf('at');
    var formattedTitle = title.slice(0,splitIndex).join(" ");
    
    // FORMAT CURRENT TIME
    var time = jsonData.lastBuildDate.split(' ');
    var formattedTime = time[4] + ' ' + time[5] + ' ' + time[6];
    
    $("#currentWeather").append('<h4>' + formattedTitle + '</h4>');
    $("#currentWeather").append('<h6>as of ' + formattedTime + '</h6>');
    
    
    var temp = jsonData.item.condition.temp;
    $("#currentWeatherImg").append('<h2 id="temp">' + temp + '&#176;F</h2>');
    
//    $("#cityState").text($("#userLocation").val().toUpperCase());
//    $("#lat").text(jsonData.item.lat);
//    $("#lon").text(jsonData.item.long);
//    $("#date").text(jsonData.item.condition.date);
//    $("#temp").text(jsonData.item.condition.temp).append('&#176;F');
//    $("#desc").text(jsonData.item.condition.text);
    
    
    
    
    
    // ADD CURRENT WEATHER CODE AS IMAGE
    var currentImg = _imgBaseURL + jsonData.item.condition.code + _imgBackURL;
    $("#currentWeatherImg").append(currentImg);
}

function setForecasts() {
    $("#forecast").append("<h3 class='text-center'>10-Day Forecast</h3>");

    var forecasts = jsonData.item.forecast;
    var para = "";

    for (var i = 0; i < 2; i++) { // 2 == number of rows
        para += "<div class='row'>";
        for (var j = 0; j < 5; j++){
            if (j === 0)
                para += "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'></div>";
            para += "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>";
            para += "<p><strong><span>";
            para += forecasts[(5*i) + j].day + '<br/>';

            // format the date to just capture month, then day
            var dateFields = forecasts[(5*i) + j].date.split(' ');
            var formattedDate = dateFields[1] + ' ' + dateFields[0];
            para += formattedDate;
            // console.log(dateFields);

            para += "</span></strong><br/>";
            para += "<span class='red'>" + forecasts[(5*i) + j].high + "&#176;F</span><br/>";
            para += "<span class='blue'>" + forecasts[(5*i) + j].low + "&#176;F</span><br/>";

            // APPEND THE IMAGE
            var imgCode = forecasts[(5*i) + j].code;
            var imgURL = _imgBaseURL + imgCode + _imgBackURL;
            para += imgURL;
            para += "</p></div>";
            
            //para = "";
        }
        para += "</div>";
         
    }
    $("#forecast").append(para);
}


// GOOGLE MAP api
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(jsonData.item.lat, jsonData.item.long),
        zoom: 12
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function setFields() {

    setCurrentWeather();
    setForecasts();
}
function clearFields() {
    $("#cityState").text("");
    $("#lat").text("");
    $("#lon").text("");
    $("#date").text("");
    $("#temp").text("");
    $("#desc").text("");
    $("#forecast").empty();
    $("#currentWeather").empty();
    $("#currentWeatherImg").empty();
}