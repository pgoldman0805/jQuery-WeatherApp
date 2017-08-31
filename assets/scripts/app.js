/*global $, jquery*/
(function () {
    "use strict";

    $(document).ready(function () {

        $("#submitBtn").click(function () {

            $("#result").addClass('hidden');
            $("#googleMap").addClass('hidden');

            clearFields();
            getData();

            $("#googleMap").removeClass('hidden');
            $("#result").removeClass('hidden');
            return false;
        });

        $("#toggleTempMode").click(function () {
            if (this.text() === "F")
                this.text("C");
            else
                this.text("F");
            return false;
        });
    });

    // use the CODE (two digit number) to replace the '30' in the below example
    // EXAMPLE: var imgBaseURL"<img src='http://l.yimg.com/a/i/us/we/52/30.gif'/>"
    var _imgBaseURL = "<img src='http://l.yimg.com/a/i/us/we/52/";
    var _imgBackURL = ".gif'/>";

    var _baseURL = "https://query.yahooapis.com/v1/public/yql?q=";
    var _geoLocationQuery = "select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D'";

    var jsonData = "";
    

    function handleResult(json) {
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
        geoLocationQuery += encodeURI(userInput);
        geoLocationQuery += "')&format=json";
        baseURL += geoLocationQuery;

        $.getJSON(baseURL, handleResult);
    }

    function setFields() {
        setCurrentWeather();
        setAtmosphere();
        setForecasts();

    }


    function setCurrentWeather() {

        // FORMAT TITLE
        var title = jsonData.item.title.split(' ');
        var splitIndex = title.indexOf('at');
        var formattedTitle = title.slice(0, splitIndex).join(" ");



        // UPDATE BACKGROUND BASED ON CURRENT TIME
        var imgPrefix = "https://github.com/pgoldman0805/jQuery-WeatherApp/tree/master/assets/images/";
        var desc = jsonData.item.condition.text;
        var time = jsonData.lastBuildDate.split(' ');
        var currentTime = time[4].split(':')[0];
        var amOrPm = time[5];
        // MORNING == between 6am-11am
        // DAY == between 12pm-5pm
        // EVENING == between 6pm-11pm
        // NIGHT == between 12am-5am
        var dayPeriod = "";
        if (currentTime >= 6 && currentTime <= 11 && amOrPm === "AM")
            dayPeriod = "morning";
        else if ((currentTime == 12 || currentTime <= 5) && amOrPm === "PM")
            dayPeriod = "day";
        else if (currentTime >= 6 && currentTime <= 11 && amOrPm === "PM")
            dayPeriod = "evening";
        else if ((currentTime == 12 || currentTime <= 5) && amOrPm === "AM")
            dayPeriod = "night";

        if (desc.indexOf("Rain") !== -1 || desc.indexOf("Shower") !== -1) {
            if (dayPeriod === "morning" || dayPeriod === "day")
                $(".bg").css('background-image', 'url("assets/images/rainyDay.jpg")');
            else
                $(".bg").css('background-image', 'url("assets/images/rainyNight.jpg")');
        } else if (desc.indexOf("Cloudy") !== -1) {
            if (dayPeriod === "morning" || dayPeriod === "day")
                $(".bg").css('background-image', 'url("assets/images/partlyCloudyDay.jpg")');
            else if (dayPeriod === "evening")
                $(".bg").css('background-image', 'url("assets/images/cloudyEvening.jpg")');
            else if (dayPeriod === "night")
                $(".bg").css('background-image', 'url("assets/images/cloudyNight.jpg")');
        } else if (desc.indexOf("Sunny") !== -1 || desc.indexOf("Clear") !== -1) {
            if (dayPeriod === "morning" || dayPeriod === "day")
                $(".bg").css('background-image', 'url("assets/images/sunnyDay.jpg")');
            else
                $(".bg").css('background-image', 'url("assets/images/night.jpg")');
        } else if (desc.indexOf("Thunderstorms") !== -1)
            $(".bg").css('background-image', 'url("assets/images/stormyNight.jpg")');
        else
            $(".bg").css('background-image', 'none');


        $("body").addClass("bg");



        // FORMAT CURRENT TIME

        var formattedTime = time[4] + ' ' + time[5] + ' ' + time[6];

        $("#currentWeather").append('<h3>' + formattedTitle + '</h3>');
        $("#currentWeather").append('<h6>as of ' + formattedTime + '</h6>');


        var temp = jsonData.item.condition.temp;
        $("#currentWeatherImg").append('<h2 id="temp">' + temp + '&#176;<span id="toggleTempMode">F</span></h2>');

        // ADD CURRENT WEATHER CODE AS IMAGE
        var currentImg = _imgBaseURL + jsonData.item.condition.code + _imgBackURL;
        $("#currentWeatherImg").append(currentImg);
    }

    function setAtmosphere() {
        $("#atmosphere").append("<h3 class='text-center'>Atmosphere</h3>");
        $("#atmosphere").append("<h5 class='text-center'>Humidity: " + jsonData.atmosphere.humidity + "%</h5>");
        $("#atmosphere").append("<h5 class='text-center'>Pressure: " + jsonData.atmosphere.pressure.toLocaleString() + " inches</h5>");
        $("#atmosphere").append("<h5 class='text-center'>Visibility: " + jsonData.atmosphere.visibility + " miles</h5>");
        $("#atmosphere").append("<h5 class='text-center'>Wind speed: " + jsonData.wind.speed + " mph</h5>");

    }

    function setForecasts() {
        $("#forecast").append("<h3 class='text-center'>10-Day Forecast</h3>");

        var forecasts = jsonData.item.forecast;
        var para = "";

        for (var i = 0; i < 2; i++) { // 2 == number of rows
            para += "<div class='row'>";
            for (var j = 0; j < 5; j++) {
                if (j === 0)
                    para += "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'></div>";
                para += "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>";
                para += "<p><strong><span>";
                para += forecasts[(5 * i) + j].day + '<br/>';

                // format the date to just capture month, then day
                var dateFields = forecasts[(5 * i) + j].date.split(' ');
                var formattedDate = dateFields[1] + ' ' + dateFields[0];
                para += formattedDate;
                // console.log(dateFields);

                para += "</span></strong><br/>";
                para += "<span class='red'>" + forecasts[(5 * i) + j].high + "&#176;F</span><br/>";
                para += "<span class='blue'>" + forecasts[(5 * i) + j].low + "&#176;F</span><br/>";

                // APPEND THE IMAGE
                var imgCode = forecasts[(5 * i) + j].code;
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
        setAtmosphere();
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
        $("#atmosphere").empty();
    }
}())