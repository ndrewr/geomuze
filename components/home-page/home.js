define(["knockout", "text!./home.html", "knockout-postbox"], function(ko, homeTemplate) {
	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!').subscribeTo('home_msg');
		self.search_terms = ko.observable();
		self.display_terms = ko.observable().publishOn('search_terms');

		// uses postbox lib to sync results with List View
		self.search_results = ko.observableArray().publishOn('new_results');
		
		// kicks off all search activity:
		// phase 1 google map location update
		// phase 2 music track search thru lyrix api
		self.goSearch = function() {
			var query = self.search_terms();

			if (! query) {
				return
			}

			self.message("Searching for..." + query);
			app.infopane.close();

			// lets simplify the search terms shall we?
			var simple_terms = query.split(/\s|,/g, 5).join(' ');
			// alert result list of search terms
			self.display_terms(simple_terms);
			// update map by calling google place search
			app.doPlaceSearch(simple_terms);
			// lyrix server aggregates spotify and musixmatch search results
			lyrixSearch(simple_terms)

			// auto-switch list view to Results
			var tab = $('#list-container').find('a').first();
			tab.trigger('click');
			app.showList(); // toggles visibility
			self.search_terms(''); // reset search box
		};

		function checkRepeats (filter_list, track) {
			if(!filter_list.alreadyInArray(track.track_name, track.artist_name)) {
				filter_list.push(track);
			}
			return filter_list;
		}

		function createFilteredList(data) {
			return data.spotify.reduce(
				checkRepeats,
				data.musixMatch.reduce(checkRepeats, [])
			);
		}
	
		function lyrixSearch(query) {
			$.get('https://lyrix-api-v1.now.sh/?q=' + query)
			.then(function(data) {
				self.search_results(createFilteredList(data));
				// preconfig the map infobox with top result
				var top_hit = self.search_results()[0];
				if(top_hit) {
					app.configInfopane(top_hit);
				}

				self.message("Track search completed!");
			})
			.catch(function(error) {
				self.message("Uh-oh! Problem fetching tracks...");		
				app.informUser("Search error..try again?");								
			});
		};
	// end of HomeViewModel definition
	}
	return { viewModel: HomeViewModel, template: homeTemplate };
});
