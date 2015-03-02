/* Load angular rounte to help navigate pages
*/
var rainApp = angular.module('rain-app', ['ngRoute']);

// configure our routes
rainApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl : 'exported-map.html',
        controller  : 'homeController'
    })
    .when('/add', {
        templateUrl : 'add.html',
        controller  : 'addController'
    })
    // route for the about page
    .when('/about', {
        templateUrl : 'about.html'

    })
    // route for the contact page
    .when('/contact', {
        templateUrl : 'contact.html'
    })
});


// Create a rain app model for saving state
rainApp.service("rainModel", ['$rootScope', function($rootScope) {


}]);

// create the controller and inject Angular's $scope
rainApp.controller('homeController', function($scope, rainModel) {

        mapInit();

});

rainApp.controller('addController', function($scope, rainModel) {
        // Initializee the add page
        addInit();
        $scope.rainModel = rainModel;
});


