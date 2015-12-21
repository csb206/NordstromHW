# NordstromHW
Internship Seattle API Data Homework

"In Technology data is key in making critical decisions and having too little or duplicate data may generate mislead reports. 
Using the City of Seattle's API, https://data.seattle.gov, develop a process for continually polling/ collecting available dataset(s).

It’s not enough just to have rich data, but you must able to quickly visualize in meaning full way. Use the data previously collected 
to create visualizations."

I decided to use the Seattle Traffic Camera's Report to demonstrate my thought process ability in creating a visualization for data. 
Here is a link to the mab-based visualization for this report, http://students.washington.edu/csb206/NordstromHW/. 

The data for this challenge will be the current set of Seattle-area traffic cameras, which is provided by the Seattle Open Data Project.Based off my existing knowledge, I thought it would be useful to convert the traffic camera data into a JSON file with a [given URL](https://data.seattle.gov/resource/65fc-btcc.json).

## The Data
Each object has .. 

- a property named location, which is set to another object containing the properties latitude and longitude. I can plot the cameras using this information. 
- an imageurl property, which is set to another object with a url. This property contains the URL to a still image from the camera that is updated every few minutes. 
- a cameralabel property set to a string that describes the location of the camera. \
- a ownershipcd property that is set to a string containing either "SDOT" (Seattle Department of Transportation) or "WSDOT" (Washington State Department of Transportation). This indicates which agency owns and operates the camera.

## Thoughts Behind the Design/Implemenation

Using this information, I thought it would be useful to plot these cameras on a scrollable and zoomable map. To get ahold of an interactive map, I wanted to use the [Leaflet.js library](http://leafletjs.com/) (or Google maps). 

I used the jQuery $.getJSON() method to retrieve the traffic camera data, as this is very simple to use and will automatically parse the results as JSON. 

Since I wanted to add a [marker](http://leafletjs.com/reference.html#circlemarker) to the map for each camera, I was also thinking what would be a good way to indicate which camera belonged to which agency using a key of some sort. So I figured the marker color should indicate who owns it (SDOT or WSDOT). Additionally, I wanted to show the camera description and current image in a popup when the user clicks on a marker for each camera.

### Pseudocode:
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

Allowing the user to filter the set of cameras based on a search string gives the page more interactivity. When the user enters a search string, this map filters the set of camera markers shown to only those where the camera's cameralabel property contains the search string. The filter feature will also update how many SDOT vs WSDOT cameras are currently displayed on the map. 

### Pseudocode:
    var searchFilter = document.getElementById('search-filter-field');
    searchFilter.addEventListener('keyup', function() {
        var search = this.value.toLowerCase();
		wsdotNum = 0;
        sdotNum = 0;
        var idx;
        for (idx = 0; idx < copyData.length; idx++) { 
            if (copyData[idx].cameralabel.toLowerCase().indexOf(search) >= 0) {
                map.addLayer(markers[idx]);
                if (copyData[idx].ownershipcd == "SDOT") {
                    sdotNum++;
                } else if (copyData[idx].ownershipcd == "WSDOT") {
                    wsdotNum++;
                }
            } else {
                map.removeLayer(markers[idx]);
            }
        }
        
When the user clicks or taps on a camera marker, the maps shows information about that camera somewhere on the page. The mapping library provides a popup feature so I used that to my advantage as well. 

## Challenges

There were a few different problems that took longer for me to address than others. One of them consisted of the popup dimensions constraints for the Leaflet poppup options. The popup was too narrow to show the full image. After reviewing their documentation, I realized that if the img element doesnt have an explicit width set, the popup window doesn't know how wide it will be once its downloaded and rendered. After further research, I read that Leaflet popup's have a default max width of 300px as most images are wider than that. I had to set the image element width and height to 250px to fix this issue. 

Another challenging aspect of this homework assignment was keeping track of the number of WSDOT and SDOT cameras currently displayed along with actually displaying the cameras while filtering the user input for their search. If the cameralabel matched the same character of the same index for the search then call the map.addLayer() method to add the marker and map.removeLayer() to remove the marker otherwise. Add the count of the amount of SDOT and WSDOT cameras as each marker's ownershipcd is read. 