
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

		// OK so default btns are spotify and then either fave (result list) or delete (fave list)
		// Youtube btn can be pushed later...BETTER WAY???
		self.control_btns = ko.observableArray([new 	ControlBtn("spotify"), (self.fave? new ControlBtn("fave") : new ControlBtn("delete"))]);

		self.handleMediaRequest = function() {

		};

	}

	return { viewModel: BtnPanelViewModel, template: btnPanelTemplate };
});
