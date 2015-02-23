// model object representing one song track
// Includes track name, artist name and a url where
// more track information can be found and/or listened to
function Result(track, artist, url) {
	this.url = url? url : '';
//	this.url = (url || '');
	this.artist_name = artist? artist : '';
	this.track_name = track? track : '';
}
