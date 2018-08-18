/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module
var lat;
var lng;

//object which will contain state information about the request and general state of interface element and associated variables
//it also contains results from the last filled request
current = {
    //info used to make request
    city : null, 
    state : null,

    //information handed back from walkability
    isochroneGJ : null,
    WS : null,
    amenityCount : null,
    amenityGJ : null,
    point : null,

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
        current.city = response.address.city;
        current.state = response.address.state;

        //call get crime data now. crime function will use address information taken from global current object
        //getData.crime();
    }).fail(function(error){
        console.log("OSM attempt failed");
        console.log(error);
    });
    //get data from data getters
    getData.walkability();
    //crime data getter here
    //air quality one here
};

//zooms map to the correctly set lat and long, default is Madison, WI
map.zoomTo = function () {
    map.mymap.panTo(new L.LatLng(map.lat, map.lng));
}

map.addGJ = function (){
        var smallIcon = new L.Icon({
        iconSize: [27, 27],
        iconAnchor: [13, 27],
        popupAnchor:  [1, -24],
        iconUrl: '/Flask/c.png' // None for now just to block markers
                    });


      var myLayer = L.geoJson(GeJ, {
      pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: smallIcon});
                                    }
                              }).addTo(map.mymap);
                    }

//updates the map with new information provided from the backend server
map.update = function () {
    console.log("update map has been called");
    ;
}