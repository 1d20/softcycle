src = __dirname
dest = __dirname + '/../static/frontend'
bower = src + '/bower_components'

module.exports = 
	sass:
		src: [src + '/sass/**/*.sass']
		dest: dest + '/css'
	images:
		src: [src + '/images/**/*.png']
		dest: dest + '/images'
	sounds:
		src: [src + '/sounds/**/*.*']
		dest: dest + '/sounds'
	vendors:
		css:
			src: [
				bower + '/bootstrap/dist/css/bootstrap.min.css'
				bower + '/font-awesome/css/font-awesome.min.css'
				bower + '/animate.css/animate.min.css'
			]
			dest: dest + '/css'
		fonts:
			src: [
				bower + '/font-awesome/fonts/*'
			]
			dest: dest + '/fonts'
		js:
			src: [
				bower + '/jquery/dist/jquery.js'
				bower + '/bootstrap/dist/js/bootstrap.min.js'
				bower + '/angular/angular.js'
				bower + '/angular-route/angular-route.js'
				bower + '/phaser-official/build/phaser.js'
			]
			dest: dest + '/js'
	js:
		src: [
			src + '/js/**/*.js'
		]
		dest: dest + '/js'
	fonts:
		src: [
			src + '/fonts/**/*.*'
		]
		dest: dest + '/fonts'
	coffee:
		src: [
			src + '/coffee/soft.controllers.coffee'
			src + '/coffee/soft.directives.coffee'
			src + '/coffee/soft.filters.coffee'
			src + '/coffee/soft.services.coffee'
			src + '/coffee/filters/*.coffee'
			src + '/coffee/services/*.coffee'
			src + '/coffee/directives/*.coffee'
			src + '/coffee/controllers/*.coffee'
			src + '/coffee/soft.coffee'
		]
		dest: dest + '/js'
	compass:
		src: [src + '/sass/**/*.scss']
		dest: dest + '/css'
	templates:
		src: [src + '/templates/**/*.html']
		dest: dest + '/templates'
