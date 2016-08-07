

var app = angular.module('iframed', []);

app
  .factory('iFrameMessenger', function($window) {
    return {
      messageOut: function(message) {
        console.log('sending message out');
        console.log(message);
        console.log($window.parent);
        $window.parent.postMessage(message, '*');
      },
      messageIn: function(message){
        //???
        console.log('sending message in');
        console.log(message);
        var iframe = document.getElementById('iframe');
        console.log(iframe);
        iframe.contentWindow.postMessage(message, '*');
      }
    };
  });

app.controller('outer', ['$scope', '$window', 'iFrameMessenger',
  function($scope, $window, iFrameMessenger) {
  console.log('hello outside');
  console.log(window.innerWidth);
  $scope.greeting = 'Hola!';
  $scope.fromInner = false;

  $scope.width = 800;
  $scope.scale = 0.6;

  $window.addEventListener('message', function(message) {
      // handle messages received from iframe

    console.log('parent received a message from the iframe');
    console.log(message.data);
    $scope.fromInner = message.data.greeting;
    $scope.greeting = $scope.fromInner;
    $scope.$apply();

  });

  $scope.$watch('greeting', function(newVal, oldVal){
    if(newVal != oldVal && newVal != $scope.fromInner) {
      console.log('changed greeing on the outer');
      iFrameMessenger.messageIn({greeting: newVal});
    }
  })


}]);

app.controller('inner', ['$scope', '$window', 'iFrameMessenger',
  function($scope, $window, iFrameMessenger) {
  console.log('hello inside');
  console.log(window.innerWidth);
  $scope.greeting = 'Hola!';
  $scope.fromOuter = false;

  $window.addEventListener('message', function(message) {
      // handle messages received from parent

    console.log('iframe received a message from the parent');
    console.log(message.data);
    $scope.fromOuter = message.data.greeting;
    $scope.greeting = $scope.fromOuter;

    $scope.$apply();

  });

  $scope.$watch('greeting', function(newVal, oldVal){
    if(newVal != oldVal && newVal != $scope.fromOuter) {
      console.log('changed greeing on the inner');
      iFrameMessenger.messageOut({greeting: newVal});
    }
  })

}]);