/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module
var lat;
var lng;
var sourceMarker1;
var sourceMarker2;

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
   var latlons = {
      map: [40.758896, -73.985130],
      src1: [40.758896, -73.985130],
      src2: [40.758896, -73.989930]
    };
    map.mymap = L.map('mapid', { zoomControl: false }).setView(latlons.map, 14);
    map.mymap.attributionControl.addAttribution("ÖPNV Daten © <a href='https://www.vbb.de/de/index.html' target='_blank'>VBB</a>");
    L.control.zoom({ position:'bottomleft' }).addTo(map.mymap);

    r360.basemap({ style: 'dark', apikey: 'ERNGIFYE5NW4V6GCUTF614CGOI' }).addTo(map.mymap);

    var sourceMarker1 = L.marker([map.lat, map.lng], { draggable: true }).addTo(map.mymap);
    var sourceMarker2 = L.marker([map.lat, map.lng], { draggable: true }).addTo(map.mymap);
    
    var polygonLayer = r360.leafletPolygonLayer().addTo(map.mymap);
    polygonLayer.opacity = .6;
    polygonLayer.setColors([{
      'time': 300,
      'color': '#c6dbef'
    }, {
      'time': 600,
      'color': '#6baed6'
    }, {
      'time': 900,
      'color': '#08306b'
    }, ]);

    var showPolygons = function(rezoom) {
      var travelOptions = r360.travelOptions();
      travelOptions.addSource(sourceMarker1);
      travelOptions.addSource(sourceMarker2);
      travelOptions.setTravelTimes([300, 600, 900]); //  2, 7 min 15min
      travelOptions.setTravelType('walk');
      travelOptions.setServiceKey('ERNGIFYE5NW4V6GCUTF614CGOI');
      travelOptions.setServiceUrl('https://api.targomo.com/northamerica/');

      r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons) {
        polygonLayer.clearAndAddLayers(polygons, rezoom || false);
      });
    };

    // call the helper function to display polygons with initial value
    showPolygons(true);
    // re-run the polygons when we move a marker
    sourceMarker1.on('dragend', function(){ showPolygons(true); });
    sourceMarker2.on('dragend', function(){ showPolygons(true); });

    
    //zoom to specified lat lng
    map.zoomTo();
    
    //add the search control for geocoding
    var LeafIcon = L.AwesomeMarkers.icon({
                icon: 'circle',
                markerColor: 'red',
                prefix: 'fa'

    });
    
    L.Control.geocoder({
        defaultMarkGeocode: false,
        showResultIcons: false,
        placeholder: "Name of Place or Street Address",
        collapsed: false,
        errorMessage: "We can seem to find that address. Can you try a different one?"
        
        })
        .on("markgeocode" , function(e){
             L.marker(e.geocode.center, {
                icon: LeafIcon
                    })
            .addTo(map.mymap);
            //let the lat long coordinates from the result object from the plugin
            var latlongPar = e.geocode.center;
            lat = Number(latlongPar.lat);
            lng = Number(latlongPar.lng);
        
            
            sourceMarker1.setLatLng([lat -.009, lng]);
            sourceMarker2.setLatLng([lat, lng-.009]);
            showPolygons(true);

            //make change to the whole interface
            map.locationChange();
            map2.zoomTo(lat, lng);
        })
        .addTo(map.mymap);
    
    map.mymap.on('contextmenu', function(e) {
    console.log(e.latlng.lat + ", " + e.latlng.lng)
        lat = Number(e.latlng.lat); 
        lng = Number(e.latlng.lng);
            
        sourceMarker1.setLatLng([lat, lng]);
        sourceMarker2.setLatLng([lat, lng]);
        
        map.locationChange();
        map2.zoomTo(lat, lng);
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
    console.log("zooming to Lat, Lon")
    console.log((map.lat, map.lng))
}



//updates the map with new information provided from the backend server
map.update = function () {
    console.log("update map has been called");


    if (typeof isochroneLayer !== 'undefined') {
        map.mymap.removeLayer(isochroneLayer);
    };
   
    isoStyle = function (feature){
        var geojsonMarkerOptions = {
            radius: 3,
            fillColor: feature.properties.html.substring(1109,1116),
            color: feature.properties.html.substring(1109,1116),
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5
            //1109 - 1115
        };
        return geojsonMarkerOptions;
    }; 
    
    var markerGroup = [];
    
    isochroneLayer= L.geoJSON(current.isochroneGJ, {
            pointToLayer: function (feature, latlng) {
                markerGroup.push(L.circleMarker(latlng, isoStyle(feature)));
                return L.circleMarker(latlng, isoStyle(feature));
            },
        
            
    }).addTo(map.mymap);  
    
    var group = L.featureGroup(markerGroup);
    map.mymap.fitBounds(group.getBounds()); 
     
    map2.update();
    
};




