/**
This module deals with all of the behavior of the basic statistics panel. this includes text replacement and color coding of text
**/


//master object for the statistics module
var stats = {};

stats.establish = function () {
    //d3 references to scores in the basic stats box
    stats.totalScore = d3.select("#statTotalScore");
    stats.streetDensity = d3.select("#statStreetDensity");
    stats.NodeDensity = d3.select("statNodeDensity");
    stats.segCount = d3.select("statSegCount");
    stats.crime = d3.select("statCrime");
}


//updates the address text in the stats box for the current location when the geocoder finishes processing
stats.updateAddress = function(){

    //if the road does not have a name then use an empty string instead
    if (current.road === null || current.road === undefined) {
        var road = "";
    } else {
        var road = current.road + ", ";
    };

    //if the point is located in an area that is not a city then use an empty string instead
    if (current.city === null || current.city === undefined){
        var city = "";
    } else {
        var city = current.city + ", ";
    };
    
    //construct the final label that will be used in the basic stats box which includes the full address
    var addressString = road + city + current.county + ", " + current.country;
    d3.select("#locationString").html(addressString);
}

//updates the crime info when the info is returned by getter function
stats.updateCrime = function () {
    console.log("update Crime called on. updating crime stat in interface");
    if (current.crime === null) {
        d3.select("#statCrime").html("no crime data avalaible for this area");
    } else {
        d3.select("#statCrime").html(Math.round(current.crime).toLocaleString());
    };
};


//updates the map with new information provided from the backend server
stats.update = function () {
    console.log("stats update function called");

    //update the core statistics
    d3.select("#statTotalScore").html(current.WS);
    //stats from the JSON stats thing
    d3.select("#statStreetDensity").html(
        Math.round(current.statsJson.street_density_km)
            .toLocaleString()
    );

    d3.select("#statNodeDensity").html(
        Math.round(current.statsJson.node_density_km)
            .toLocaleString()
    );
    
    d3.select("#statSegCount").html(
        current.statsJson.street_segments_count.toLocaleString()
    );

    //loop through each of the different keys inside of the ammenities count object
    console.log("Starting to update amenities info");
    var keysArray = Object.keys(current.amenityCount);
    var arrayToReorder = [];
    //make a list that is more like an array
    keysArray.forEach(function(key){
        arrayToReorder.push({ amenity : key, count :  current.amenityCount[key] });
    });

    function amenitySorter (a,b){
        if (a.count > b.count) {
            return -1;
        }
        if (a.count < b.count){
            return 1;
        }
        if (a.count === b.count) {
            return 0;
        }
    };

    arrayToReorder = arrayToReorder.sort(amenitySorter);
    console.log("amenities list that wil be placed into DOM");
    console.log(arrayToReorder);

    //sometimes their are no amenities returned so the amenties count object has no keys. 
    if (keysArray.length > 0){
        console.log("At least one amenity in area");
        //select the unorder list containing ammenities
        d3.select("#amenitiesList")
            .selectAll(".amenity-row")
            .data(arrayToReorder)
            .enter()
            .append("tr")
            .attr("class" , "amenity-row")
            .html(function(d){
                //replace all of the underscores with spaces in the name
                var amenityName = d.amenity.replace("_" , " ").replace("_" , " ");
                //place the data into the format of an html table row
                var tableRowHTML = "<td>" + amenityName + "</td> <td>" + d.count + "</td>";
                return tableRowHTML;
        });
    } else {
        //if their are no amenities in the area then let the user know any do not use a list of objects that does not exist to generate a list
        console.log("There are no amenities in this area");
        d3.select("#amenitiesList")
            .append("tr")
            .html("<td>This Area does not have any amenities...Sorry!</td>");
    }
};