'use strict';

/* Services */

envyLeagueApp.factory('Register', function ($resource) {
    return $resource('rest/user/register', {}, {});
});

envyLeagueApp.factory('Password', function ($resource) {
    return $resource('rest/user/change_password', {}, {});
});

envyLeagueApp.factory('Activate', function ($resource) {
    return $resource('rest/user/activate', {}, {
        'get': { method: 'GET', params: {}, isArray: false}
    });
});

envyLeagueApp.factory('Session', function () {
    this.create = function (login, name, email, facebookUserId, userRoles) {
        this.login = login;
        this.name = name;
        this.email = email;
        this.facebookUserId = facebookUserId;
        this.userRoles = userRoles;
    };
    this.invalidate = function () {
        this.login = null;
        this.name = null;
        this.email = null;
        this.facebookUserId = null;
        this.userRoles = null;
    };
    return this;
});
envyLeagueApp.factory('UserService', function ($resource) {
    return $resource('rest/user', {}, {});
});
envyLeagueApp.factory('AuthenticationSharedService', function ($rootScope, $http, authService, Session, UserService) {
    return {
        login: function (param) {
            var data ="j_username=" + encodeURIComponent(param.username) +"&j_password=" + encodeURIComponent(param.password) +"&_spring_security_remember_me=" + param.rememberMe +"&submit=Login";
            $http.post('user/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function (data, status, headers, config) {
                UserService.get(function(data) {
                    Session.create(data.login, data.name, data.email, data.facebookUserId, data.roles);
                    $rootScope.account = Session;
                    authService.loginConfirmed(data);
                });
            }).error(function (data, status, headers, config) {
                $rootScope.authenticationError = true;
                Session.invalidate();
            });
        },
        valid: function (authorizedRoles) {

            $http.get('protected/authentication_check.gif', {
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function (data, status, headers, config) {
                if (!Session.login) {
                    UserService.get(function(data) {
                        Session.create(data.login, data.name, data.email, data.facebookUserId, data.roles);
                        $rootScope.account = Session;
                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                            // user is not allowed
                           $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                            $rootScope.$broadcast("event:auth-loginConfirmed");
                        }
                    });
                }else{
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                    } else {
                            $rootScope.$broadcast("event:auth-loginConfirmed");
                    }
                }
            }).error(function (data, status, headers, config) {
                if (!$rootScope.isAuthorized(authorizedRoles)) {
                    $rootScope.$broadcast('event:auth-loginRequired', data);
                }
            });
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles == '*') {
                    return true;
                }

                authorizedRoles = [authorizedRoles];
            }

            var isAuthorized = false;
            angular.forEach(authorizedRoles, function(authorizedRole) {
                var authorized = (!!Session.login &&
                    Session.userRoles.indexOf(authorizedRole) !== -1);

                if (authorized || authorizedRole == '*') {
                    isAuthorized = true;
                }
            });

            return isAuthorized;
        },
        logout: function () {
            $rootScope.authenticationError = false;
            $rootScope.authenticated = false;
            $rootScope.account = null;

            $http.get('user/logout');
            Session.invalidate();
            authService.loginCancelled();
        }
    };
});
