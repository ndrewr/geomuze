/*
	Model Definitions, prototype extensions and helper func
	*/

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
	this.lyrics_url = result.lyrics_url || '#';
	this.album = result.album || 'No Album Title';
	this.location = location || {msg: 'oh noes nowhere'};
}

// helper function to check a song tracks array for doubles
Array.prototype.alreadyInArray = function(prop1, prop2) {
	var found = false;
	this.forEach(function(item) {
		if (item.track_name === prop1 && item.artist_name === prop2) {
			found = true;
		}
	});
	return found;
};

// test data and initial state data
var initial_result = new Result(
	"spotify",
	"Dragonfire",
	"Lost Legacy",
	"Gates Of Wrath",
	"https://i.scdn.co/image/ecd1070cbc572dd534becd67b49fba23bdf0b406",
	"https://p.scdn.co/mp3-preview/8c4e0e9f50663d1a2ac537027708324c48e4d548",
	"https://www.musixmatch.com/lyrics/Lost-Legacy/Dragonfire"
);

var test_data = [];
