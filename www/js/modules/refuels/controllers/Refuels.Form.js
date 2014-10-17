angular.module('refuels')

.controller('Refuels.Form', [
    '$scope',
    '$ionicPopup',
    '$state',
    '$ionicModal',
    'Refuel',
    'Car',
    'Fuel',
    'refuel',
    'Utils',
    'carByDefault',
    function ($scope, $ionicPopup, $state, $ionicModal, Refuel, Car, Fuel, refuel,
            Utils, carByDefault) {

        var getCars = function () {
                var cars = Car.query();
                cars.push(new Car({
                    make: 'Add New Vehicle',
                    model: '',
                    value: 'newCar'
                }));
                return cars;
            },

            getFuels = function () {
                var sortedFuels = _.sortBy(Fuel.query(), 'name');
                sortedFuels.push({
                    name: 'Add New Fuel',
                    value: 'newFuel'
                });
                return sortedFuels;
            };

        $scope.refuel = refuel;
        $scope.fuels = getFuels();
        $scope.cars = getCars();

        $scope.refuel.replaceFuel($scope.fuels);

        $scope.create = function () {
            // date saved as timestamp
            $scope.refuel.date = Utils.formatDateToTime($scope.refuel.date);
            $scope.refuel.$save(function () {
                $state.go('app.refuelList');
            });
        };

        $scope.$watch('refuel.fuel', function (newFuel, oldFuel) {
            /*console.group('Fuel');
            console.log(newFuel);
            console.log(oldFuel);
            console.groupEnd();*/
            if (newFuel && (newFuel !== oldFuel || !$scope.refuel._id)) {
                $scope.refuel.fuelPrice = newFuel.price;
            } else if (!newFuel) {
                $scope.refuel.fuelPrice = '';
            }
        });

        // tests for edit 3 elements
        $scope.$watch('refuel.fuelPrice * refuel.capacity', function (
            newAmount, oldAmount) {
            /*console.group('Amount');
            console.log(newAmount);
            console.log(oldAmount);
            console.groupEnd();*/
            if (newAmount !== oldAmount) {
                $scope.refuel.amount = !isNaN(newAmount) ? Math.round(
                    newAmount * 100) / 100 : '';
            }
        });

        // // tests for edit 3 elements
        $scope.$watch('refuel.amount / refuel.capacity', function (
            newFuelPrice, oldFuelPrice) {
            /*console.group('Fuel Price');
            console.log(newFuelPrice);
            console.log(oldFuelPrice);
            console.groupEnd();*/
            // NaN !== NaN true
            if (newFuelPrice !== oldFuelPrice && !isNaN(newFuelPrice) &&
                    !isNaN(oldFuelPrice)) {
                $scope.refuel.fuelPrice = !isNaN(newFuelPrice) ? Math.round(
                    newFuelPrice * 100) / 100 : '';
            }
        });

        $scope.$watch('refuel.car', function (newCar, oldCar) {
            var car;
            if (newCar && newCar !== oldCar) {
                car = Car.get({
                    _id: parseInt(newCar, 10)
                });

                if (car.fuel && car.fuel._id) {
                    $scope.refuel.replaceFuel($scope.fuels, car.fuel._id);
                }
            }
        });

        // set car by default when is a new refuel
        if (!$scope.refuel._id && carByDefault._id) {
            $scope.refuel.car = _.findWhere($scope.cars, {
                byDefault: true
            });
            if (carByDefault.fuel && carByDefault.fuel._id) {
                $scope.refuel.replaceFuel($scope.fuels, carByDefault.fuel._id);
            }
        }

        // create car modal
        $ionicModal.fromTemplateUrl('templates/cars/form-modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.carModal = modal;
        });

        $scope.addNewCar = function () {
            if ($scope.refuel.car && $scope.refuel.car.value === 'newCar') {
                $scope.car = new Car();
                $scope.makes = Utils.getMakes();
                $scope.years = Utils.getYears();
                Utils.turnOnDefaultCar(Car, $scope.car);
                $scope.carModal.show();
            }
        };

        $scope.createCar = function () {
            // this is to ensure that always there is only one car by default
            Utils.unsetDefaultCar(Car, $scope.car);

            $scope.car.$save(function () {
                // var cars = Car.query();
                $scope.cars = getCars();
                // I think we should have only strings or integers as ids
                $scope.refuel.car = $scope.car._id.toString();
                $scope.carModal.hide();
            });
        };

        // create fuel modal
        $ionicModal.fromTemplateUrl('templates/fuels/form-modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.fuelModal = modal;
        });

        $scope.addNewFuel = function () {
            if ($scope.refuel.fuel && $scope.refuel.fuel.value === 'newFuel') {
                $scope.fuel = new Fuel();
                $scope.fuelModal.show();
            }
        };

        $scope.createFuel = function () {
            $scope.fuel.$save(function () {
                // need to query all the fuels to get the new one
                $scope.fuels = getFuels();
                $scope.refuel.replaceFuel($scope.fuels, $scope.fuel._id);
                $scope.fuelModal.hide();
            });
        };

        // create new make and model modal
        $ionicModal.fromTemplateUrl('templates/cars/new-make-model.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.newMakeModelModal = modal;
        });

        $scope.newMakeModel = function () {
            $ionicPopup.alert({
                title: 'New Make and Model',
                template: 'Thanks for suggest a new make and model.<br />' +
                    'Your suggestion will be reviewed and we will let you know if it is accepted.'
            }).then(function () {
                $scope.newCar = {};
                $scope.newMakeModelModal.hide();
            });
        };

        // We are repeating a lot of code with modals, we have to review this,
        // maybe the above code can be in a function(s).

        $scope.$on('modal.hidden', function () {
            if (arguments[1].modalEl.id === 'new-fuel-modal' && $scope.refuel.fuel &&
                    $scope.refuel.fuel.value === 'newFuel') {
                $scope.refuel.fuel = null;
            } else if (arguments[1].modalEl.id === 'new-car-modal' && $scope.refuel.car &&
                    $scope.refuel.car.value === 'newCar') {
                $scope.refuel.car = null;
            }
        });

        // remove modal instances from DOM
        $scope.$on('$destroy', function () {
            $scope.fuelModal.remove();
            $scope.carModal.remove();
            $scope.newMakeModelModal.remove();
        });

        $scope.$watch('refuel.car + refuel.overallKilometers + refuel.capacity',
            function (newData, oldData) {

            var car = Car.get({
                    _id: Number($scope.refuel.car)
                }),
                previousRefuel = $scope.refuel.getPreviousRefuel(),
                distance;

            if (car && previousRefuel && previousRefuel._id !== $scope.refuel._id) {
                distance = $scope.refuel.overallKilometers - previousRefuel.overallKilometers;
                _.extend($scope.refuel, {
                    distance: distance,
                    consumption: (distance / $scope.refuel.capacity)
                });
            } else {
                _.extend($scope.refuel, {
                    distance: 0,
                    consumption: 0
                });
            }
        });
    }
]);
