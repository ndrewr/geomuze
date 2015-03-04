define(["knockout", "text!./fave-list.html", "knockout-postbox"], function(ko, favesTemplate) {

	function FaveListViewModel() {
		var self = this;
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

		// allows user to remove track from this list
		self.removeFave = function(index) {
			console.log("Track # %s wants to be unfaved!", index);
			self.fave_tracks.remove(self.fave_tracks()[index]);
		};

		// user selects a track to see more info,
		// open additional opens such as Play, etc
		// also control relevant styles and transitions
		// Note: called from view using bind(), this = data_obj
		self.selectFave = function(index) {
			var context = ko.contextFor(this);
			var data = ko.dataFor(this);
			console.log("Delegated click handler...data is %O and context is %O", data, context);
			console.log("The affected element is %O and the event data is %O", this, event);

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

		self.doAction = function() {
			console.log("I have fired")
		};

		// delegate click handling to the parent list
		$('#fave-list').on('click', 'li', self.selectFave);
	}
	return { viewModel: FaveListViewModel, template: favesTemplate };
});
