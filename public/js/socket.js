'use strict';

angular.module('socket-io', []).
  factory('socket', function ($rootScope, $timeout) {
    var socket = io.connect();
    console.log("connected to IO");
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });