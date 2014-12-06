gulp = require 'gulp'
install = require 'gulp-install'

gulp.task 'bower', ->
	gulp.src ['./frontend/bower.json']
  		.pipe install()

gulp.task 'dev', []

gulp.task 'default', []
