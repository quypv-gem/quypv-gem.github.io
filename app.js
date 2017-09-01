angular
  .module('todoApp', [])
  .controller('TodoController', function($scope) {
    $scope.todos = [
      { text: 'Setup Angular project', select: false,  },
      { text: 'Add Materia css', select: false },
      { text: 'Write code', select: false },
      { text: 'Save to localStorage?', select: false },
    ];
    $scope.newTodo = '';
    $scope.counter = 0;

    $scope.add = function() {
      if (!$scope.newTodo) return false;

      $scope.todos.push({ text: $scope.newTodo, select: false });
      $scope.newTodo = '';
    };

    $scope.remove = function(index) {
      if ($scope.todos[index].select) $scope.counter--;
      $scope.todos.splice(index, 1);
    }

    $scope.bulkRemove = function() {
      var filtered = [];
      for (var i in $scope.todos) {
        if (!$scope.todos[i].select) filtered.push($scope.todos[i]);
        else delete $scope.todos[i];
      }
      $scope.todos = filtered;
    }

    $scope.$watch('counter', function(newVal) {
      console.log(newVal);
    })

  });
