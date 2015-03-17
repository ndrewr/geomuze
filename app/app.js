// Initialize app objects: map, media players
(function() {
	window.app = 	{}; // public interface obj for app

	// this will be called upon execution of IIFE
	function loadScript() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places' +
//			'&key=AIzaSyCoh9OIWE1vT85aaoVRqszGR6E3TeEut24' +
			'&signed_in=true&callback=initialize';
		document.body.appendChild(script);
	}

	function initStorage(app) {
		app.storage = {
			set: function(key, value) {
				if (!key || !value) {return;}

				if (typeof value === "object") {
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			},
			get: function(key) {
				var value = localStorage.getItem(key);

				if (!value) {return;}

				value = JSON.parse(value);
				return value;
			}
		}
		localStorage.setItem('saved-list', test_data);
	}

	function initPlayer(app) {
		app.player = {};
		app.player.audio = $('.aud')[0];
		app.player.isPlaying = false;
		var aud = app.player.audio;

		$('body').on('click', '.audio-control', function(evt) {
			evt.preventDefault();

			console.log("play/pause btn pressed");

			// control state between play/pause
			if(app.player.audio.isPlaying) {
				aud.pause();
				app.player.audio.isPlaying = false;
				$('.play').removeClass('icon-pause2').addClass('icon-play3');
			}
			else {
				aud.play();
				app.player.audio.isPlaying = true;
				$('.play').removeClass('icon-play3').addClass('icon-pause2');
			}

			// event handlers for audio player
			aud.addEventListener('ended', function() {
				app.player.audio.isPlaying = false;
				$('.play').removeClass('icon-pause2').addClass('icon-play3');
			});

			aud.addEventListener('timeupdate', function(evt) {
				var width = parseInt($('#jukebox').css('width')) - 10; // adjustment accounts for elmnt padding
				var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
				var barWidth = Math.floor(percentPlayed * (width / 100));
				$('#jukebox .play-progress').css( 'width', barWidth);
			});
		});
	}

	// PUBLIC: updates player params with src and title info
	app.configPlayer = function(url, title) {
		app.player.audio.pause();
		app.player.audio.currentTime = 0;
		if(url === 'No Url' || url === 'No%20Url') {
			$('.play').removeClass('icon-play3').addClass('disable');
			$('.player-info').html('No Sample');
		}
		else {
			app.player.audio.setAttribute('src', url);
			app.player.audio.load();
			$('.player-info').html('Sample Clip');
		}

		// if player was middle of playing, set back to false
		if(app.player.audio.isPlaying) {
			app.player.audio.isPlaying = false;
		}
	}

	function initHandlers(app) {
		// handles the list toggle btn for smaller screens
		var _listtoggle = $('#list-toggle');
		var _icon = $('#list-toggle span');
		var _listcontainer = $("#list-container");

		_listtoggle.click(function() {
			var leftOffset = _listcontainer.css('left') === '0px' ? '-290px' : '0px';
			_listcontainer.animate({ left: leftOffset }, 1000);
			// swap btn icons
			if (_icon.hasClass('icon-map'))
				_icon.removeClass('icon-map').addClass('icon-file-text');
			else
				_icon.removeClass('icon-file-text').addClass('icon-map');
		});

		// makes bootstrap navbar auto collapse on selection
		$('.navbar-collapse a').click(function(){
			$(".navbar-collapse").collapse('hide');
		});

		// define a function to auto hide the list view
		app.hideList = function() {
			var isMobileMode = _listtoggle.css('display') === 'none' ? false : true;
			if (isMobileMode)
				_listtoggle.click();
		}

		app.showList = function() {
			var isMobileMode = _listtoggle.css('display') === 'none' ? false : true;
			var isHidden = _listcontainer.css('left') === '0px' ? false : true;
			if (isMobileMode && isHidden)
				_listtoggle.click();
		}
	}

	/**** initialize app storage, media plaback and
	      google map functions; Note: google api
				will search global obj for callback ****/
	window.initialize = function() {
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
				"featureType": "transit.station.airport",
				"stylers": [
					{ "color": "#cfd2d5" }
				]
			}
		];

		// initialize app components
		MapView(custom_style, app);
		initStorage(app);

		// following steps require jquery
		var checker = 0;
		(function checkJquery() {
			if (window.jQuery) {
				clearInterval(checker);
				initPlayer(app);
				app.configInfopane(initial_result); //load default
				initHandlers(app);
			}
			else {
				checker = window.setInterval(checkJquery, 100);
			}
		})();
	}

	function MapView(map_style, app) {
		var self = app;
		var markers = []; // Faves markers; see showAllMarkers
		var current_marker; // ref for dealloc; see createMarker

		self.current_location = new google.maps.LatLng(-33.8665433,151.1956316); // default

		// Initial map settings, location
		var mapOptions = {
			center: { lat: -34.397, lng: 150.644},
			zoom: 10,
			styles: map_style
		};

		// PUBLIC: map reference accessible within map
		self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// bind page search bar to autocomplete function
		//var search_bar = document.getElementById('searchbar');
		// for google maps api own search bar	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_bar);
//		self.autocomplete = new google.maps.places.Autocomplete(
//			/** @type {HTMLInputElement} */(search_bar),
//			{
//				types: ['(cities)'],
//			});

		self.service = new google.maps.places.PlacesService(self.map);

		// PUBLIC: create then access the map info window
		// NOTE only one window open at a time; reuse!
		self.infopane = new google.maps.InfoWindow({
			content: "Well, Hullo! I'll have more to say after a lil' searchy-search!",
			maxWidth: 320
		});

		// PUBLIC: configs info window before it
		// is displayed on map
		self.configInfopane = function(track) {
			var audio_template =
					'<div id="jukebox"><div class="player-info">Sample Clip</div><a class="audio-control play icon-play3" href="#"><span>Play</span></a><div class="loader"><div class="play-progress"></div></div><audio class="aud" src="http://www.scottandrew.com/mp3/demos/holding_back_demo_011504.mp3"><p>Oops, looks like your browser does not support HTML 5 audio.</p></audio></div>';

			var info_template = '<h3>' + track.track_name +
					'</h3><p>' + track.artist_name +
					'</p><p><em>' + track.album + '</em></p>' +
					'<div class="infobox-player"><img src="' + 					track.cover + '"/>' + audio_template + '</div>';

			self.infopane.setContent(info_template);
			var track_loc = track.location;
			self.infopane.setPosition(track_loc? track_loc : self.current_location);
			// update audio player
			self.configPlayer(track.url, track.track_name);
		}

		// Destroy previously placed markers;
		// In case showAll was called, remove those markers
		function clearMarker() {
			if (current_marker) {
				current_marker.setMap(null);
				current_marker = null;
			}
			if (markers.length > 0) {
				markers.forEach(function(marker) {
					marker.setMap(null);
					marker = null; // make sure to dealloc
				});
			}
		}

		// PUBLIC: create a new marker on demand
		// NOTE better to just use one obj over and over
		// instead of repeatedly allocating a new obj...
		self.createMarker = function(location) {
			var marker = new google.maps.Marker({
				map: self.map,
				position: location,
				animation:google.maps.Animation.DROP,
				draggable: true,
				icon: 'images/geomuze-icon-small.png'
			});

			current_marker = marker; // track for dealloc

			google.maps.event.addListener(marker, 'click', function() {
				self.infopane.open(self.map, marker);
			});
			google.maps.event.addListener(marker, 'mousedown', function(){
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

		// PUBLIC: goto a new location on map;
		// callback from doPlaceSearch which passes array of
		// locations and status code
		self.gotoLocation = function(location_data, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				var place, new_coord;
				clearMarker();
				// check if param is an array of locations
				if (Array.isArray(location_data)) {
					place = location_data[0]; //first search result
					new_coord = place.geometry.location;
				}
				else new_coord = location_data; //param is a location obj

				//console.log("Going to location...located at %O", new_coord);

				self.current_location = new_coord; // used by Faves
				self.map.setCenter(new_coord);
				self.map.setZoom(10);
				self.createMarker(new_coord);
			}
		};

		// PUBLIC: takes array of tracks and sequentially
		// drops markers on each associated location
		// Called from Faves List View Model
		self.showAllMarkers = function(items) {
			clearMarker(); // remove prev set marker
			markers = []; // reset markers in case of unfaves
			var boundary = new google.maps.LatLngBounds();
			for (var i=0; i < items.length; i++) {
				var marker = new google.maps.Marker({
					position: items[i].location,
					title: items[i].track_name,
					animation: google.maps.Animation.DROP,
					icon: 'images/geomuze-icon-small.png'
				});
				markers.push(marker);
				boundary.extend(marker.position);
				self.map.fitBounds(boundary);
				drop(marker, i); // use helper function closure
			}
		}

		// helper function to delay marker drops
		function drop(marker, delay) {
			setTimeout(function() {
				marker.setMap(self.map);
			}, delay * 200);
		}

		/*** Event handlers ***/
//		google.maps.event.addListener(self.autocomplete, 'place_changed', self.gotoAutoComplete);

		// initial location default set to Udacity Intl HQ
		var request = {
			location: new google.maps.LatLng( 37.399864,-122.10840000000002),
			radius: '500',
			query: 'restaurant'
		};
		// run search for initial location as set above
		// textSearch() returns results array and status code
		self.service.textSearch(request, self.gotoLocation);
	}

	// kick off map load and initializing functions
	window.onload = loadScript;
	// end app module definition
})();
