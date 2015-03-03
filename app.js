
(function() {

	window.app = 	{}; // public interface obj for map functions

	function loadScript() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places' +
//			'&key=AIzaSyCoh9OIWE1vT85aaoVRqszGR6E3TeEut24' +
			'&signed_in=true&callback=initialize';
		document.body.appendChild(script);
	}

	// under this implementation I might try to load  faves from
	// database first...
//	app.faves = new FaveList();

	app.bindPlayer = function(url, title) {
		var aud = $('#jukebox .aud').get(0);

		aud.setAttribute('src', url);
		$('#jukebox .info').html(title);
		aud.load();

		$('#jukebox .play').bind('click', function(evt) {
			evt.preventDefault();
			aud.play();
		});

		$('#jukebox .pause').bind('click', function(evt) {
			evt.preventDefault();
			aud.pause();
		});

		// JQuery doesn't seem to like binding to these HTML 5
		// media events, but addEventListener does just fine
		aud.addEventListener('progress', function(evt) {
			var width = parseInt($('#jukebox').css('width'));
			var percentLoaded = Math.round(evt.loaded / evt.total * 100);
			var barWidth = Math.ceil(percentLoaded * (width / 100));
			$('#jukebox .load-progress').css( 'width', barWidth );
		});

		aud.addEventListener('timeupdate', function(evt) {
			var width = parseInt($('#jukebox').css('width'));
			var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
			var barWidth = Math.ceil(percentPlayed * (width / 100));
			$('#jukebox .play-progress').css( 'width', barWidth);
		});

		aud.addEventListener('canplay', function(evt) {
			$('#jukebox .play').trigger('click');
		});

		return aud;
	}


	/* initialize google map functions */
	// google api will search global obj for callback
	window.initialize = function() {
		console.log("Initializing app!");
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

		MapView(custom_style, app);
//		app.mapView = new MapView(custom_style, app);


		console.log("map started!?");
	}

	function MapView(map_style, app) {
		var self = app;
		self.current_location = new google.maps.LatLng(-33.8665433,151.1956316); // default location

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



		var audio_template =
				'<div id="jukebox"><div class="info">Please wait...</div><div class="loader"><div class="load-progress"><div class="play-progress"></div></div></div><div class="controls"><a class="play" href="#"><span>Play</span></a><a class="pause" href="#"><span>Pause</span></a></div><audio class="aud" src="http://www.scottandrew.com/mp3/demos/holding_back_demo_011504.mp3"><p>Oops, looks like your browser does not support HTML 5 audio.</p></audio></div>';



		// create the map info window
		// NOTE only one window open at a time; reuse!
		self.infopane = new google.maps.InfoWindow({
//			content: "Well, Hullo! I'll have more to say after a lil' searchy-search!",
			content: audio_template,
			maxWidth: 300
		});

		// this helper can be used to config info window content
		// before it is displayed on map
		self.configInfopane = function(track) {
			// content:
			// - album cover?
			// song title
			// artist title
			// spotify play link?
			var info_template = '<h3>' + track.track_name +
					'</h3><div><p><img src="' +
					track.cover + '"/></p><p>' +
					track.artist_name + '</p></div>';

//			self.infopane.setContent(info_template + audio_template);

			self.bindPlayer(track.url, track.track_name);

		}


		var current_marker;
		// create a google maps marker
		self.createMarker = function(location) {

			if (current_marker) {
				current_marker.setMap(null);
				current_marker = null;
			}

			var marker = new google.maps.Marker({
				map: self.map,
				position: location,
				animation:google.maps.Animation.DROP
			});

			current_marker = marker;

			// if I assign the click handler here...
			google.maps.event.addListener(marker, 'click', function() {
				self.infopane.open(self.map, marker);
			});

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

		// Stub for future autocomplete functionality...
		// NOTE: when user chooses autocomplete to populate the
		// search bar, the observable doesnt get all the terms...
		// only the term(s) user actually typed!
		//	self.gotoAutoComplete = function() {};

		self.gotoLocation = function(results, status) {
			console.log("Seeking new location...");
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var place, new_coord;
				// check if passed 'result' is an array of locations
				if (Array.isArray(results)) {
					place = results[0]; //first result of search
					new_coord = place.geometry.location;
				}
				else new_coord = results; //param is a location obj

				console.log("Going to location...result is %O", place);

				self.current_location = new_coord;
				self.map.setCenter(new_coord);
				self.createMarker(new_coord);
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
		self.service.textSearch(request, self.gotoLocation);

	}


	window.onload = loadScript;

	// Can setTimeout for 3-5 secs here,
	// display error if Google still has not loaded
//	var getG = setInterval(function() {
//			console.log("Load try...");
//			if(google.maps.event.addDomListener) {
//
//				clearInterval(getG);
//				google.maps.event.addDomListener(window, 'load', initialize);
//			}
//	}, 50);


//	return app;

})();
