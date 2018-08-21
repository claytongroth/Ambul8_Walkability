/**
This module deals with all of the behavior of the basic statistics panel. this includes text replacement and color coding of text
**/


//master object for the statistics module
var stats = {};

stats.establish = function () {
    //jquery references to scores in the basic stats box
    stats.totalScore = d3.select("#statTotalScore");
    stats.streetDensity = d3.select("#statStreetDensity");
    stats.NodeDensity = d3.select("statNodeDensity");
    stats.segCount = d3.select("statSegCount");
    stats.crime = d3.select("statCrime");
}


//picks the correct color for the given data value
stats.color = function(d) {
    //place a switch statement here
	
}

//updates the address text in the stats box for the current location when the geocoder finishes processing
stats.updateAddress = function(){

    //if the road does not have a name
    if (current.road === null || current.road === undefined) {
        var road = "";
    } else {
        var road = current.road + ", ";
    };

    //if the point is located in an area that is not a city
    if (current.city === null || current.city === undefined){
        var city = "";
    } else {
        var city = current.city + ", ";
    };
    
    var addressString = road + city + current.county + ", " + current.country;

    d3.select("#locationString").html(addressString);
}

//updates the crime info when the info is returned by getter function
stats.updateCrime = function () {
    console.log("update Crime called on. updating crime stat in interface");
    if (current.crime === null) {
        d3.select("#statCrime").html("no crime data avalaible for this area");
    } else {
        d3.select("#statCrime").html(Math.round(current.crime));
    };
};


//updates the map with new information provided from the backend server
stats.update = function () {
    console.log("stats update function called");

    //update the core statistics
    d3.select("#statTotalScore").html(current.WS);
    //stats from the JSON stats thing
    d3.select("#statStreetDensity").html(current.statsJson.street_density_km);
    d3.select("#statNodeDensity").html(current.statsJson.node_density_km);
    d3.select("#statSegCount").html(current.statsJson.street_segments_count);

    //loop through each of the different keys inside of the ammenities count object
    console.log("Starting to update amenities info");
    keysArray = Object.keys(current.amenityCount);

    if (keysArray.length > 0){
        console.log("At least one amenity in area");
        //select the unorder list containing ammenities
        d3.select("#amenitiesList")
            .selectAll("li")
            .data(keysArray)
            .enter()
            .append("li")
            .attr("class" , "statItem")
            .html(function(d){
                return d.replace("_" , " ").replace("_" , " ") + ": " + current.amenityCount[d];
        });
    } else {
        console.log("There are no amenities in this area");
        d3.select("#amenitiesList")
            .append("li")
            .html("This Area does not have any amenities...Sorry!");
    }
}

//do any needed element binding to event listeners in this function
stats.bindEvents = function () {
    ;
}