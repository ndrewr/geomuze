define(["knockout", "text!./result-list.html"], function(ko, resultsTemplate) {

	var test_list = [new Result("Can't Stop", "RHCP"), new Result("Flaws", "Bastille"), new Result("Rainbow Connection", "Willie Nelson")];


	function Result(track, artist, url) {
		this.url = url? url : '';
		//	this.url = (url || '');
		this.artist_name = artist? artist : '';
		this.track_name = track? track : '';
	}


	function ListViewModel(route) {
		var self = this;
		self.tracks = ko.observableArray(test_list);

		// add entry to 'tracks' list by creating and
		// pushing a new 'Result' model object
		self.addTrack = function(track, artist, url) {
			tracks.push(new Result(track, artist, url));
		};

		// user selects a track to see more info,
		// open additional opens such as Play, etc
		// also control relevant styles and transitions
		self.selectTrack = function() {
			console.log("Track select fired!");

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
