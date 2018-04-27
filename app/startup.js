define(['jquery', 'knockout', './router', 'bootstrap', 'knockout-projections'], function($, ko, router) {
	// Components can be packaged as AMD modules, such as the following:
	ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
	ko.components.register('home-page', { require: 'components/home-page/home' });
	ko.components.register('result-list', { require: 'components/result-list/result-list' });
	ko.components.register('fave-list', { require: 'components/fave-list/fave-list' });

	// ... or for template-only components, you can just point to a .html file directly:
	ko.components.register('about-page', {
		template: { require: 'text!components/about-page/about.html' }
	});

	// Start the application
	ko.applyBindings({ route: router.currentRoute });
});
