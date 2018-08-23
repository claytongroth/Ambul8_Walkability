/**Module deals with making the map and updating it. All is done through a single map object **/

var map2 = {};//makeing the master object for the module
var lat;
var lng;

map2.lat =  43.072457;
map2.lng = -89.401605;
//main function the creates the map when the page is first rendered. It is not called untill all of the dom elements have been loaded
map2.establish = function (){
    
    //build the map
    map2.mymap = L.map('mapid2').setView([43.072457, -89.401605], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ'
    }).addTo(map2.mymap);
    

}



//zooms map to the correctly set lat and long, default is Madison, WI
map2.zoomTo = function (lat, lng) {
    map2.mymap.panTo(new L.LatLng(lat, lng));
}



//updates the map with new information provided from the backend server
map2.update = function () {
    console.log("update map2 has been called");

    if (typeof poiLayer !== 'undefined') {
        map2.mymap.removeLayer(poiLayer);
    };
   
    poiStyle = function (feature){
        if (feature.properties.amenity == "restaurant"){
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'utensils',
                markerColor: 'red',
                prefix: 'fa'

            });
        } else if (feature.properties.amenity == "parking"){
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'car',
                markerColor: 'blue',
                prefix: 'fa'

            });
        } else if (feature.properties.amenity == "cafe"){
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'coffee',
                markerColor: 'purple',
                prefix: 'fa'
            });
        } else if (feature.properties.amenity == "bench"){
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'newspaper',
                markerColor: 'darkred',
                prefix: 'fa'
            });      
         } else if (feature.properties.amenity == "bicycle_rental"){
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'bicycle',
                markerColor: 'green',
                prefix: 'fa'
            });
         } else {
            var poigeojsonMarkerOptions = L.AwesomeMarkers.icon({
                icon: 'map-pin',
                markerColor: 'cadetblue',
                prefix: 'fa'

            });
        }
        return poigeojsonMarkerOptions;
    }; 
    
    var poimarkerGroup = [];
    
    console.log(current.amenityGJ)
    
    var geojsonPOI = GeoJSON.parse(current.amenityGJ, {Point: ["latitude", "longitude"]});
    
    console.log(geojsonPOI)
    
    poiLayer= L.geoJSON(geojsonPOI, {
            pointToLayer: function (feature, latlng) {
                poimarkerGroup.push(L.marker(latlng, poiStyle(feature)));
                return L.marker(latlng, {icon: poiStyle(feature)});
            },
            onEachFeature: function (feature, layer) {
            layer.bindPopup('<h6>'+feature.properties.amenity+'</h6>');
            }
            
    }).addTo(map2.mymap);  
    
    var poigroup = L.featureGroup(poimarkerGroup); 
    map2.mymap.fitBounds(poigroup.getBounds()); 
     
    console.log(poigroup.getBounds)

    
};