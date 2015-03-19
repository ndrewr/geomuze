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
function FaveTrack(result, location, keyterms) {
	this.result = result || {msg: 'uh oh nuthin'};
	this.track_name = result.track_name;
	this.artist_name = result.artist_name;
	this.cover = result.cover || 'No Cover Available';
	this.url = result.url || '#';
	this.lyrics_url = result.lyrics_url || '#';
	this.album = result.album || 'No Album Title';
	this.location = location || {msg: 'oh noes nowhere'};
	this.keyterms = keyterms || 'Udacia';
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
	"Dragonfire - Udacity Theme",
	"Lost Legacy",
	"Gates Of Wrath",
	"https://i.scdn.co/image/ecd1070cbc572dd534becd67b49fba23bdf0b406",
	"https://p.scdn.co/mp3-preview/8c4e0e9f50663d1a2ac537027708324c48e4d548",
	"https://www.musixmatch.com/lyrics/Lost-Legacy/Dragonfire"
);

var test_data =
		'[{"result":{"url":"https://p.scdn.co/mp3-preview/a05426bda4dc83e0915d9c2ce0852fd207423e8c","artist_name":"Leonard Cohen","track_name":"Samson in New Orleans","cover":"https://i.scdn.co/image/57860e844caab1877380069ab3fded6dc54d0e25","lyrics_url":"https://www.musixmatch.com/lyrics/Leonard-Cohen/Samson-in-New-Orleans","service":"spotify","album":"Popular Problems"},"track_name":"Samson in New Orleans","artist_name":"Leonard Cohen","cover":"https://i.scdn.co/image/57860e844caab1877380069ab3fded6dc54d0e25","url":"https://p.scdn.co/mp3-preview/a05426bda4dc83e0915d9c2ce0852fd207423e8c","lyrics_url":"https://www.musixmatch.com/lyrics/Leonard-Cohen/Samson-in-New-Orleans","album":"Popular Problems","location":{"k":29.95106579999999,"D":-90.0715323},"keyterms":"New Orleans"},{"result":{"url":"https://p.scdn.co/mp3-preview/5aabe5b1639f12b3f5266e158d3df3bc0e462e37","artist_name":"Lana Del Rey","track_name":"Brooklyn Baby","cover":"https://i.scdn.co/image/be93c424f7aaca6737c9433c44b5d1bf8829b011","lyrics_url":"https://www.musixmatch.com/lyrics/Lana-Del-Rey/Brooklyn-Baby","service":"spotify","album":"Ultraviolence (Deluxe)"},"track_name":"Brooklyn Baby","artist_name":"Lana Del Rey","cover":"https://i.scdn.co/image/be93c424f7aaca6737c9433c44b5d1bf8829b011","url":"https://p.scdn.co/mp3-preview/5aabe5b1639f12b3f5266e158d3df3bc0e462e37","lyrics_url":"https://www.musixmatch.com/lyrics/Lana-Del-Rey/Brooklyn-Baby","album":"Ultraviolence (Deluxe)","location":{"k":40.6781784,"D":-73.9441579},"keyterms":"Brooklyn"},{"result":{"url":"https://p.scdn.co/mp3-preview/b2332f1e9272472cffdf223e118f88040bc6926d","artist_name":"John Mayer","track_name":"Stop This Train - Live at the Nokia Theatre","cover":"https://i.scdn.co/image/8b8739e220eada910ffdf8b802771a9b3a130d8a","lyrics_url":"#","service":"spotify","album":"Where The Light Is: John Mayer Live In Los Angeles"},"track_name":"Stop This Train - Live at the Nokia Theatre","artist_name":"John Mayer","cover":"https://i.scdn.co/image/8b8739e220eada910ffdf8b802771a9b3a130d8a","url":"https://p.scdn.co/mp3-preview/b2332f1e9272472cffdf223e118f88040bc6926d","lyrics_url":"#","album":"Where The Light Is: John Mayer Live In Los Angeles","location":{"k":34.0522342,"D":-118.2436849},"keyterms":"Los Angeles"},{"result":{"url":"No Url","artist_name":"Lost Legacy","track_name":"Dragonfire","cover":"http://s.mxmcdn.net/images-storage/albums/9/0/6/6/3/5/11536609.jpg","lyrics_url":"https://www.musixmatch.com/lyrics/Lost-Legacy/Dragonfire","service":"musix","album":"Gates of Wrath"},"track_name":"Dragonfire","artist_name":"Lost Legacy","cover":"http://s.mxmcdn.net/images-storage/albums/9/0/6/6/3/5/11536609.jpg","url":"No Url","lyrics_url":"https://www.musixmatch.com/lyrics/Lost-Legacy/Dragonfire","album":"Gates of Wrath","location":{"k":37.399864,"D":-122.10840000000002},"keyterms":"Udacity"},{"result":{"url":"https://p.scdn.co/mp3-preview/f5c5ecb266020286165d9241f31b6cdad6da20ed","artist_name":"Louis Armstrong & His Savoy Ballroom Five","track_name":"St. James Infirmary","cover":"https://i.scdn.co/image/c1ff837dccdf259206de5f3e19063fab98bc9b69","lyrics_url":"https://www.musixmatch.com/lyrics/Louis-Armstrong/St-James-Infirmary","service":"spotify","album":"Columbia Original Masters"},"track_name":"St. James Infirmary","artist_name":"Louis Armstrong & His Savoy Ballroom Five","cover":"https://i.scdn.co/image/c1ff837dccdf259206de5f3e19063fab98bc9b69","url":"https://p.scdn.co/mp3-preview/f5c5ecb266020286165d9241f31b6cdad6da20ed","lyrics_url":"https://www.musixmatch.com/lyrics/Louis-Armstrong/St-James-Infirmary","album":"Columbia Original Masters","location":{"k":38.6270025,"D":-90.1994042},"keyterms":"St. Louis"},{"result":{"url":"https://p.scdn.co/mp3-preview/ba68ca1b1dd0a697ae3698eb6b29b2692979dcaa","artist_name":"DJ Bobo","track_name":"Chihuahua - Radio Version","cover":"https://i.scdn.co/image/17846dc8a745e7896ed82e5e137008d59de695d2","lyrics_url":"https://www.musixmatch.com/lyrics/DJ-Bobo/Chihuahua-radio-version","service":"spotify","album":"Chihuahua"},"track_name":"Chihuahua - Radio Version","artist_name":"DJ Bobo","cover":"https://i.scdn.co/image/17846dc8a745e7896ed82e5e137008d59de695d2","url":"https://p.scdn.co/mp3-preview/ba68ca1b1dd0a697ae3698eb6b29b2692979dcaa","lyrics_url":"https://www.musixmatch.com/lyrics/DJ-Bobo/Chihuahua-radio-version","album":"Chihuahua","location":{"k":28.6329957,"D":-106.06910040000002},"keyterms":"Chihuahua"},{"result":{"url":"https://p.scdn.co/mp3-preview/1e74a2b25ff4187b982c8b628589c3fe4262355f","artist_name":"The Smith Street Band","track_name":"Calgary Girls","cover":"https://i.scdn.co/image/a81784fb99f3654e8fc675bbebdc82fbda51fe30","lyrics_url":"https://www.musixmatch.com/lyrics/The-Smith-Street-Band/Calgary-Girls","service":"spotify","album":"Throw Me in the River"},"track_name":"Calgary Girls","artist_name":"The Smith Street Band","cover":"https://i.scdn.co/image/a81784fb99f3654e8fc675bbebdc82fbda51fe30","url":"https://p.scdn.co/mp3-preview/1e74a2b25ff4187b982c8b628589c3fe4262355f","lyrics_url":"https://www.musixmatch.com/lyrics/The-Smith-Street-Band/Calgary-Girls","album":"Throw Me in the River","location":{"k":51.0486151,"D":-114.0708459},"keyterms":"Calgary"}]';
