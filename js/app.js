/*
    app.js
    main script file for this mapping application
    source data URL: https://data.seattle.gov/resource/65fc-btcc.json
*/

$(function() {
    'use strict';
    var map = L.map('map').setView([47.60978, -122.3331], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'csb206.cift3l4et0iwlu5kq172h0clm',
        accessToken: 'pk.eyJ1IjoiY3NiMjA2IiwiYSI6ImNpZnQzbDVuczBpd3h0ZWx5YWxsZ3VoaGIifQ.q18A28_QMYzrIlE08oK2Sg'
    }).addTo(map);

    var sLabel = "SDOT";
    var wLabel = "WSDOT";
    var sdotNum = 0;
    var wsdotNum = 0;
    var markers = {};
    var copyData = {};
    var url = 'https://data.seattle.gov/resource/65fc-btcc.json';
    
    // uses json file of the data for camera information to map each camera marker 
    $.getJSON(url).then(function(json) {
        copyData = json;
        var i = 0;
        json.forEach(function(data) {
            var longitude = data['location']['longitude'];
            var latitude = data['location']['latitude'];
            var popup = L.popup().setContent(data['ownershipcd'] + ' @ ' 
                + data['cameralabel'] + '<p><img src=' + data['imageurl']['url'] + 
                ' height=200 width=200></img></p>');
            popup.className = 'popupLoc';
            var marker = L.circleMarker([latitude, longitude]);
            marker.addTo(map).bindPopup(popup);
            if (data['ownershipcd'] == "WSDOT") {
                marker.setStyle({radius: 10, fillColor: "#0000FF", color:"#0000FF"});
                wsdotNum++;
            } else if (data['ownershipcd'] == "SDOT") {
                marker.setStyle({radius: 10, fillColor: "#00FF00", color:"#00FF00"});
                sdotNum++;
            }
            markers[i] = marker;
            i++;
        });
        $("#SDOT").text(sdotNum + ' by ' + sLabel + ' ');
        $("#WSDOT").text(wsdotNum + ' by ' + wLabel);   
    });

    // filters the search input to display the appropiate cameras
    // and calculate the amount of SDOT and WSDOT camera depending on the search
    var searchFilter = document.getElementById('search-filter-field');
    searchFilter.addEventListener('keyup', function() {
        var search = this.value.toLowerCase();
        wsdotNum= 0;
        sdotNum = 0;
        var idx;
        for (idx = 0; idx < copyData.length; idx++) { 
            if(copyData[idx].cameralabel.toLowerCase().indexOf(search) >= 0) {
                map.addLayer(markers[idx]);
                if(copyData[idx].ownershipcd == "SDOT") {
                    sdotNum++;
                } else if(copyData[idx].ownershipcd == "WSDOT") {
                    wsdotNum++;
                }
            } else {
                map.removeLayer(markers[idx]);
            }
        }
        $("#SDOT").text(sdotNum + ' by ' + sLabel + ' ');
        $("#WSDOT").text(wsdotNum + ' by ' + wLabel);
    });
});