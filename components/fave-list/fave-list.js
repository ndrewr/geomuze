define(["knockout", "text!./fave-list.html", "knockout-postbox"], function(ko, favesTemplate) {

	function FaveListViewModel() {
		var self = this;
		self.current_selection = ko.observable(0);
		self.fresh_tracks = ko.observableArray().subscribeTo('new_results');
		self.fave_tracks = ko.observableArray();

		// user selects a track to see more info,
		// open additional opens such as Play, etc
		// also control relevant styles and transitions
		// Note: called from view using bind(), this = data_obj
		self.selectTrack = function(index) {
			self.current_selection(index);
		};

		// optional feature allowing user to mark a track as
		// "favorite", therby adding to a second array list
		// that can be viewed in a seperate element pane or
		// thru a toggle btn on this pane
		self.removeItem = function() {
			console.log("Remove favorite fired!");

		};

	}
	return { viewModel: FaveListViewModel, template: favesTemplate };
});
