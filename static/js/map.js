/**Module deals with making the map and updating it. All is done through a single map object **/

var map = {};//makeing the master object for the module
var lat;//the lat coordinate used by many different functions, methods and objects. It reflects the current location.
var lng;//the lat coordinate used by many different functions, methods and objects. It reflects the current location.
var sourceMarker1;
var sourceMarker2;

//object which will contain state information about the request and general state of interface element and associated variables
//it also contains results from the last filled request
current = {
    //info used to make request as well as information returned from the reverse geocoder.
    road : null,
    city : null, 
    state : null,
    county : null,
    country : null,

    //information handed back from walkability flask server
    isochroneGJ : null,//will contain isochrome geojson object aka feature collection
    WS : null,//will contain walkability score
    amenityCount : null,//will contain array of objects which  have the counts of amentitiy types such as parks, parking and benches
    amenityGJ : null,//contains GeoJson feature collection of amenity feature which can be mapped out
    point : null,//the xy coordinate pair for the request location
    statsJson : null,//contains statistics for the street density, node density, street segments count, crime score

    //information gained from air quality and walkability
    airQuality : null,//will contain an a quality indicator number
    crime : null//contains the crime statistic for the county the current location is in. US only
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
    //create the map leaflet map object
    map.mymap = L.map('mapid', { zoomControl: false }).setView(latlons.map, 14);
    //add credits for the basemap imagery to the leaflet map
    map.mymap.attributionControl.addAttribution("ÖPNV Daten © <a href='https://www.vbb.de/de/index.html' target='_blank'>VBB</a>");
    L.control.zoom({ position:'bottomleft' }).addTo(map.mymap);
    //add a dark base map into the page
    r360.basemap({ style: 'dark', apikey: 'ERNGIFYE5NW4V6GCUTF614CGOI' }).addTo(map.mymap);

    //creates two draggable markers which will be used to calculate the walkable area when the point is dragged
    var sourceMarker1 = L.marker([map.lat, map.lng], { draggable: true })
        .bindTooltip("Drag me to get walkable areas!")
        .addTo(map.mymap);
    var sourceMarker2 = L.marker([map.lat, map.lng], { draggable: true })
        .bindTooltip("Drag me to get walkable areas!")
        .addTo(map.mymap);
    
    //a group layer from the Route 360 library. Layer will contain polygons with walk distance rings
    var polygonLayer = r360.leafletPolygonLayer().addTo(map.mymap);
    polygonLayer.opacity = .3;
    polygonLayer.setColors([{
        //isochrone area for 2 minute walk time
      'time': 300,
      'color': '#c6dbef'
    }, {
        //isochrone area for 7 minute walk time
      'time': 600,
      'color': '#6baed6'
    }, {
        //isochrone area for 15 minute walktime
      'time': 900,
      'color': '#08306b'
    }, ]);

    //helper function that enters polygon information into the group layer and symbolizes it
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
    
    //this is a codecoding widget from a leaflet plugin
    L.Control.geocoder({
        defaultMarkGeocode: false,//do not show a marker when the geocoder is click on
        showResultIcons: false,
        placeholder: "Name of Place or Street Address",
        collapsed: false,
        suggestMinLength : 1000,
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
            map.modal();
            map2.zoomTo(lat, lng);
        })
        .addTo(map.mymap);
    
    map.mymap.on('contextmenu', function(e) {
        console.log(e.latlng.lat + ", " + e.latlng.lng)
        lat = Number(e.latlng.lat); 
        lng = Number(e.latlng.lng);
            
        sourceMarker1.setLatLng([lat, lng]);
        sourceMarker2.setLatLng([lat, lng]);
        
        map.modal();
        map2.zoomTo(lat, lng);
    });

    //bind allows the user the select a location by clicking on it!
    map.mymap.on("click" , function(){
        map.modal();
    });

    //make a legend control inside of the map
    var legendControl = L.control({ position : "bottomright"});
    legendControl.onAdd = function(map){
        this._div = L.DomUtil.create('div', 'legend'); // create a div with a class "legend"

        this.update();
        return this._div;
    };
    legendControl.update = function (props) {
        this._div.title = "Legend of Features in map";

        //defining the circles in the svg
        var smallestCircle = "<circle cx='50' cy='40' r='15' fill='#c6dbef'> </circle>";
        var mediumCircle = "<circle cx='50' cy='48' r='28' fill='#6baed6'> </circle>";
        var largeCircle = "<circle cx='50' cy='55' r='38' fill='#08306b'> </circle>";

        //define the text labels for each of the differnt circles
        var innerText = "<text font-size='9px' text-anchor='middle' x='50' y='40'>2 min</text>";
        var middleText = "<text font-size='9px' text-anchor='middle' x='50' y='65' >7 min</text>";
        var outerText = "<text font-size='9px' text-anchor='middle' x='50' y='88' fill='white'>15 min</text>";

        //combine the entire string together into an legend with an svg in it
        this._div.innerHTML = "<h4 class='legend-header'>Legend</h4> <svg id='legend-svg'><g transform='translate(-8, -15)'>" +
            largeCircle +  mediumCircle + smallestCircle + innerText + middleText + outerText + "</g> </svg>";

    };

    legendControl.addTo(map.mymap);
}


//shows a modal window which asks the user if they would like to confirm
//they would like to select that particular location.
map.modal = function (){
    var modalWindow = d3.select("#modal-window").classed("hidden" , false);

    //update the info and hide modal window if the user clicks yes
    d3.select("#yesButton").on("click" , function(){
        console.log("Yes has been selected");
        modalWindow.classed("hidden" , true);
        map.locationChange();
    });

    //hide modal window and do not update anything if the user clicks no
    d3.select("#noButton").on("click", function(){
        console.log("no has been selected");
        modalWindow.classed("hidden" , true);
    });
};
            
map.locationChange = function (){
    console.log("making osm request");

    //Enter in loading text. This includes a loading gif icon.
    d3.select("#searchHeader").html("<span>Processing your walkable area this may take a few minutes... </span><img id='loadingGIF' src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/ab79a231234507.564a1d23814ef.gif'></img>");
    d3.select("#poiHeader").html("<span>Getting Points of interest in your area. This may take a few minutes...</span> <img id='loadingGIF' src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/ab79a231234507.564a1d23814ef.gif'></img>");
    
    //fade the second map div container into existance. It is hidden untill the user selects a new location
    d3.select("#map2")
        .transition()
        .duration(8000)
        .style("opacity" , 1);


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
    d3.select("#searchHeader").html("This is the walkable area of your community!");
    d3.select("#poiHeader").html("Places to go in your neighborhood!");

    if (typeof isochroneLayer !== 'undefined') {
        map.mymap.removeLayer(isochroneLayer);
    };
   
    isoStyle = function (feature){
        var geojsonMarkerOptions = {
            radius: 4,
            fillColor: feature.properties.html.substring(1109,1116),
            color: feature.properties.html.substring(1109,1116),
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7
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
    
    //after the update has been completed the statistics view button appears
    d3.select("#moreInfoButton").attr("class" , "");
};




