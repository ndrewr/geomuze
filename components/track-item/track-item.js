
// View model for song track items within 'playlists'
// Intended to be used for both Results and Favorites lists
// Button availability can be customized by passing in params
// on component binding ie. 'fave: true'
define(["knockout", "text!./track-item.html", "knockout-postbox"], function(ko, trackItemTemplate) {
	function TrackItemViewModel(params) {
		var self = this;

		var track = params.track;
		var parentList = params.parent;
		self.isActive = ko.observable();
//		self.isActive = ko.computed(function() {
//			return parentList.current_selection() === self.index;
//
//		});

		self.track_name = ko.observable(track.track_name || 'no title');
		self.artist_name = ko.observable(track.artist_name || 'no name');

		self.spotify = params.spotfiy || true;
		self.youtube = params.youtube || false;
		self.fave = params.fave || true;
		self.delete = params.delete || false;

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

		// OK so default btns are spotify and then either fave (result list) or delete (fave list)
		// Youtube btn can be pushed later...BETTER WAY???
		self.control_btns = ko.observableArray([
			new ControlBtn("spotify", self.spotifyAction.bind(self)),
			(self.delete?
			 new ControlBtn("delete", self.removeAction.bind(self))
			 : new ControlBtn("fave", self.faveAction.bind(self)))
		]);

		// determines if active class is on element
		self.selectTrack = function() {
			self.isActive(!self.isActive());
		}

	}

	return { viewModel: TrackItemViewModel, template: trackItemTemplate };
});
