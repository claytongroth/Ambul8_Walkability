/**module that has an object that does all of the data retrieval from APIs and Flask
this data is handed off to an inferface module which will display the information
**/

var getData = {};

//function that retrieves air quality data for use by other interface objects
getData.airQuality = function () {

    //below is the access tokin I registered for, it is needed to use the api
    //21e16a3d28e1e6f71a00129e7a0d375ba880e282
    var tokin = "21e16a3d28e1e6f71a00129e7a0d375ba880e282";

    //sample url https://api.waqi.info/feed/geo:10.3;20.7/?token=demo
    //constructed url which allows for response from api to go through
    var url = "https://api.waqi.info/feed/geo:" + lat +  ";" + lng + "/?token=" + tokin;

    //request the data from the air quality API
    console.log("requesting air quality data for: " + url);
    $.getJSON(url, function(response){
        console.log("See air quality data below");
        console.log(response);

        //extracting the air quality score
        //sometimes the air quality api does not find a station that it considers near the lat long coordinate pair
        //in those cases it returns null or the data object might not even be a property of the response.
        //the if statements below prevent the script from crashing when the attribute does not exist
        if (!(response.data === "undefined" || response.data === null) ){
            current.airQuality = response.data.aqi;
            console.log(current.airQuality);
        } else {
            console.log("there is not air quality data for this area");
            current.airQuality = null;
        }

        //update the air quality graph svg based on the newly entered results
        graphs.update("graphAirQualityScore");
        
    });
};

//function retrieves crime data from an api
getData.crime = function (countyName) {
    
    var url = $SCRIPT_ROOT + "/crime.csv";

    d3.csv(url, function(data){
        console.log("successfully loaded crime csv");
        console.log(data);

        var result = null;//place holder for what will be fund in function

        //when the data is loaded or already loaded
        data.forEach(function(record){
            if (record.state.toUpperCase() === current.state.toUpperCase() && current.county.toUpperCase() === record.county.toUpperCase()) {
                result = record.crime_rate_per_100000;
            }
        });

        current.crime = result;
        console.log("the crime rate found is: " + current.crime);
        //callback of some kind to update interface
        stats.updateCrime();
        graphs.update("graphSafetyScore");

    });
};

//function retrieves walkability data, this includes isochrone, gjson geomentry and walkability stats
getData.walkability = function () {
    var results;

    //reduce the number of decimal places in the coordinates to avoid tripping up the server
    lat = Number(lat.toFixed(5));
    lng = Number(lng.toFixed(5));
	
	var queryString = $SCRIPT_ROOT + '/walkability/' + lat + '/' + lng;
	
    console.log("I did it! we made a request to: " + queryString);
	$.getJSON(queryString, function (data) {
		console.log('Something Returned from Server');
        console.log(data);
        //assign all of the data as needed
        current.isochroneGJ = data.isochroneGJ;
        current.WS = data.WS;
        current.amenityCount = data.amenityCount;
        current.amenityGJ = data.amenityGJ;
        current.point = data.point;
        current.statsJson = data.statsJson;

        //change the interface to reflect the new data
        graphs.update("graphWalkScore");
        map.update();
        stats.update();
    
	}).fail( function (error) {
		console.log("server request failed. see error below");
		console.log(error);
		});

};