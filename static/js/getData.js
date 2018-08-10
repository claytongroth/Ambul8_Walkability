/**module that has an object that does all of the data retrieval from APIs and Flask
this data is handed off to an inferface module which will display the information
**/

$SCRIPT_ROOT = {{ request.script_root|tojson|safe }};
var getData = {};

//function that retrieves air quality data for use by other interface objects
getData.airQuality = function () {
    var results;
    return results;
}

//function retrieves crime data from an api
getData.crime = function () {
    var results;


    return results;
}

//function retrieves walkability data, this includes isochrone, gjson geomentry and walkability stats
getData.walkability = function () {
    var results;

    //$.getJSON(url, data, func)
    $.getJSON($SCRIPT_ROOT + '/<lat>+<lon>',
    lat: $('input[name="lat"]').val(),
    lng: $('input[name="lng"]').val()
    , function(data) {
        $("#isochroneGJ").text(data.isochroneGJ),
        $("#point").text(data.point),
        $("#WS").text(data.WS),
        $("#amenityCount").text(data.amenityCount),
        $("#amenityGJ").text(data.amenityGJ);
      });

    return results;
}

