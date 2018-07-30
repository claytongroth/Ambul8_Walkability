var mymap = L.map('mapid').setView([40.73692605118838, -73.99224906926378], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     maxZoom: 18,
     id: 'mapbox.high-contrast',
     accessToken: 'pk.eyJ1IjoiY2dyb3RoIiwiYSI6ImNqZ2w4bWY5dTFueG0zM2w0dTNkazI1aWEifQ.55SWFVBYzs08EqJHAa3AsQ'
    }).addTo(mymap);

    function zoomTo() {
    mymap.panTo(new L.LatLng(lat1, lng1));
                      }

    function addGJ(){
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
                              }).addTo(mymap);
                    }
    window.onload = zoomTo();
    window.onload = addGJ();