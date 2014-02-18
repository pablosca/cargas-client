angular.module('CarGas.User')
.controller('User.Account.Cars', [
    '$scope',
    '$location',
    '$filter',
    'user',
    'fuels',
    'Car',
    function ($scope, $location, $filter, user, fuels, Car) {

        $scope.$parent.menuSelected = 'Account';
        $scope.$parent.title = 'Mi Cuenta';

        $scope.user = user;
        $scope.car = new Car();
        $scope.fuels = fuels;

        $scope.defaultFuels = function (fuel) {
            return !fuel.user;
        },

        $scope.myFuels = function (fuel) {
            return fuel.user === $scope.user._id;
        };

        $scope.add = function () {
            $scope.error = '';
            $scope.fuel.user = user._id;
            $scope.fuel.$save(function (fuel) {
                if (fuel._id) {
                    $scope.fuels.push($scope.fuel);
                    $scope.fuel = new Fuel();
                } else {
                    $scope.error = 'Vehiculo no creado. Algo anduvo mal';
                }
            });
        };

        $scope.delete = function (id) {
            var fuel = Fuel.get({ id: id }, function () {
                fuel.$remove();
                $scope.fuels = $filter('filter')($scope.fuels, function (fuel) {
                    return fuel._id !== id;
                });
            });
        };
    }
]);