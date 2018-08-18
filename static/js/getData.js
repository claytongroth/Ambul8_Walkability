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
getData.crime = function (current, lat, lng) {
    var results;
    var request = new XMLHttpRequest();
        request.open(
            "GET", 
            "https://geo.fcc.gov/api/census/block/find?latitude="+ lat + "&longitude=" + lng + "&showall=true&format=json");
        request.onload = function (){
            var crimeJdata = JSON.parse(this.response);
            console.log(crimeJdata.County.name);

            //set the current results for crime data for use in other functions
            current.crime = json;

            //change the interface to reflect the new data
            graphs.update();
            map.update();
            stats.update();
        }
        request.send();
    $.getJSON("/static/js/crime.json", function (json){
        console.log(json);

        //set the current results for crime data for use in other functions
        current.crime = json;

        //change the interface to reflect the new data
        graphs.update();
        map.update();
        stats.update();
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
        //assign all of the data as needed
        current.isochroneGJ = data.isochroneGJ;
        current.WS = data.WS;
        current.amenityCount = data.amenityCount;
        current.amenityGJ = data.amenityGJ;
        current.point = data.amenityGJ;

        //change the interface to reflect the new data
        graphs.update();
        map.update();
        stats.update();
    
	}).fail( function (error) {
		console.log("server request failed. see error below");
		console.log(error);
		});

}

//testing to see if connection to flask server works correctly
//getData.walkability([40.73692605118838, -73.99224906926378]);
//getData.crime([40.73692605118838, -73.99224906926378]);