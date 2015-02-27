
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
		function Result(track, artist, url, location) {
			this.url = url || '';
			this.artist_name = artist || '';
			this.track_name = track || '';
			this.location = location || {};
		}

		// Data model for a Fave music track result
		function FaveTrack(result, location) {
			this.result = result || {msg: "uh oh nuthin"};
			this.track_name = result.track_name;
			this.artist_name = result.artist_name;
			this.location = location || {msg: "oh noes nowhere"};
		//	this.playcount = ko.observable(0);
		}

		// Data model for a Fave list that persists in LocalStorage
		function FaveList() {
			this.faves = ko.observableArray();
		}

//}));
