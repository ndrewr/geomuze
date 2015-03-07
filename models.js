
//(function (factory) {
//
//	// an AMD module with this app's data models
//	define(['knockout', 'knockout-postbox'], factory);
//}(function (ko) {
//		console.log("this shit be invoked!");
		// defines actions for list control buttons
		function ControlBtn(title, handler) {
			this.btn_title = title || 'btn';
			this.handler = handler || (function() {
					console.log("This button action not defined yet.");
			});
		}

		// Data model for music track search results
		// First param indicates which service result is from
		function Result(service, track, artist, album, cover, url, lyrics) {
			this.url = url || 'No Url';
			this.artist_name = artist || 'No Name';
			this.track_name = track || 'No Title';
			this.cover = cover || 'No Cover';
			this.lyrics_url = lyrics || '#';
			this.service = service || 'unaffiliated';
			this.album = album || 'No Album Title';
		}

		// Data model for a Fave music track result
		function FaveTrack(result, location) {
			this.result = result || {msg: 'uh oh nuthin'};
			this.track_name = result.track_name;
			this.artist_name = result.artist_name;
			this.cover = result.cover || 'No Cover Available';
			this.url = result.url || '#';
			this.lyrics_url = result.lyrics || '#';
			this.album = result.album || 'No Album Title';
			this.location = location || {msg: 'oh noes nowhere'};
			this.marker = new google.maps.Marker({
				position: location,
				title: this.track_name,
				animation: google.maps.Animation.DROP
			});
		}

		// Data model for a Fave list that persists in LocalStorage
		function FaveList() {
			this.faves = ko.observableArray();
		}

Array.prototype.alreadyInArray = function(prop1, prop2) {
	var found = false;
	this.forEach(function(item) {
		if (item.track_name === prop1 && item.artist_name === prop2) {
			found = true;
		}
	});
	return found;
};

//}));
