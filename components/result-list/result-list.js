define(["knockout", "text!./result-list.html", "knockout-postbox"], function(ko, resultsTemplate) {

	function ListViewModel() {
		var self = this;
		self.tracks = ko.observableArray(	).subscribeTo('new_results');
//		var message = ko.observable("Search returned " + self.tracks().length + " results").publishOn('home_msg');
		self.current_location = {}; // location of search results
		self.latest_fave = ko.observable({}).publishOn('fave_alert');
		self.current_selection = ko.observable();



		// user selects a track to see more info,
		// open additional options such as Play, etc
		// also control relevant styles and transitions
		// Note: called from view using bind(), this = data_obj
		self.selectTrack = function(index) {
			self.current_selection(index);
		};

		// optional feature allowing user to mark a track as
		// "favorite", therby adding to a second array list
		// that can be viewed in a seperate element pane or
		// thru a toggle btn on this pane
		self.setFavorite = function() {
			console.log("Track favorite fired!");


		};

	}
	return { viewModel: ListViewModel, template: resultsTemplate };
});
