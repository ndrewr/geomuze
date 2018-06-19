// looks for the following global when initializing
var require = {
  baseUrl: ".",
  paths: {
    "jquery":               "bower_components/jquery/dist/jquery",
    "bootstrap":            "bower_components/bootstrap/dist/js/bootstrap.min",
    "crossroads":           "bower_components/crossroads/dist/crossroads.min",
    "hasher":               "bower_components/hasher/dist/js/hasher.min",
    "knockout":             "bower_components/knockout/dist/knockout",
    "knockout-projections": "bower_components/knockout-projections/dist/knockout-projections.min",
    "signals":              "bower_components/js-signals/dist/signals.min",
    "text":                 "bower_components/text/text",
    // add custom libraries
    "knockout-postbox":     "app/knockout-postbox",
  },
  shim: {
    "bootstrap": { deps: ["jquery"] }
  }
};
