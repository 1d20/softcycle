src = __dirname
dest = __dirname + '/../static/frontend'
bower = src + '/bower_components'

module.exports = 
	sass:
		src: [src + '/sass/**/*.sass']
		dest: dest + '/css'
	vendors:
		css:
			src: [
				bower + '/bootstrap/dist/css/bootstrap.min.css'
				bower + '/font-awesome/css/font-awesome.min.css'
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
				bower + '/angular/angular.js'
				bower + '/angular-route/angular-route.js'
			]
			dest: dest + '/js'
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
	json:
		src: [src + '/json/**/*.json']
		dest: dest + '/json'