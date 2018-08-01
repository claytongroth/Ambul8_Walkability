/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module

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
        iconUrl: '/Flask/c.png' // None for now jus to block markers
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