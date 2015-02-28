define(["knockout", "text!./home.html", "knockout-postbox"], function(ko, homeTemplate) {

	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!').subscribeTo('home_msg');
		self.search_terms = ko.observable();
		var results_buffer = []; // hold results for one push into observable array; better perf

		var test_list = [new Result("Can't Stop", "RHCP"), new Result("Flaws", "Bastille"), new Result("Rainbow Connection", "Willie Nelson"), new Result("Raindance Maggie", "RHCP"), new Result("Pompeii", "Bastille"), new Result("Star Wars Cantina", "Weird Al Yankovic"), new Result("Changes", "Tupac Shakur")];

		self.search_results = ko.observableArray(test_list).publishOn('new_results');


		self.goSearch = function() {
			// update map by calling google place search
//				mapView.doPlaceSearch(self.search_terms());
			console.log("Search terms are...%s", self.search_terms());
			self.message("Searching for..." + self.search_terms());

			app.doPlaceSearch(self.search_terms());

			// format search string for api query
			var formatted_terms = self.search_terms().replace( /\s|,/g ,"%20");
			results_buffer = []; // reset results buffer
			spotifySearch(formatted_terms);
			musixSearch(formatted_terms); // note currently only this call actually updates observable!
		};

		// look for songs on spotify
		function spotifySearch(formatted_terms) {
			var spotify_query = 'https://api.spotify.com/v1/search?q=' + formatted_terms + '&type=track&limit=10';

			$.getJSON(spotify_query, function(data) {
				var track_list = data.tracks.items; // an array
				console.log("Response from Spotify...");
				track_list.forEach(function(track) {
					var track_name = track.name;
					var track_artist = track.artists[0].name;
					if(!results_buffer.alreadyInArray(track_name, track_artist)) {
						results_buffer.push(new Result(track_name, track_artist));
					}
				});

				self.search_results(results_buffer);
			}).error(function(e) {
				console.log("Problem with spotify!!!");
				self.message("Aw man! Problem with Spotify!");
			});
		}

		// look for songs on musixmatch
		function musixSearch(formatted_terms) {
			var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=' + formatted_terms + '&f_has_lyrics=1&s_track_rating=ASC&f_lyrics_language=en&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c';

			$.getJSON(musix_query, function(data) {
				console.log("Response from Musixmatch...");
				var track_list = data.message.body.track_list;
				track_list.forEach(function(track) {
					var track_name = track.track.track_name;
					var track_artist = track.track.artist_name;
					results_buffer.push(new Result(track_name, track_artist));
				});

				// finally, upate the actual observable in one go
				// AFTER async call returns

				// should filter the array here for same results
				console.log("results buffer has %s items", results_buffer.length);

				console.log("Updating search results!!!");
				self.search_results(results_buffer);
			}).error(function(e) {
				console.log("Problem with Musixmatch!!!");
				self.message("Uh-oh! Problem with MusixMatch!");
			});
		}

	}

	return { viewModel: HomeViewModel, template: homeTemplate };
});
