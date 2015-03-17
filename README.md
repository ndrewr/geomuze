Udacity Nanodegree Project 5: The Neighborhood Map/ Geomuze
***************************************************************************
Description:
Geomuze connects place names with song track titles, artists and even song lyrics. Many results will have links to lyrics provided by the MusixMatch service and some will have song samples via Spotify. Songs you like can be saved to a separate list.

Instructions:
Enter a city or place name into the search bar and hit 'DO IT'.
The map is sent to that place (or wherever Google decides) and a pin is dropped representing the first match.
The results can be clicked to expand with more options:
- FAVE puts the song track in your FAVES list
- CHECK auto opens the map InfoBox with more track details
- LYRICS if available, opens a new tab with lyrics

The Favorites list is contructed from search results and allows several new options:
- LOCATE lets you revisit previous matches
- UNFAVE removes the track from the Faves list
Finally, there is a special option SCATTER which simultaneously displays all geo-pts associated with each song track.

Fave Track lists can be saved and reloaded next time you visit geomuze.

Both lists can be filtered by tracks that have samples, lyrics, or both.


***************************************************************************
Tech:
This project primarily uses Knockout.js to provide app structure, jQuery for DOM manipulation,
Bootstrap for basic styles and Google Maps JS api for content manipulation.
Song track search is provided by both Spotify and Musixmatch.
Gulp.js is used for build process.


****************************************************************************
Log of Resources:
- http://www.scottandrew.com/pub/html5audioplayer
- https://miguelmota.com/blog/basic-html5-audio-manipulation/
- http://snipplr.com/view/54863/wait-for-jquery-to-load/
- transparenttextures
- icomoon
- knockoutjs.com docs
- knockmeout.com
- https://github.com/rniemeyer/knockout-postbox
- Stack Overflow, esp.
	- http://stackoverflow.com/questions/2362337/how-to-set-the-google-map-zoom-level-to-show-all-the-markers
	- http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	- http://stackoverflow.com/questions/15625945/delay-marker-drop-api-v3
	- http://stackoverflow.com/questions/17240544/jquery-toggle-animated-width
	- http://stackoverflow.com/questions/14248194/close-responsive-navbar-automatically
- Google Maps API docs
- CSS-Tricks
	- https://css-tricks.com/adding-stroke-to-web-text
