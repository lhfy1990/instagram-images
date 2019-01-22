'use strict';

let app = angular.module('restApp', ['ngRoute', 'modules']);

app.config(($routeProvider) => {
  $routeProvider
    .when('/home', {
      templateUrl: 'app/components/home/homeView.html'
    })
    .otherwise({
      redirectTo: '/home'
    });
});
