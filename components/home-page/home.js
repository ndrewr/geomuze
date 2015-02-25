define(["knockout", "text!./home.html", "knockout-postbox"], function(ko, homeTemplate) {

//	function Result(track, artist, url) {
//		this.url = url || '';
//		this.artist_name = artist || '';
//		this.track_name = track || '';
//	}

	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!');
		self.search_terms = ko.observable();

		var test_list = [new Result("Can't Stop", "RHCP"), new Result("Flaws", "Bastille"), new Result("Rainbow Connection", "Willie Nelson")];

		self.search_results = ko.observableArray(test_list).publishOn('new_results');

		self.goSearch = function() {
			var results_buffer = []; // hold results for one push into observable array; better perf

			// update map by calling google place search
			if (mapView)
				mapView.doPlaceSearch(self.search_terms());

			// format search string for api query
			var formatted_terms = self.search_terms().replace( /\s|,/g ,"%20");

			// look for songs on spotify
			var spotify_query = 'https://api.spotify.com/v1/search?q=' + formatted_terms + '&type=track&limit=5';

			$.getJSON(spotify_query, function(data) {
				var track_list = data.tracks.items; // an array
				console.log("Response from Spotify...");
				track_list.forEach(function(track) {
					var track_name = track.name;
					var track_artist = track.artists[0].name;
					results_buffer.push(new Result(track_name, track_artist));
				})
			}).error(function(e) {
				console.log("Problem with spotify!!!");
			});

			// look for songs on musixmatch
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
				self.search_results(results_buffer);
			}).error(function(e) {
				console.log("Problem with Musixmatch!!!");
			});

		};
	}

	return { viewModel: HomeViewModel, template: homeTemplate };
});
