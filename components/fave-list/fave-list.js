define(["knockout", "text!./fave-list.html", "knockout-postbox"], function(ko, favesTemplate) {
	function FaveListViewModel() {
		var self = this;
		self.fave_tracks = ko.observableArray();
		self.list_size = ko.computed(function() {
			return ' ' + 	self.fave_tracks().length;
		});
		self.hasSamples = ko.observable(false);
		self.hasLyrics = ko.observable(false);
		self.display_list = ko.computed(function() {
			if (!self.hasSamples() && !self.hasLyrics()) {
				return self.fave_tracks();
			} else if (self.hasSamples() && !self.hasLyrics()) {
				return ko.utils.arrayFilter(self.fave_tracks(), function(item) {
					return item.url !== 'No Url';
				});
			} else if (!self.hasSamples() && self.hasLyrics()) {
				return ko.utils.arrayFilter(self.fave_tracks(), function(item) {
					return item.lyrics_url !== '#';
				});
			} else {
					return ko.utils.arrayFilter(self.fave_tracks(), function(item) {
						return item.lyrics_url !== '#' && item.url !== 'No Url';
					});
			}
		});

		var _inform = $('.list-inform');

		// sets, displays and removes user-informing elmnt
		function informUser(message) {
			_inform.find('span').html(message);
			_inform.fadeIn().delay( 1000 ).fadeOut();
		}

		// check for saved fave list and load if so
		function checkStorage() {
			var user_list = app.storage.get('saved_list');
			if(user_list) {
				// restore certain properties
				user_list.forEach(function(track) {
					// restore the maps lat/loong obj
					var lat = track.location.D;
					var long = track.location.k;
					track.location = new google.maps.LatLng(long, lat);
					// restore the marker obj
//					track.marker = new google.maps.Marker({
//						position: track.location,
//						animation:google.maps.Animation.DROP,
//						icon: 'images/geomuze-icon-small.png'
//					});
				});
				// set into list view...
				self.fave_tracks(user_list);
				console.log("saved list data is: %O", user_list);
				informUser('Here is your precious list!');
			}
			else
				informUser('I am so sorry. No trace of a list.');
		}

		// save user fave list to localstorage;
		// can be restored with load call
		self.saveList = function() {
			app.storage.set('saved_list', self.fave_tracks());
			_inform.find('span').html('Your list has been preserved.');
			_inform.fadeIn().delay( 1000 ).fadeOut();
		}

		// To make sure addFave callback was already
		// defined when executing this line...
		// changed func assignment to a definition
		// to benefit from 'hoisting'
		ko.postbox.subscribe('fave_alert', addFave);

		function addFave(result) {
			// make sure the 'type' being set is a Result obj
			console.log("adding a fave...user msg should appear");
			if(Result.prototype.isPrototypeOf(result)) {
			// also make sure the track isn't already faved!
				if(!self.fave_tracks().alreadyInArray(result.track_name, result.artist_name)) {
					var result_origin = app.current_location;
					var new_fave = new FaveTrack(result, result_origin);
					self.fave_tracks.push(new_fave);
					informUser('this track has been faved!');
				}
				else {
					informUser('this track is ALREADY faved..')
				}
			}
		}

		// allows user to remove track from this list
		self.removeFave = function(index) {
			self.fave_tracks.remove(self.fave_tracks()[index]);
			informUser('this track hath been UNfaved.');
		};

		// user selects a track to see additional options
		// Note: called from view using bind(), this = data_obj
		self.selectFave = function(index) {
			// if the target wasnt a btn, toggle the class
			// if other item had the class, remove it
			if(event.target.nodeName !== "BUTTON" ) {
				if(!$(this).hasClass('result-selected')) {
					var prev_selected = $('.result-selected');
					prev_selected.toggleClass('result-selected');
					prev_selected.find('.result-btn-panel').slideToggle();
				}
				$(this).toggleClass('result-selected');
				$(this).find('.result-btn-panel').slideToggle();
			}
		};

		// meant to fire a location change request on map
		// and preconfig the map infobox
		self.locateFave = function(track) {
			app.configInfopane(track);
			app.gotoLocation(track.location, google.maps.places.PlacesServiceStatus.OK);
		};

		// shows location of all faved tracks on map
		self.locateAll = function() {
			app.infopane.close(); // close an open info window
			app.showAllMarkers(self.fave_tracks());
		};

		// empties current favelist; does not effect saved data
		self.emptyList = function() {
			self.fave_tracks.removeAll(); // remove & return list
		};

		// will load saved list if one exists;
		// NOTE: overwrites current list!
		self.loadList = function() {
			checkStorage();
		};

		// delegate click handling to the parent list
		$('#fave-list').on('click', 'li', self.selectFave);

		// end of Fave List Model definition
	}
	return { viewModel: FaveListViewModel, template: favesTemplate };
});
