(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", 
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, 
            controller: ["$scope", "$http", controller]
        };

        function controller($scope, $http) { 

            // Inicializando variáveis de escopo

            $scope.todos = [];
            $scope.loading = true;

            // Inicializando variáveis de paginação

            $scope.sortColumn = "createdDate";
            $scope.reverseSort = true;
            $scope.sortClicked = false;

            // Ordenando os dados

            $scope.sortData = function (column) {
                $scope.sortClicked = true;

                if ($scope.sortColumn == column) {
                    $scope.reverseSort = !$scope.reverseSort;
                }
                else {
                    $scope.sortColumn = column;
                    $scope.reverseSort = false;
                }
            };

            // Indicador de coluna ordenada

            $scope.getSortClass = function (column) {
                if (!$scope.sortClicked) {
                    return "";
                }
                if ($scope.sortColumn == column) {
                    return $scope.reverseSort ? '▼' : '▲';
                }
                return "";
            };

            // Chamando os dados da API

            $http.get("api/Todo").then(function (response) { $scope.todos = response.data; }).finally(function () { $scope.loading = false });
        }

        

        function link(scope, element, attrs) { }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * 
     * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) { }

        function link(scope, element, attrs) { }

        return directive;
    }

})(angular);

