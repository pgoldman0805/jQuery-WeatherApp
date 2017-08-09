// use the CODE (two digit number) to replace the '30' in the below example
// EXAMPLE: var imgBaseURL"<img src='http://l.yimg.com/a/i/us/we/52/30.gif'/>"
var imgBaseURL = "<img src='http://l.yimg.com/a/i/us/we/52/";
var imgBackURL = ".gif'/>";

var _baseURL = "https://query.yahooapis.com/v1/public/yql?q=";
var _geoLocationQuery = "select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D'";
var latitude = "";
var longitude = "";
var jsonData = "";

$(document).ready(function(){

    $("#submitBtn").click(function(){

        // hide and clear existing fields
        $("#result").addClass('hidden');
        $("#googleMap").addClass('hidden');
        clearFields();
        var geoLocationQuery = _geoLocationQuery;
        var baseURL = _baseURL;
        jsonData = "";

        // create URL with user's query strings
        var userInput = $("#userLocation").val();
        // console.log(userInput);
        geoLocationQuery += encodeURI(userInput);
        geoLocationQuery += "')&format=json";
        baseURL += geoLocationQuery;



        // geoFindMe();


        // geoLocationQuery += latitude;
        // geoLocationQuery += ",";
        // geoLocationQuery += longitude;
        // geoLocationQuery += ")\"";


        $.getJSON(baseURL, function(json){
            $.each(json, function(i, field){
                jsonData = field.results.channel.item;
                // $("#desc").text(jsonData);
                setFields();
                myMap();
                // console.log(x);
                console.log(jsonData);
            })
        });

        // show results

        $("#googleMap").removeClass('hidden');
        $("#result").removeClass('hidden');



        return false;
    });
});
// GOOGLE MAP api
function myMap() {
    var mapProp= {
        center:new google.maps.LatLng(jsonData.lat,jsonData.long),
        zoom:12,
    };
    var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

function setFields(){

    $("#cityState").text($("#userLocation").val().toUpperCase());
    $("#lat").text(jsonData.lat);
    $("#lon").text(jsonData.long);
    $("#date").text(jsonData.condition.date);
    $("#temp").text(jsonData.condition.temp).append('&#176;F');
    $("#desc").text(jsonData.condition.text);

    // get array of forecasts
    var forecasts = jsonData.forecast;
    var para = "";
    // console.log(forecasts.length);
    for (var i = 0; i < 10; i++){
        // var para = "<div class='row'>";
        // if (i === 0)
        //     para += "<div class='row'>";
        para += "<div class='col-md-2 text-center'>";
        para += "<p><strong><span>";
        para += forecasts[i].day + '<br/>' //+ forecasts[i].date.month;

        // format the date to just capture month, then day
        var dateFields = forecasts[i].date.split(' ');
        var formattedDate = dateFields[1] + ' ' + dateFields[0];
        para += formattedDate;
        // console.log(dateFields);

        para += ": </span></strong><br/>";
        para += "<span class='red'>" + forecasts[i].high + "&#176;F</span><br/>";
        para += "<span class='blue'>" + forecasts[i].low + "&#176;F</span><br/>";
        // APPEND THE IMAGE
        var imgCode = forecasts[i].code;
        var imgURL = imgBaseURL + imgCode + imgBackURL;
        // console.log(imgURL);
        para += imgURL;
        // para += forecasts[i].text;

    //     para += "</p></div>";
    //
    //     console.log(para);
    //     $("#forecast").append(para);
    //     para = "";
    // }
    // para += "<div class='row text-center'>";
    // for (var i = 5; i < forecasts.length; i++){
    //     // var para = "<div class='row'>";
    //     para += "<div class='col-md-2'>";
    //     para += "<p><strong><span>";
    //     para += forecasts[i].day + ', ' + forecasts[i].date;
    //     para += ": </span></strong><br/>";
    //     para += "High of <span class='red'>" + forecasts[i].high + "&#176;F</span><br/>";
    //     para += "Low of <span class='blue'>" + forecasts[i].low + "&#176;F</span><br/>";
    //     para += forecasts[i].text;
        para += "</p></div></div>";

        $("#forecast").append(para);
        para = "";

    }
}


function clearFields(){
    $("#cityState").text("");
    $("#lat").text("");
    $("#lon").text("");
    $("#date").text("");
    $("#temp").text("");
    $("#desc").text("");
    $("#forecast").empty();
}








// RETURNS AN ARRAY IN THE FORM [latitude,longitude]
// function geoFindMe() {
//
//     if (!navigator.geolocation){
//         results.val("<p>Geolocation is not supported by your browser</p>");
//         return;
//     }
//     else {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             latitude = position.coords.latitude;
//             longitude = position.coords.longitude;
//         //   console.log(position.coords.latitude, position.coords.longitude);
//         //   return [position.coords.latitude, position.coords.longitude];
//             return;
//         });
//     }
// }
// }
