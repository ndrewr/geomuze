define(["knockout", "text!./home.html"], function(ko, homeTemplate) {
	function HomeViewModel(route) {
		var self = this;
		self.message = ko.observable('Lets get rockin!');
		self.search_terms = ko.observable();

		self.goSearch = function() {
			console.log('You invoked goSearch() on the viewmodel. The terms are...%s', self.search_terms());
			// construct a google maps query from search string
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
					console.log("top song is %s performed by %s", track_name, track_artist);
				})
			}).error(function(e) {
				console.log("Problem with spotify!!!");
			});

			// look for songs on musixmatch
			var musix_query = 'http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=' + formatted_terms + '&f_has_lyrics=1&s_track_rating=ASC&f_lyrics_language=en&apikey=0bc726067d82f809bd3d1f7b5f0f7c2c';

			$.getJSON(musix_query, function(data) {
				console.log("Response from Musixmatch...");
				var track_list = data.message.body.track_list;
				var track_name = track_list[0].track.track_name;
				var artist = track_list[0].track.artist_name;
				track_list.forEach(function(track) {
					track_name = track.track.track_name;
					artist = track.track.artist_name;
				 console.log("Musixmatch top hit is %s by %s", track_name, artist);
				});
			}).error(function(e) {
				console.log("Problem with Musixmatch!!!");
			});

		};
	}

	return { viewModel: HomeViewModel, template: homeTemplate };
});
