// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
		replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace'), autoprefixer = require('gulp-autoprefixer');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('app/require.config.js') + '; require;');
		requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
				out: 'scripts.js',
				baseUrl: './',
				name: 'app/startup',
				paths: {
						requireLib: 'bower_modules/requirejs/require'
				},
				include: [
						'requireLib',
						'components/nav-bar/nav-bar',
						'components/home-page/home',
						'components/result-list/result-list',
						'components/fave-list/fave-list',
						'text!components/about-page/about.html',
						'app/models.js',
						'app/app.js',
				],
				insertRequire: ['app/startup'],
				bundles: {
						// If you want parts of the site to load on demand, remove them from the 'include' list
						// above, and group them into bundles here.
						// 'bundle-name': [ 'some/module', 'another/module' ],
						// 'another-bundle-name': [ 'yet-another-module' ]
				}
		});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
		return rjs(requireJsOptimizerConfig)
				.pipe(uglify({ preserveComments: 'some' }))
				.pipe(gulp.dest('./dist/'));
//				.pipe(gulp.dest('./dist/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
		var bowerCss = gulp.src('bower_modules/components-bootstrap/css/bootstrap.min.css')
						.pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
				appCss = gulp.src('css/*.css')
							.pipe(autoprefixer({
									browsers: ['last 2 versions'],
									cascade: false
							})),
				combinedCss = es.concat(bowerCss, appCss ).pipe(concat('build.css')),
				fontFiles = gulp.src('./fonts/*', { base: './' });
		return es.concat(combinedCss, fontFiles)
				.pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
		return gulp.src('./html/index.html')
				.pipe(htmlreplace({
						'css': 'dist/build.css',
						'js': 'dist/scripts.js'
				}))
				.pipe(gulp.dest('./'));
});

// Removes all files from ./dist/
gulp.task('clean', function() {
		return gulp.src('./dist/**/*', { read: false })
				.pipe(clean());
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
		callback();
		console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
