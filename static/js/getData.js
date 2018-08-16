/**module that has an object that does all of the data retrieval from APIs and Flask
this data is handed off to an inferface module which will display the information
**/

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
getData.walkability = function (coorPair) {
    var results;
	
	var queryString = $SCRIPT_ROOT + '/walkability/' + coorPair[0] + '/' + coorPair[1];
	
    console.log("I did it! we made a request to: " + queryString);
	$.getJSON(queryString , function (data) {
		console.log('Something Returned from Server');
		console.log(data);
	}).fail( function (error) {
		console.log("server request failed. see error below");
		console.log(error);
		});

    return results;
}

//testing to see if connection to flask server works correctly
getData.walkability([40.73692605118838, -73.99224906926378]);