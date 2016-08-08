//how to do a leafLet map

// first initialized the map by setting the map center and referring to an html tag with an id 
var mymap = L.map('mapid').setView([39.828, 98.57], 18);
// adding a mapbox later to the map, then make an api call to mapbox to retrive the layer

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA#2/0.0/0.0', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: "joy9017mapbox.11h51ekk",
	access_token: "pk.eyJ1Ijoiam95OTAxN21hcGJveCIsImEiOiJjaW94M2RneXQwMDJ1d2ZtNXp4a29pbTV4In0.TebEkoRfRP8E0hw_Nd3PFA",

}).addTo(mymap);

// then gotta make sure the map takeup enough space for it to be interactive

// maybe map to box is a 70 to 30?

// then apply a map layer that is not busy 

// have shape files ready and uploaded 
	// figure out if shapefiles are uploaded through this js file or through a plugin 
	// make sure shape files can show the name of the state, in two letter format 
	
// make shape files clickable

// show corresponding content in box when shape is clicked 
	// maybe use a for loop to generate the same index for the box and the shape file?

// empty box when clicked on a different shape file
	// if can't make this happen, have an X inside the box, so when it's clicked on, use the .empty() method on the box


// BOUNUS POINT - ONLY IF EVERYTHING ELSE INLCUDING THE NYT API WORKS!!! 
	// zoom in as the state is being clicked