
// View model for list button panel
// Intended to be used for both Results and Favorites lists
// Button availability can be customized by passing in params
// on component binding ie. 'fave: true'
define(["knockout", "text!./btn-panel.html", "knockout-postbox"], function(ko, btnPanelTemplate) {

	function BtnPanelViewModel(params) {
		var self = this;
		self.spotify = params.spotfiy || true;
		self.youtube = params.youtube || false;
		self.fave = params.fave || false;
		self.delete = params.delete || true;

		self.spotifyAction = function(data) {
			console.log("THIS is currently set to ...%O", this);


		};

		self.faveAction = function() {
			// notify subscribers that this track wants to be added
			// to Favorites list
			// BtnPanel has a LI parent that represents track data
			// how to obtain reference to this and 'pass' it over?



		};

		// OK so default btns are spotify and then either fave (result list) or delete (fave list)
		// Youtube btn can be pushed later...BETTER WAY???
		self.control_btns = ko.observableArray([
			new ControlBtn("spotify", self.spotifyAction.bind(self)),
			(self.fave? new ControlBtn("fave") : new ControlBtn("delete"))
		]);



	}

	return { viewModel: BtnPanelViewModel, template: btnPanelTemplate };
});
