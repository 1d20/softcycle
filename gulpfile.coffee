gulp = require 'gulp'
concat = require 'gulp-concat'
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

gulp.task 'dev', []

gulp.task 'default', []
