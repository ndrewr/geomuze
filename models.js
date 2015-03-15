
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
			this.lyrics_url = result.lyrics_url || '#';
			this.album = result.album || 'No Album Title';
			this.location = location || {msg: 'oh noes nowhere'};
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

// test data
var initial_result = new Result(
	"spotify",
	"Dragonfire",
	"Lost Legacy",
	"Gates Of Wrath",
	"https://i.scdn.co/image/ecd1070cbc572dd534becd67b49fba23bdf0b406",
	"https://p.scdn.co/mp3-preview/8c4e0e9f50663d1a2ac537027708324c48e4d548",
	"https://www.musixmatch.com/lyrics/Lost-Legacy/Dragonfire"
);


var test_data = [
	{
		"result": {
			"url": "https://p.scdn.co/mp3-preview/da3f48f7e00376595541f29f23d2395d656661dd",
			"artist_name": "John Mayer",
			"track_name": "Free Fallin' - Live at the Nokia Theatre",
			"cover": "https://i.scdn.co/image/8b8739e220eada910ffdf8b802771a9b3a130d8a",
			"lyrics_url": "https://www.musixmatch.com/lyrics/John-Mayer/Free-Fallin-Live-At-the-Nokia-Theatre",
			"service": "spotify",
			"album": "Where The Light Is: John Mayer Live In Los Angeles"
		},
		"track_name": "Free Fallin' - Live at the Nokia Theatre",
		"artist_name": "John Mayer",
		"cover": "https://i.scdn.co/image/8b8739e220eada910ffdf8b802771a9b3a130d8a",
		"url": "https://p.scdn.co/mp3-preview/da3f48f7e00376595541f29f23d2395d656661dd",
		"lyrics_url": "https://www.musixmatch.com/lyrics/John-Mayer/Free-Fallin-Live-At-the-Nokia-Theatre",
		"album": "Where The Light Is: John Mayer Live In Los Angeles",
		"location": {
			"k": 34.0522342,
			"D": -118.2436849
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 34.0522342,
				"D": -118.2436849
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Free Fallin' - Live at the Nokia Theatre",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://www.musixmatch.com/lyrics/Funkst%C3%B6rung-feat-Rob-Sonic/Mr-Important",
			"artist_name": "Funkstörung feat. Rob Sonic",
			"track_name": "Mr Important",
			"cover": "No Cover",
			"lyrics_url": "#",
			"service": "musix",
			"album": "http://s.mxmcdn.net/images-storage/albums/6/0/0/4/1/7/11714006.jpg"
		},
		"track_name": "Mr Important",
		"artist_name": "Funkstörung feat. Rob Sonic",
		"cover": "No Cover",
		"url": "https://www.musixmatch.com/lyrics/Funkst%C3%B6rung-feat-Rob-Sonic/Mr-Important",
		"lyrics_url": "#",
		"album": "http://s.mxmcdn.net/images-storage/albums/6/0/0/4/1/7/11714006.jpg",
		"location": {
			"k": 52.9399159,
			"D": -73.5491361
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 52.9399159,
				"D": -73.5491361
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Mr Important",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://p.scdn.co/mp3-preview/a05426bda4dc83e0915d9c2ce0852fd207423e8c",
			"artist_name": "Leonard Cohen",
			"track_name": "Samson in New Orleans",
			"cover": "https://i.scdn.co/image/57860e844caab1877380069ab3fded6dc54d0e25",
			"lyrics_url": "https://www.musixmatch.com/lyrics/Leonard-Cohen/Samson-in-New-Orleans",
			"service": "spotify",
			"album": "Popular Problems"
		},
		"track_name": "Samson in New Orleans",
		"artist_name": "Leonard Cohen",
		"cover": "https://i.scdn.co/image/57860e844caab1877380069ab3fded6dc54d0e25",
		"url": "https://p.scdn.co/mp3-preview/a05426bda4dc83e0915d9c2ce0852fd207423e8c",
		"lyrics_url": "https://www.musixmatch.com/lyrics/Leonard-Cohen/Samson-in-New-Orleans",
		"album": "Popular Problems",
		"location": {
			"k": 29.95106579999999,
			"D": -90.0715323
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 29.95106579999999,
				"D": -90.0715323
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Samson in New Orleans",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://www.musixmatch.com/lyrics/Grateful-Dead/Dancing-in-the-Steet",
			"artist_name": "Grateful Dead",
			"track_name": "Dancing in the Steet",
			"cover": "No Cover",
			"lyrics_url": "#",
			"service": "musix",
			"album": "http://s.mxmcdn.net/images/albums/nocover.png"
		},
		"track_name": "Dancing in the Steet",
		"artist_name": "Grateful Dead",
		"cover": "No Cover",
		"url": "https://www.musixmatch.com/lyrics/Grateful-Dead/Dancing-in-the-Steet",
		"lyrics_url": "#",
		"album": "http://s.mxmcdn.net/images/albums/nocover.png",
		"location": {
			"k": 41.8781136,
			"D": -87.62979819999998
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 41.8781136,
				"D": -87.62979819999998
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Dancing in the Steet",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://www.musixmatch.com/lyrics/The-Doors/The-Celebration-of-the-Lizard-Live-At-the-Aquarius-1st-Show",
			"artist_name": "The Doors",
			"track_name": "The Celebration of the Lizard (Live At the Aquarius) [1st Show]",
			"cover": "No Cover",
			"lyrics_url": "#",
			"service": "musix",
			"album": "http://s.mxmcdn.net/images-storage/albums/3/7/2/1/5/9/26951273.jpg"
		},
		"track_name": "The Celebration of the Lizard (Live At the Aquarius) [1st Show]",
		"artist_name": "The Doors",
		"cover": "No Cover",
		"url": "https://www.musixmatch.com/lyrics/The-Doors/The-Celebration-of-the-Lizard-Live-At-the-Aquarius-1st-Show",
		"lyrics_url": "#",
		"album": "http://s.mxmcdn.net/images-storage/albums/3/7/2/1/5/9/26951273.jpg",
		"location": {
			"k": 42.1014831,
			"D": -72.589811
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 42.1014831,
				"D": -72.589811
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "The Celebration of the Lizard (Live At the Aquarius) [1st Show]",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://p.scdn.co/mp3-preview/2889cc5c8017a4320ade26b500247309aefedb9e",
			"artist_name": "Rancid",
			"track_name": "Olympia WA",
			"cover": "https://i.scdn.co/image/8a3f631f34c5da0af47699466d98918236b9065c",
			"lyrics_url": "https://www.musixmatch.com/lyrics/Rancid/Olympia-WA",
			"service": "spotify",
			"album": "...And Out Come The Wolves"
		},
		"track_name": "Olympia WA",
		"artist_name": "Rancid",
		"cover": "https://i.scdn.co/image/8a3f631f34c5da0af47699466d98918236b9065c",
		"url": "https://p.scdn.co/mp3-preview/2889cc5c8017a4320ade26b500247309aefedb9e",
		"lyrics_url": "https://www.musixmatch.com/lyrics/Rancid/Olympia-WA",
		"album": "...And Out Come The Wolves",
		"location": {
			"k": 47.0378741,
			"D": -122.90069510000001
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 47.0378741,
				"D": -122.90069510000001
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Olympia WA",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	},
	{
		"result": {
			"url": "https://www.musixmatch.com/lyrics/Infinite-Tales/Syberia",
			"artist_name": "Infinite Tales",
			"track_name": "Syberia",
			"cover": "No Cover",
			"lyrics_url": "#",
			"service": "musix",
			"album": "http://s.mxmcdn.net/images/albums/nocover.png"
		},
		"track_name": "Syberia",
		"artist_name": "Infinite Tales",
		"cover": "No Cover",
		"url": "https://www.musixmatch.com/lyrics/Infinite-Tales/Syberia",
		"lyrics_url": "#",
		"album": "http://s.mxmcdn.net/images/albums/nocover.png",
		"location": {
			"k": 40.14981239999999,
			"D": -77.1283133
		},
		"marker": {
			"__gm": {
				"set": null
			},
			"gm_accessors_": {
				"position": null,
				"title": null,
				"animation": null,
				"icon": null,
				"clickable": null,
				"visible": null
			},
			"position": {
				"k": 40.14981239999999,
				"D": -77.1283133
			},
			"gm_bindings_": {
				"position": {},
				"title": {},
				"animation": {},
				"icon": {},
				"clickable": {},
				"visible": {}
			},
			"title": "Syberia",
			"animation": 2,
			"icon": "images/geomuze-icon-small.png",
			"clickable": true,
			"visible": true
		}
	}
]
//}));
