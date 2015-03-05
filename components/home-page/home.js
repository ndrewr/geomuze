define(["knockout", "text!./home.html", "knockout-postbox"], function(ko, homeTemplate) {

	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!').subscribeTo('home_msg');
		self.search_terms = ko.observable();

		var results_buffer = []; // hold results for one push into observable array; better perf

		var test_list = [new Result("Can't Stop", "RHCP"), new Result("Flaws", "Bastille"), new Result("Rainbow Connection", "Willie Nelson"), new Result("Raindance Maggie", "RHCP"), new Result("Pompeii", "Bastille"), new Result("Star Wars Cantina", "Weird Al Yankovic"), new Result("Changes", "Tupac Shakur")];

		self.search_results = ko.observableArray(test_list).publishOn('new_results');

		// update map by calling google place search
		self.goSearch = function() {
			self.message("Searching for..." + self.search_terms());

			// lets simplify the search terms shall we?
			var simple_terms = self.search_terms().split(/\s|,/g, 2).join(' ');
			console.log("Modified search terms are...%s", simple_terms);
			var loc = app.doPlaceSearch();
			console.log("New location is at...%O", loc);

			// format search string for api query
			var formatted_terms = self.search_terms().replace( /\s|,/g ,"%20");
			results_buffer = []; // reset results buffer
			spotifySearch(formatted_terms);
			musixSearch(formatted_terms); // note currently only this call actually updates observable!
		};

		// look for songs on spotify
		// NOTE I saw a number of repeat results so I
		// run the response through a filter
		function spotifySearch(formatted_terms) {
			var spotify_query = 'https://api.spotify.com/v1/search?q=' + formatted_terms + '&type=track&limit=10';

			$.getJSON(spotify_query, function(data) {
				var track_list = data.tracks.items; // an array
				console.log("Response from Spotify...");
				track_list.forEach(function(track) {
					var track_name = track.name;
					var track_artist = track.artists[0].name;
					var track_cover = track.album.images[2].url;
					var track_url = track.preview_url;

					// check to see if this result already exists
					if(!results_buffer.alreadyInArray(track_name, track_artist)) {
						// fetch a lyrics url from musixmatch
						// using the title and name from spotify result
						// NOTE: must be a nested async call
						var track_lyrics;
						var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_track=' + track_name + '&q_artist=' + track_artist + '&f_has_lyrics=1&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c';
						$.getJSON(musix_query, function(data) {
							var fetch_result = data.message.body.track_list;
							if (fetch_result.length > 0) {
								var track = fetch_result.track_list[0];
								track_lyrics = track.track.track_share_url;
							}
							// finally we can push the results
							self.search_results.push(new Result(track_name, track_artist, track_cover, track_url, track_lyrics));
						}).error(function(e) {
							self.message("Uh-oh! Problem with MusixMatch track fetch!");
						});
					}
				});
			}).error(function(e) {
				self.message("Aw man! Problem with Spotify!");
			});
		}

		// look for songs on musixmatch
		// NOTE I did not see repeat results from musix queries
		// so I did not run response through a filter
		function musixSearch(formatted_terms) {
			var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=' + formatted_terms + '&f_has_lyrics=1&s_track_rating=ASC&f_lyrics_language=en&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c';

			$.getJSON(musix_query, function(data) {
				console.log("Response from Musixmatch...");
				var track_list = data.message.body.track_list;
				track_list.forEach(function(track) {
					var track_name = track.track.track_name;
					var track_artist = track.track.artist_name;
					var track_lyrics = track.track.track_share_url;
					var track_cover = track.track.album_coverart_100x100;

					// push to the results buffer to minimize updates
					// on observable, reduce page redraws
					results_buffer.push(new Result(track_name, track_artist, track_cover, undefined, track_lyrics));
				});
				// finally, upate the actual observable in one go
				// AFTER async call returns
				self.search_results(results_buffer);
			}).error(function(e) {
				self.message("Uh-oh! Problem with MusixMatch!");
			});
		}
	}

	return { viewModel: HomeViewModel, template: homeTemplate };
});
