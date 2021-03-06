angular.module('refuels')

.controller('Refuels', [
    '$scope',
    'Refuel',
    'Car',
    'refuels',
    'cars',
    'defaultCar',
    'totalSpent',
    'totalCapacity',
    function ($scope, Refuel, Car, refuels, cars, defaultCar, totalSpent, totalCapacity) {
        var carKeys = Object.keys(cars);

        $scope.cars = cars;

        $scope.filter = {
            car: ''
        };

        // not display All filter if there is only one car
        $scope.showFilterAll = carKeys.length === 1 ? false : true;

        // set filter as the default car (maybe this is not needed)
        $scope.filter.car = defaultCar._id ? defaultCar._id.toString() : '';

        $scope.$watch('filter.car', function (newFilter, oldFilter) {

            var car;

            if (newFilter) {
                $scope.refuels = _.sortBy(Refuel.getRefuelsByCarId(newFilter), 'date').reverse();
                car = Car.get({
                    _id: Number(newFilter)
                });
                $scope.totalSpent = car.getTotalSpent();
                $scope.totalCapacity = car.getTotalCapacity();
            } else {
                $scope.refuels = refuels;
                $scope.totalSpent = totalSpent;
                $scope.totalCapacity = totalCapacity;
            }
        });

        $scope.formatRefuelsForGraph = function (refuels) {
            var entries = _.map(refuels, function (refuel) {
                return {
                    time: refuel.date,
                    count: refuel.amount
                };
            });
            return {
                entries: entries
            };
        };
    }
]);
