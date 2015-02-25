/* initialize google map functions */
function initializeMap() {
	// custom map styles as set at Maps Styling Wizard
	var custom_style = [
		{
			"stylers": [
				{ "color": "#439a5c" }
			]
		},{
			"featureType": "water",
			"elementType": "geometry.fill",
			"stylers": [
				{ "color": "#268993" }
			]
		},{
			"elementType": "labels.text.fill",
			"stylers": [
				{ "color": "#781543" }
			]
		},{
			"elementType": "labels.text.stroke",
			"stylers": [
				{ "weight": 0.3 },
				{ "color": "#121319" }
			]
		},{
		},{
			"featureType": "landscape.natural.terrain",
			"stylers": [
				{ "color": "#3e7248" }
			]
		},{
			"featureType": "road.highway",
			"stylers": [
				{ "color": "#e2c419" }
			]
		},{
		},{
		},{
			"featureType": "transit.station.airport",
			"stylers": [
				{ "color": "#cfd2d5" }
			]
		},{
		}
	];

	window.mapView = new MapView(custom_style);
	console.log("map started!?");
}

function MapView(map_style) {
	var self = this;

	// Initial map settings, location
	var mapOptions = {
		center: { lat: -34.397, lng: 150.644},
		zoom: 10,
		styles: map_style
	};

	self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// bind page search bar to autocomplete function
	var search_bar = document.getElementById('searchbar');
	// for google maps api own search bar	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_bar);
	self.autocomplete = new google.maps.places.Autocomplete(
		/** @type {HTMLInputElement} */(search_bar),
		{
			types: ['(cities)'],
		});

	self.service = new google.maps.places.PlacesService(self.map);

// create a google maps marker
	self.createMarker = function(location) {
		var marker=new google.maps.Marker({
			map: self.map,
			position: location,
			animation:google.maps.Animation.DROP
		});
//		marker.setMap(self.map);
	};

// perform places search based on query string param
// upon success, call gotoLocation to update map
	self.doPlaceSearch = function(place_string) {
		self.service.textSearch(
			{
				query: place_string,
				type: 'cities'
			}, self.gotoLocation);
	};

// use selected autocomplete option to perform place search
	self.gotoAutoComplete = function() {
			console.log("Autocomplete event listener fired!");

//		var place = self.autocomplete.getPlace();
//
//
//		if (!place.geometry) {
//			return;
//		}
//
//		self.map.setCenter(place.geometry.location);
//		self.createMarker(place.geometry.location);
//
//		var address = '';
//		if (place.address_components)
//		{
//			address = [
//				(place.address_components[0] && place.address_components[0].short_name || ''),
//				(place.address_components[1] && place.address_components[1].short_name || ''),
//				(place.address_components[2] && place.address_components[2].short_name || '')
//			].join(' ');
//		}
	};

	self.gotoLocation = function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			//			for (var i = 0; i < results.length; i++) {
			var place = results[0]; //first result of search
			////				createMarker(results[i]);
			//			}

			console.log("Going to location...result is %O", place);

			self.map.setCenter(place.geometry.location);
			self.createMarker(place.geometry.location);
		}
	};

/*** Event handlers ***/
	google.maps.event.addListener(self.autocomplete, 'place_changed', self.gotoAutoComplete);


/*** run default location ***/
	// initial location default set to Pyrmont
	var request = {
		location: new google.maps.LatLng(-33.8665433,151.1956316),
		radius: '500',
		query: 'restaurant'
	};
	// run search for initial location as set above
	// textSearch() returns results array and status code
//	self.service.textSearch(request, self.gotoLocation);

}

