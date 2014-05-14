angular.module('CarGas.Main')
.controller('Main', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.menuSelected = 'Home';

    $rootScope.tabs = [
        {
            menu: 'Home',
            href: '/',
            text: 'Cuenta',
            icon: 'fa-briefcase'
        },
        {
            menu: 'Refuel',
            href: '/refuel',
            text: 'Recarga',
            icon: 'fa-plus'
        },
        {
            menu: 'Refuels',
            href: '/refuels',
            text: 'Recargas',
            icon: 'fa-archive'
        },
        {
            menu: 'Cars',
            href: '/account/cars',
            text: 'Vehiculos',
            icon: 'fa-archive'
        },
        {
            menu: 'Spent',
            href: '/spents',
            text: 'Gastos',
            icon: 'fa-archive'
        }

    ];

    angular.extend($rootScope, {
        _addClass: function (el, className) {
            if (el.classList) {
                el.classList.add(className);
            } else {
                el.className += ' ' + className;
            }
        },

        _hasClass: function (el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            }
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        },

        _removeClass: function (el, className) {
            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(
                    new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
                    ' '
                );
            }
        },

        showMenu: function () {
            $rootScope._addClass(document.body, 'menu-active');
        },

        hideMenu: function () {
            $rootScope._removeClass(document.body, 'menu-active');
        },

        toggleMenu: function () {
            alert('coming soon');
            /*
            var body = document.body;

            if ($rootScope._hasClass(body, 'menu-active')) {
                $rootScope._removeClass(body, 'menu-active');
            } else {
                $rootScope._addClass(body, 'menu-active');
            }
            */
        }
    });

}]);