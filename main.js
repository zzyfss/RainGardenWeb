/* Load angular rounte to help navigate pages
*/
var rainApp = angular.module('rain-app', ['ngRoute']);

// configure our routes
rainApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl : 'home.html',
        controller  : 'homeController'
    })
    .when('/data', {
        templateUrl : 'data.html',
        controller : 'dataController'

    })
    // route for the about page
    .when('/about', {
        templateUrl : 'about.html',
      controller : 'navbarController'

    })
    // route for the contact page
    .when('/contact', {
        templateUrl : 'contact.html',
        controller : 'navbarController'
    })
});


/** Set up controllers **/
homeController.$inject = ["$scope"];
dataController.$inject = ["$scope"];
navbarController.$inject = ["$scope", "$location"];
rainApp.controller('homeController', homeController);
rainApp.controller('dataController', dataController);
rainApp.controller('navbarController', navbarController);

/** Load google visualization module **/
google.load('visualization', '1');

// Set navbar-toggle close after clicking menu items
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
        $(this).collapse('hide');
    }
});


