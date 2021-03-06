httpHeadersConfig = ($httpProvider) ->
    $httpProvider.defaults.transformRequest = (data) ->
        if data == undefined then data else $.param data

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'

routerConfig = ($routeProvider) -> 
    base = '/static/frontend/templates/'

    $routeProvider
        .when '/',
            templateUrl: base + 'home/index.html'
            controller: 'HomeController'
            controllerAs: 'home'
            resolve: 
                logged: ($http)-> 
                    $http.get '/api/profile/'
                        .then(
                            (response) -> response
                            (reason) -> 
                                # if reason.status == 401 then location.href = '/login/google-oauth2/'
                        )

        .when '/stage/:id',
            templateUrl: base + 'stages/stage.html'
            controller: 'StageController'
            controllerAs: 'stage'
            resolve:
                stage: ['Stage', '$route', '$location', (Stage, $route, $location) ->
                    Stage.getStage $route.current.params.id 
                        .then(
                            (response) -> response
                            (reason) -> if reason.status == 401 then $location.path '/'
                        )
                ]
                stats: ['Stage', '$route', '$location', (Stage, $route, $location) ->
                    Stage.getStats $route.current.params.id
                        .then(
                            (response) -> response
                            (reason) -> if reason.status == 401 then $location.path '/'
                        )
                ]
        .otherwise
            redirectTo: '/'

customInterpolation = ($interpolateProvider) ->
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');

angular.module 'soft', [
    'ngRoute'
    'ui.bootstrap'
    'soft.controllers'
    'soft.directives' 
    'soft.filters'
    'soft.services'
]
    .config ['$interpolateProvider', customInterpolation]
    .config ['$routeProvider', routerConfig]
    .config ['$httpProvider', httpHeadersConfig]