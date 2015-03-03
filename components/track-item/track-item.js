
// View model for song track items within 'playlists'
// Intended to be used for both Results and Favorites lists
// Button availability can be customized by passing in params
// on component binding ie. 'fave: true'
define(["knockout", "text!./track-item.html", "knockout-postbox"], function(ko, trackItemTemplate) {
	function TrackItemViewModel(params) {
		var self = this;
		self.isActive = ko.observable();

		var track = params.track;
		var parentList = params.parent;
		self.track_name = ko.observable(track.track_name || 'no title');
		self.artist_name = ko.observable(track.artist_name || 'no name');

		self.spotify = params.spotfiy || true;
		self.youtube = params.youtube || false;
		self.fave = params.fave || true;
		self.delete = params.delete || false;
		self.locate = params.locate || false;

		self.spotifyAction = function(data) {
			console.log("THIS is currently set to ...%O", this);

		};

		// notify subscribers that this track wants to be added
		// update parent-list's observable to trigger fave add
		self.faveAction = function() {
			parentList.latest_fave(track);
		};

		// will call parents removeItem and let them handle
		// the list management
		self.removeAction = function() {
			parentList.removeItem(track);
		};

		// meant to fire a location change request on map
		self.locateAction = function() {
			app.configInfopane(track);
			app.gotoLocation(track.location, google.maps.places.PlacesServiceStatus.OK);
		};

		// OK so default btns are spotify and then either fave (result list) or delete (fave list)
		// Youtube btn can be pushed later...BETTER WAY???
		self.control_btns = ko.observableArray([
			new ControlBtn("spotify", self.spotifyAction.bind(self)),
			(self.delete?
			 new ControlBtn("delete", self.removeAction.bind(self))
			 : new ControlBtn("fave", self.faveAction.bind(self)))
		]);

		if(self.locate)
			self.control_btns.push(new ControlBtn("go", self.locateAction.bind(self)));

		// determines if active class is on element
		self.selectTrack = function(data, event) {
			var prev = $('.result-selected');

			if (prev.length > 0)
			ko.utils.triggerEvent(prev[0], 'click');

			console.log("Is this the event data...%O", event);
			self.isActive(!self.isActive());
		}
//		self.deselector = function(data, event) {
////				$('.result-selected').trigger('click');
//			self.isActive(!self.isActive());
//
//		}

	}

	return { viewModel: TrackItemViewModel, template: trackItemTemplate };
});
