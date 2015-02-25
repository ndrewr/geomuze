// defines actions for list control buttons
function ControlBtn(title, handler) {
	this.btn_title = title || 'btn';
	if (title === "spotify") {
		this.handler = function() {
			//spotifyRequest;
			console.log("This button action performs a spotify request.");

		};

	}
	else if (title === "youtube") {
		this.handler = function() {
			//youtubeRequest;
			console.log("This button action performs a youtube request.");

		};
	}
	else if (title === "fave") {
		this.handler = function() {
			//move track to favorite list
			console.log("This button action favorites the selected track.");

		}
	}
	else {
		this.handler = handler || function() {
			console.log("This button action not defined yet.")};
	}
}


// Data model for music track search results
function Result(track, artist, url) {
	this.url = url || '';
	this.artist_name = artist || '';
	this.track_name = track || '';
}
