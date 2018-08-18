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
    var request = new XMLHttpRequest();
        request.open(
            "GET", 
            "https://geo.fcc.gov/api/census/block/find?latitude="+ lat + "&longitude=" + lng + "&showall=true&format=json");
        request.onload = function (){
            var crimeJdata = JSON.parse(this.response);
            console.log(crimeJdata.County.name)
        }
        request.send();
    $.getJSON("crime.json", function (json){
        console.log(json);
        //call whatever call backfunction that will cause things to happen in the interface
    });
    
    // Next is to create a regex to match the requested county info to the JSON records
    
    return results;
}

//function retrieves walkability data, this includes isochrone, gjson geomentry and walkability stats
getData.walkability = function () {
    var results;
	
	var queryString = $SCRIPT_ROOT + '/walkability/' + lat + '/' + lng;
	
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
//getData.walkability([40.73692605118838, -73.99224906926378]);
//getData.crime([40.73692605118838, -73.99224906926378]);