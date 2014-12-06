gulp = require 'gulp'
concat = require 'gulp-concat'
coffee = require 'gulp-coffee'
compass = require 'gulp-compass'
install = require 'gulp-install'

config = require './frontend/config'

gulp.task 'bower', ->
	gulp.src ['./frontend/bower.json']
  		.pipe install()

gulp.task 'vendors:css', ->
    gulp.src config.vendors.css.src
        .pipe concat 'vendors.css'
        .pipe gulp.dest config.vendors.css.dest

gulp.task 'vendors:fonts', ->
	gulp.src config.vendors.fonts.src
		.pipe gulp.dest config.vendors.fonts.dest

gulp.task 'vendors:js', ->
	gulp.src config.vendors.js.src
		.pipe concat('vendors.js')
		.pipe gulp.dest config.vendors.js.dest

gulp.task 'vendors', ['vendors:css', 'vendors:fonts', 'vendors:js']

gulp.task 'coffee', ->
	gulp.src config.coffee.src
		.pipe coffee()
		.pipe concat('scripts.js')
		.pipe gulp.dest config.coffee.dest

gulp.task 'compass', ->
	gulp.src config.compass.src
		.pipe compass project: __dirname + '/frontend', css: 'css', sass: 'sass', image: 'images'
	    .on 'error', (error) ->
	      this.emit 'end'

	    .pipe concat('styles.css')
	    .pipe gulp.dest config.compass.dest

gulp.task 'watch', ->
    gulp.watch config.vendors.js.src, ['vendors:js']
    gulp.watch config.vendors.css.src, ['vendors:css']
    gulp.watch config.vendors.fonts.src, ['vendors:fonts']
    gulp.watch config.coffee.src, ['coffee']

gulp.task 'dev', [
	'vendors',
	'coffee',
	'watch'
]

gulp.task 'default', [
	'vendors',
	'coffee'
]
