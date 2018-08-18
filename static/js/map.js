/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module
var lat;
var lng;

//object which will contain state information about the request and general state of interface element and associated variables
current = {city : null, state : null};

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
            lat = latlongPar.lat;
            lng = latlongPar.lng;

            //try and get county information from geocoding service
            
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
            });

            //call each of the datagetter methods and hand them callback functions
            
            getData.walkability();

        })
        .addTo(map.mymap);
    
    map.mymap.on('contextmenu', function(e) {
    console.log(e.latlng.lat + ", " + e.latlng.lng)
        lat = e.latlng.lat 
        lng = e.latlng.lng
    });
}

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
    ;
}

//do any needed element binding to event listeners in this function
map.bindEvents = function () {
    ;
}
