'use strict';

/* Controllers */

envyLeagueApp.controller('HomeController', function ($scope) {
});

envyLeagueApp.controller('MainController', function ($scope) {
    $scope.allslides =[
        {image:'/images/street1.jpg', text:''},{image:'/images/street2.jpg', text:''},{image:'/images/street3.jpg', text:''},
        {image:'/images/street4.jpg', text:''},{image:'/images/street5.jpg', text:''},{image:'/images/street6.jpg', text:''},
        {image:'/images/street7.jpg', text:''},{image:'/images/street8.jpg', text:''},{image:'/images/street9.jpg', text:''},
        {image:'/images/street10.jpg', text:''},{image:'/images/street11.jpg', text:''},{image:'/images/street12.jpg', text:''},
        {image:'/images/street13.jpg', text:''},{image:'/images/street14.jpg', text:''},{image:'/images/street15.jpg', text:''},
        {image:'/images/street16.jpg', text:''},{image:'/images/street17.jpg', text:''},{image:'/images/street18.jpg', text:''},
        {image:'/images/street19.jpg', text:''},{image:'/images/street20.jpg', text:''},{image:'/images/street21.jpg', text:''},
        {image:'/images/street22.jpg', text:''},{image:'/images/street23.jpg', text:''},{image:'/images/street24.jpg', text:''},
        {image:'/images/street25.jpg', text:''},{image:'/images/street26.jpg', text:''},{image:'/images/street27.jpg', text:''},
        {image:'/images/street28.jpg', text:''},{image:'/images/street29.jpg', text:''},{image:'/images/street30.jpg', text:''},
        {image:'/images/street31.jpg', text:''},{image:'/images/street32.jpg', text:''},{image:'/images/street33.jpg', text:''},
        {image:'/images/street34.jpg', text:''},{image:'/images/street35.jpg', text:''},{image:'/images/street36.jpg', text:''},
        {image:'/images/street37.jpg', text:''}
    ];
    $scope.slides = [];
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 6)]);
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 6)+6]);
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 6)+12]);
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 6)+18]);
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 6)+24]);
    $scope.slides.push($scope.allslides[Math.floor(Math.random() * 7)+30]);
});

envyLeagueApp.controller('AdminController', function ($scope) {
});

envyLeagueApp.controller('MenuController', function ($scope) {
});

envyLeagueApp.controller('PasswordController', function ($scope, Password) {
    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.changePassword = function () {
        if ($scope.password != $scope.confirmPassword) {
            $scope.doNotMatch = "ERROR";
        } else {
            $scope.doNotMatch = null;
            Password.save($scope.password,
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = 'OK';
                    $scope.password = null;
                    $scope.confirmPassword = null;
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        }
    };
});

envyLeagueApp.controller('RegisterController', function ($scope, Register) {
    $scope.success = null;
    $scope.doNotMatch = null;
    $scope.errorUserExists = null;
    $scope.error = null;
    $scope.showButton = true;
    var strength = {
        colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
        mesureStrength: function (p) {

            var _force = 0;
            var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

            var _lowerLetters = /[a-z]+/.test(p);
            var _upperLetters = /[A-Z]+/.test(p);
            var _numbers = /[0-9]+/.test(p);
            var _symbols = _regex.test(p);

            var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
            var _passedMatches = $.grep(_flags, function (el) { return el === true; }).length;

            _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
            _force += _passedMatches * 10;

            // penality (short password)
            _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

            // penality (poor variety of characters)
            _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
            _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
            _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

            return _force;

        },
        getColor: function (s) {

            var idx = 0;
            if (s <= 10) { idx = 0; }
            else if (s <= 20) { idx = 1; }
            else if (s <= 30) { idx = 2; }
            else if (s <= 40) { idx = 3; }
            else { idx = 4; }

            return { idx: idx + 1, col: this.colors[idx] };
        }
    };
    $scope.passwordStrength = '<div id="strength"><ul id="strengthBar">' +
                           '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
                         '</ul></div>';
    $scope.$watch("registerAccount.password", function(newValue, oldValue) {
       if (newValue) {
           var iElement = angular.element(document.getElementById('strength'));
           var c = strength.getColor(strength.mesureStrength(newValue));
           iElement.removeClass('ng-hide');
           iElement.find('ul').children('li')
               .css({ "background": "#DDD" })
               .slice(0, c.idx)
               .css({ "background": c.col });
       }
    });

    $scope.register = function () {
        if ($scope.registerAccount.password != $scope.confirmPassword) {
            $scope.doNotMatch = "ERROR";
        } else {
            $scope.doNotMatch = null;
            $scope.success = null;
            $scope.error = null;
            $scope.errorUserExists = null;
            $scope.errorEmailExists = null;
            $scope.showButton = false;
            Register.save($scope.registerAccount,
                function (value, responseHeaders) {
                    $scope.showButton = true;
                    $scope.success = 'OK';
                },
                function (httpResponse) {
                    $scope.showButton = true;
                    if (httpResponse.status === 400 && httpResponse.data === "login already in use") {
                        $scope.error = null;
                        $scope.errorUserExists = "ERROR";
                    } else if (httpResponse.status === 400 && httpResponse.data === "e-mail address already in use") {
                        $scope.error = null;
                        $scope.errorEmailExists = "ERROR";
                    } else {
                        $scope.error = "ERROR";
                    }
                }
            );
        }
    };
});

envyLeagueApp.controller('ActivationController', function ($scope, $routeParams, Activate) {
    Activate.get({key: $routeParams.key},
        function (value, responseHeaders) {
            $scope.error = null;
            $scope.success = 'OK';
        },
        function (httpResponse) {
            $scope.success = null;
            $scope.error = "ERROR";
        }
    );
});
envyLeagueApp.controller('LoginController', function ($scope, AuthenticationSharedService) {
    $scope.rememberMe = true;
    $scope.login = function () {
        AuthenticationSharedService.login({
            username: $scope.username,
            password: $scope.password,
            rememberMe: $scope.rememberMe
        });
    }
});
envyLeagueApp.controller('LogoutController', function ($scope, AuthenticationSharedService) {
    AuthenticationSharedService.logout();
});

