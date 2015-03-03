define(["knockout", "text!./fave-list.html", "knockout-postbox"], function(ko, favesTemplate) {

	function FaveListViewModel() {
		var self = this;
		self.current_selection = ko.observable(); //need to be synched btwn lists?

//		var test_list = [new Result("Can't Stop", "RHCP"), new Result("Flaws", "Bastille"), new Result("Rainbow Connection", "Willie Nelson")];

		self.fave_tracks = ko.observableArray();

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
				}
			}
		}

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
		self.removeItem = function(item) {
			console.log("Remove favorite fired!");
			self.fave_tracks.remove(item);
			var selection = self.current_selection();
			selection = (selection === 0)? 0 : selection-1;
			self.current_selection(0);
		};

	}
	return { viewModel: FaveListViewModel, template: favesTemplate };
});
