define(["knockout", "text!./fave-list.html", "knockout-postbox"], function(ko, favesTemplate) {

	function FaveListViewModel() {
		var self = this;
		self.fave_tracks = ko.observableArray();
		var _inform = $('.list-inform');

		function informUser(message) {
			_inform.find('span').html(message);
			_inform.fadeIn().delay( 1000 ).fadeOut();
		}

		function checkStorage() {
			var user_list = app.storage.get('saved_list');
			if(user_list) {
				// restore certain properties
				user_list.forEach(function(track) {
					console.log("Prev coord data is: %O", track.location);
					// restore the maps lat/loong obj
					var lat = track.location.D;
					var long = track.location.k;
					track.location = new google.maps.LatLng(long, lat);
					// restore the marker obj
					track.marker = new google.maps.Marker({
						position: track.location,
						animation:google.maps.Animation.DROP,
						icon: 'images/geomuze-icon-small.png'
					});
				});
				// set into list view...
				self.fave_tracks(user_list);
				console.log("saved list data is: %O", user_list);
				informUser('Here is your precious list!');
			}
			else
				informUser('I am so sorry. No trace of a list.');
		}

		self.saveList = function() {
			// confirm with user
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
			if(Result.prototype.isPrototypeOf(result)) {
			// also make sure the track isn't already faved!
				if(!self.fave_tracks().alreadyInArray(result.track_name, result.artist_name)) {
					var result_origin = app.current_location;
					var new_fave = new FaveTrack(result, result_origin);
					self.fave_tracks.push(new_fave);
//					_inform.find('span').html('this track has been faved!');
					informUser('this track has been faved!');
				}
				else {
//					_inform.find('span').html('this track is ALREADY faved!');
					informUser('this track is ALREADY faved..')
				}
//				_inform.fadeIn().delay( 1000 ).fadeOut();
			}
		}

		// allows user to remove track from this list
		self.removeFave = function(index) {
			self.fave_tracks.remove(self.fave_tracks()[index]);
//			_inform.find('span').html('this track hath been UNfaved.');
//			_inform.fadeIn().delay( 1000 ).fadeOut();
			informUser('this track hath been UNfaved.');
		};

		// user selects a track to see more info,
		// open additional opens such as Play, etc
		// also control relevant styles and transitions
		// Note: called from view using bind(), this = data_obj
		self.selectFave = function(index) {
			// the two toggle actions actually also combine for
			// effect of NOT removing class if btn is pressed
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
		self.locateFave = function(track) {
			app.configInfopane(track);
			app.gotoLocation(track.location, google.maps.places.PlacesServiceStatus.OK);
			console.log("want to locate ... %O", track.location);
		};

		self.locateAll = function() {
			app.infopane.close(); // close an open info window
			app.showAllMarkers(self.fave_tracks());
		};

		self.emptyList = function() {
			self.fave_tracks.removeAll(); // remove & return list
		};

		self.loadList = function() {
			checkStorage();
		};

		// delegate click handling to the parent list
		$('#fave-list').on('click', 'li', self.selectFave);

		// check if user already has a list on local storage
		//checkStorage();
	}
	return { viewModel: FaveListViewModel, template: favesTemplate };
});
