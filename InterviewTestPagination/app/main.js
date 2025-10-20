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

            $scope.currentPage = 1;
            $scope.itemsPerPage = '20';
            $scope.totalItems = 0;
            $scope.pageCount = 0;


            // Inicializando variáveis de ordenação

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
                if (!$scope.sortClicked) return "";
                if ($scope.sortColumn == column) return $scope.reverseSort ? '▼' : '▲';
                return "";
            };

            // Chamando os dados da API

            $scope.loadTodos = function () {
                $scope.loading = true;

                // Garante que o valor 1 (all) retorne todos os itens
                var perPage = ($scope.itemsPerPage === 1)
                    ? $scope.totalItems || Number.MAX_SAFE_INTEGER
                    : ($scope.itemsPerPage);

                $http.get('/api/Todo?page=' + $scope.currentPage + '&pageSize=' + perPage)
                    .then(function (response) {
                        $scope.todos = response.data.items;
                        $scope.totalItems = response.data.totalCount;

                        // Quando for "all", força o total em uma única página
                        $scope.pageCount = ($scope.itemsPerPage === 1)
                            ? 1
                            : Math.ceil($scope.totalItems / perPage);
                    }).finally(function () {
                        $scope.loading = false;
                    });
            };


            $scope.$on('pageChanged', function (event, data) {
                $scope.currentPage = data.page;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.loadTodos();
            });

            $scope.loadTodos();
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
            scope: {totalItems: "=", itemsPerPage: "=", currentPage: "="},
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {

            // Atualiza número total de páginas

            $scope.$watchGroup(['totalItems', 'itemsPerPage'], function () {
                if ($scope.itemsPerPage === 1) {
                    $scope.totalPages = 1;
                    $scope.currentPage = 1;
                } else {
                    const perPage = parseInt($scope.itemsPerPage) || 20;
                    $scope.totalPages = Math.ceil($scope.totalItems / perPage) || 1;
                }
            });

            // Ações de navegação

            $scope.firstPage = function () {
                if ($scope.currentPage > 1) $scope.changePage(1);
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 1) $scope.changePage($scope.currentPage - 1);
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.totalPages) $scope.changePage($scope.currentPage + 1);
            };

            $scope.lastPage = function () {
                if ($scope.currentPage < $scope.totalPages) $scope.changePage($scope.totalPages);
            };

            // Alterar página

            $scope.changePage = function (page) {
                if (page < 1 || page > $scope.totalPages) return;
                $scope.currentPage = page;
                $scope.$emit("pageChanged", {
                    page: $scope.currentPage,
                    itemsPerPage: $scope.itemsPerPage === 'all' ? Number.MAX_SAFE_INTEGER : parseInt($scope.itemsPerPage)
                });
            };

            // Alterar quantidade de itens por página

            $scope.changeItemsPerPage = function () {
                $scope.changePage(1);
            };
        }

        function link(scope, element, attrs) { }

        return directive;
    }

})(angular);

