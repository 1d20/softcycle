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

gulp.task 'js', ->
    gulp.src config.js.src
        .pipe concat 'games.js'
        .pipe gulp.dest config.js.dest

gulp.task 'fonts', ->
    gulp.src config.fonts.src
        .pipe gulp.dest config.fonts.dest

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

gulp.task 'templates', ->
    gulp.src config.templates.src
        .pipe gulp.dest config.templates.dest

gulp.task 'images', ->
    gulp.src config.images.src
        .pipe gulp.dest config.images.dest

gulp.task 'sounds', ->
    gulp.src config.sounds.src
        .pipe gulp.dest config.sounds.dest

gulp.task 'watch', ->
    gulp.watch config.vendors.js.src, ['vendors:js']
    gulp.watch config.vendors.css.src, ['vendors:css']
    gulp.watch config.vendors.fonts.src, ['vendors:fonts']
    gulp.watch config.js.src, ['js']
    gulp.watch config.fonts.src, ['fonts']
    gulp.watch config.coffee.src, ['coffee']
    gulp.watch config.compass.src, ['compass']
    gulp.watch config.templates.src, ['templates']
    gulp.watch config.images.src, ['images']

gulp.task 'dev', [
    'vendors'
    'js'
    'fonts'
    'coffee'
    'compass'
    'templates'
    'images'
    'sounds'
    'watch'
]

gulp.task 'default', [
    'vendors'
    'js'
    'fonts'
    'coffee'
    'compass'
    'templates'
    'images'
    'sounds'
]
