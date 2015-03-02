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
    .when('/summary', {
        templateUrl : 'summary.html'
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


// create the controller and inject Angular's $scope
rainApp.controller('homeController', function($scope) {

    homeInit();

});



