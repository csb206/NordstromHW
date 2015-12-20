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

Since I wanted to add a marker to the map for each camera, I was also thinking what would be a good way to indicate which camera belonged to which agency using a key of some sort. So I figured the marker color should indicate who owns it (SDOT or WSDOT). Additionally, I wanted to show the camera description and current image in a popup when the user clicks on a marker for each camera.