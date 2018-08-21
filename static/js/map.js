/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module
var lat;
var lng;

//object which will contain state information about the request and general state of interface element and associated variables
//it also contains results from the last filled request
current = {
    //info used to make request
    road : null,
    city : null, 
    state : null,
    county : null,
    country : null,

    //information handed back from walkability
    isochroneGJ : null,
    WS : null,
    amenityCount : null,
    amenityGJ : null,
    point : null,
    statsJson : null,

    //infromation gained from air quality and walkability
    airQuality : null,
    crime : null
};

//creating default lat lng coordinates so the script have something to work with initally. Default is Madison, WI
map.lat =  43.072457;
map.lng = -89.401605;

//main function the creates the map when the page is first rendered. It is not called untill all of the dom elements have been loaded
map.establish = function (){
    
    //build the map
    map.mymap = L.map('mapid').setView([40.73692605118838, -73.99224906926378], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ'
    }).addTo(map.mymap);
    
    //zoom to specified lat lng
    map.zoomTo();
    
    //add the search control for geocoding
    L.Control.geocoder({
        showResultIcons: false,
        placeholder: "Name of Place or Street Address",
        collapsed: false,
        errorMessage: "We can seem to find that address. Can you try a different one?"
        
        })
        .on("markgeocode" , function(e){
            //let the lat long coordinates from the result object from the plugin
            var latlongPar = e.geocode.center;
            lat = Number(latlongPar.lat);
            lng = Number(latlongPar.lng);

            //make change to the whole interface
            map.locationChange();
        })
        .addTo(map.mymap);
    
    map.mymap.on('contextmenu', function(e) {
    console.log(e.latlng.lat + ", " + e.latlng.lng)
        lat = Number(e.latlng.lat); 
        lng = Number(e.latlng.lng);

        map.locationChange();
    });
}

            
map.locationChange = function (){
    console.log("making osm request");
    $.getJSON("https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=" + lat + "&lon=" + lng, function(response){
        console.log("recieved responce from OSM geocoder, see log below");
        console.log(response);
        console.log(response.address.city);

        //assign the attribute information to the current state tracking object so it can be used by many differnt functions
        //in many different modules inside of the project
        current.road = response.address.road;
        current.city = response.address.city;
        current.state = response.address.state;
        current.county = response.address.county;
        current.country = response.address.country;

        //Both of these update functions are dependent on address information rather than coordinates
        //crime data getter here
        getData.crime();
        stats.updateAddress();
        
    }).fail(function(error){
        console.log("OSM attempt failed");
        console.log(error);
    });
    //get data from data getters
    getData.walkability();
    //air quality data getter here
    getData.airQuality();
    
};

//zooms map to the correctly set lat and long, default is Madison, WI
map.zoomTo = function () {
    map.mymap.panTo(new L.LatLng(map.lat, map.lng));
}



//updates the map with new information provided from the backend server
map.update = function () {
    console.log("update map has been called");
    console.log(current.isochroneGJ)
    
    isoStyle = function (feature){
        //var stringers = feature.properties.html
        //var subs = stringers.substring(1109,1115)
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: feature.properties.html.substring(1109,1116),
            color: feature.properties.html.substring(1109,1116),
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8
            //1109 - 1115
        };
        return geojsonMarkerOptions;
    }; 
        L.geoJSON(current.isochroneGJ, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, isoStyle(feature));
            }
        }).addTo(map.mymap);    

    
};