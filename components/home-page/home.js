define(["knockout", "text!./home.html", "knockout-postbox"], function(ko, homeTemplate) {
	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!').subscribeTo('home_msg');
		self.search_terms = ko.observable();

		var results_buffer = []; // hold results for one push into observable array; better perf
		var filter_list = []; // used to check for same results

		// uses postbox lib to sync results with List View
		self.search_results = ko.observableArray().publishOn('new_results');

		// kicks off all search activity:
		// phase 1 google map location update
		// phase 2 music track search thru spotify/musixmatch
		self.goSearch = function() {
			self.message("Searching for..." + self.search_terms());

			// lets simplify the search terms shall we?
			var simple_terms = self.search_terms().split(/\s|,/g, 2).join(' ');
			// update map by calling google place search
			app.doPlaceSearch(simple_terms);

			// format search string then run api query
			var formatted_terms = self.search_terms().replace( /\s|,/g ,"%20");
			spotifySearch(formatted_terms);

			// auto-switch list view to Results
			var tab = $('#list-container').find('a').first();
			tab.trigger('click');
			app.showList(); // toggles visibility
			self.search_terms(''); // reset search box
		};

		// look for songs on spotify
		// NOTE I saw a number of repeat results so I
		// run the response through a filter
		function spotifySearch(formatted_terms) {
			results_buffer = [];
			filter_list = []; // reset buffers
			var spotify_query = 'https://api.spotify.com/v1/search?q=' + formatted_terms + '&type=track&limit=10';

			$.getJSON(spotify_query, function(data) {
				var track_list = data.tracks.items; // an array
				track_list.forEach(function(track) {
					var track_name = track.name;
					var track_artist = track.artists[0].name;
					var track_cover = track.album.images[2]? track.album.images[2].url : undefined;
					var track_url = track.preview_url;
					var track_album = track.album.name;

					// check to see if this result already exists
					if(!filter_list.alreadyInArray(track_name, track_artist)) {
						// here I use filter_list as a temp holder
						// for same-track check...cuz the real array is
						// updated async!
						filter_list.push(new Result("spotify", track_name, track_artist));

						// fetch a lyrics url from musixmatch
						// using the title and name from spotify result
						// NOTE: must be a nested async call
						var track_lyrics;
						var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_track=' + track_name + '&q_artist=' + track_artist + '&format=JSONP' + '&f_has_lyrics=1&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c';
						$.getJSON(musix_query+'&callback=?', function(data) {
							var fetch_result = data.message.body.track_list;
							// check response for track
							if (fetch_result.length > 0) {
								var track = fetch_result[0];
								track_lyrics = track.track.track_share_url;
							}
						})
						.always(function() {
							// push the results; track_url default undef
							results_buffer.push(new Result("spotify", track_name, track_artist, track_album, track_cover, track_url, track_lyrics));
						})
						.fail(function(e) {
							// on fail, alert home msg and push
							// result object w/o lyrics url
							self.message("Uh-oh! Problem fetching MusixMatch track...");
						});
					}
				});
			})
				.always(function() {
					// success or no, trigger a musixmatch search
					musixSearch(formatted_terms);
				})
				.fail(function(e) {
					// update home msg with status
					self.message("Aw man! Problem with Spotify!");
				});
		}

		// look for songs on musixmatch
		// NOTE I did not see repeat results from musix queries
		// so I did not run response through a filter
		function musixSearch(formatted_terms) {
			var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=' + formatted_terms + '&f_has_lyrics=1&s_track_rating=ASC&f_lyrics_language=en&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c&format=JSONP';

			$.getJSON(musix_query+'&callback=?', function(data) {
				var track_list = data.message.body.track_list;
				track_list.forEach(function(track) {
					var track_name = track.track.track_name;
					var track_artist = track.track.artist_name;
					var track_lyrics = track.track.track_share_url;
					var track_cover = track.track.album_coverart_100x100;
					var track_album = track.track.album_name;

					// NOTE I currently don't query for spotify url
					// and stick undefined as placeholder
					results_buffer.push(new Result("musix", track_name, track_artist, track_album, track_cover, undefined, track_lyrics));
				});
			})
				.always(function() {
					// finally, upate the actual observable in one go
					// Note this is called regardless of either
					// service failing to respond
					self.search_results(results_buffer);
					// preconfig the map infobox with top result
					var top_hit = self.search_results()[0];
					if(top_hit) app.configInfopane(top_hit);
			})
				.done(function() {
					self.message("Track search completed!");
			})
				.fail(function(e) {
					// if both services failed, insert a joke result
					// can also just check if results_buffer.length=0
					if (self.message() === "Aw man! Problem with Spotify!") {
						self.search_results.push(new Result("Oh No", "I'm Sorry", "Sad Pandas"));
					}
					self.message("Uh-oh! Problem with MusixMatch!");
			});
		}

	// end of HomeViewModel definition
	}
	return { viewModel: HomeViewModel, template: homeTemplate };
});
