define(["knockout", "text!./result-list.html", "knockout-postbox"], function(ko, resultsTemplate) {
	function ListViewModel() {
		var self = this;
		self.tracks = ko.observableArray(	).subscribeTo('new_results');
		self.latest_fave = ko.observable({}).publishOn('fave_alert');

		// user selects a track to see more info,
		// open additional options such as Play, etc
		// also control relevant styles and transitions
		// Note: called from view using bind(), this = data_obj
		self.selectResult = function(index) {
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

		// allows user to mark a track as "favorite", therby
		// adding to a second array list
		self.setFave = function(index) {
			console.log("Track # %s wants to be favorited!", index);
			self.latest_fave(self.tracks()[index]);
		};

		self.doAction = function() {
			console.log("I have fired")
		};

		// delegate click handling to the parent list
		$('#result-list').on('click', 'li', self.selectResult);
	}
	return { viewModel: ListViewModel, template: resultsTemplate };
});
