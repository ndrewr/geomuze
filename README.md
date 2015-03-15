Udacity Nanodegree Project 5: The Neighborhood Map
***************************************************************************
Tech: This project uses Knockout.js to provide app structure, jQuery for DOM manipulation,
Bootstrap for basic styles and Google Maps JS api for content manipulation

Spec:
Review our course JavaScript Design Patterns.
Download the Knockout framework.
Write code required to add a full-screen map to your page using the Google Maps API.
Write code required to add map markers identifying a number of locations your are interested in within this neighborhood.
Implement the search bar functionality to search your map markers.
Implement a list view of the identified locations.
Add additional functionality using third-party APIs when a map marker, search result, or list view entry is clicked (ex. Yelp reviews, Wikipedia, StreetView/Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our Intro to AJAX course.

Build: Gulp.js or NPM build scripts with Browserify?

****************************************************************************
NOTES:
- Google Maps can easily create Markers, Info Boxes, Pan actions
- Add event listeners to the map object:
	- Double click to center
	- Click and hold for 2 secs to drop pin
	- Select location from modal window to pan to location
- Remember to attribute any photos used...can use KO to bind to a small span, auto updating when neccessary
- Google Places API search box is a possibility

IDEAS:
- What about a search game? like carmen san diego? Where user gets hints or riddles
and must zoom into correct part of map or type correct location into search bar
- Ben mentioned using a flight track api to chart all the planes in an area...
I could use the api to query the planes approaching a certain neighborhood, maybe just take
10 or 20 results and drop them as Marker with a custom plane png...can also calc their direction
of travel and adjust the marker image accordingly
- On that note, what about earthquake apis? Or searching wikipedia, gawd forbid, for historical
data on an area
- Singing in the shower...what about user types a destination, app fires off a search for songs with that
destination in the title/lyrics? can present a youtube video link in modal, or a jukebox or something...
maybe save last several searches (persist on server) in the jukebox...
- If I keep the routing structure I can set up the about page as instructions or a history of past searches


*****************************************************************************
Steps:
- Get a map on the screen
- Set up Data Model and View Model JS structure
- Get a modal list on screen with data-bound LI elements
- Bind Map Marker items to Data model objects...lets call them SongMatch objects?

Log of Resources:
- https://miguelmota.com/blog/basic-html5-audio-manipulation/
- transparenttextures
- knockmeout.com
- https://github.com/rniemeyer/knockout-postbox
- Stack Overflow, esp.
	- http://stackoverflow.com/questions/2362337/how-to-set-the-google-map-zoom-level-to-show-all-the-markers
	- http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
	- http://stackoverflow.com/questions/15625945/delay-marker-drop-api-v3
	- http://stackoverflow.com/questions/17240544/jquery-toggle-animated-width
	- http://stackoverflow.com/questions/14248194/close-responsive-navbar-automatically
	-
- Google Maps API docs
-


