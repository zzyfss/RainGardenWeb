// create the controller and inject Angular's $scope
function homeController($scope) {

  /* Initialize elements in home */
  homeInit();

};

function dataController($scope) {

  dataInit();
};

// Control active state of navbar
function navbarController($scope, $location)
{
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
};





