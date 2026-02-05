(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", todoPaginatedList)
        .directive("pagination", pagination);
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
        return {
            restrict: "E",
            scope: {},
            templateUrl: "app/templates/todo.list.paginated.html",
            controller: ["$scope", "$http", function ($scope, $http) {

                var vm = this;

                // pager state
                vm.pager = {
                    page: 1,
                    pageSize: 20, // default, por padrão já abre com 20 itens por página
                    totalItems: 0,
                    totalPages: 1,
                    sortField: "CreatedDate",
                    sortDir: "desc"
                };

                // estado controlado via controllerAs (vm)
                vm.todos = [];
                vm.loading = false;
                vm.error = null;

                // load function (requests backend)
                vm.load = function () {
                    vm.loading = true;
                    vm.error = null;


                    var params = {
                        page: vm.pager.page,
                        pageSize: vm.pager.pageSize,
                        sortField: vm.pager.sortField,
                        sortDir: vm.pager.sortDir
                    };

                    // if pageSize is 0 (meaning 'all'), send pageSize=0
                    $http.get("/api/todo", { params: params })
                        .then(function (resp) {
                            // normaliza a resposta do backend para lidar com várias possíveis keys/casing
                            var raw = resp.data || {};

                            // suporta ambos: { Items: [...] } e { items: [...] } e também retorno direto de array
                            var items = null;
                            if (raw.Items && angular.isArray(raw.Items)) {
                                items = raw.Items;
                            } else if (raw.items && angular.isArray(raw.items)) {
                                items = raw.items;
                            } else if (angular.isArray(raw)) {
                                items = raw;
                            } else {
                                items = [];
                            }

                            // total pode estar em Total ou total ou não existir
                            var total = raw.Total || raw.total || (angular.isArray(items) ? items.length : 0);

                            // aplica ao controller (controllerAs vm)
                            vm.todos = items;
                            vm.pager.totalItems = total;
                            vm.pager.page = raw.Page || raw.page || vm.pager.page;
                            vm.pager.pageSize = (raw.PageSize || raw.pageSize || vm.pager.pageSize).toString();

                            // calcula totalPages
                            vm.pager.totalPages = (vm.pager.pageSize <= 0)
                                ? 1
                                : Math.max(1, Math.ceil(vm.pager.totalItems / vm.pager.pageSize));

                            vm.loading = false;

                        });
                };

                // pager helpers used by pagination directive
                vm.first = function () {
                    vm.pager.page = 1;
                    vm.load();
                };
                vm.prev = function () {
                    if (vm.pager.page > 1) {
                        vm.pager.page--;
                        vm.load();
                    }
                };
                vm.next = function () {
                    if (vm.pager.page < vm.pager.totalPages) {
                        vm.pager.page++;
                        vm.load();
                    }
                };
                vm.last = function () {
                    vm.pager.page = vm.pager.totalPages || 1;
                    vm.load();
                };
                vm.goto = function (p) {
                    var page = parseInt(p, 10) || 1;
                    page = Math.max(1, Math.min(vm.pager.totalPages || 1, page));
                    vm.pager.page = page;
                    vm.load();
                };
                vm.setPageSize = function (size) {
                    // força number
                    var s = parseInt(size, 10);

                    if (isNaN(s) || s === 0) {
                        // ALL
                        vm.pager.pageSize = 0;
                        vm.pager.page = 1;
                    } else {
                        vm.pager.pageSize = s;
                        vm.pager.page = 1;
                    }

                    vm.load();
                };

                vm.sort = function (field) {
                    if (vm.pager.sortField === field) {
                        // invert direction
                        vm.pager.sortDir = vm.pager.sortDir === "asc" ? "desc" : "asc";
                    } else {
                        // first click on a new field -> ASC
                        vm.pager.sortField = field;
                        vm.pager.sortDir = "asc";
                    }
                    vm.pager.page = 1;
                    vm.load();
                };


                // expose controller for pagination directive via require
                this.pager = vm.pager;
                this.first = vm.first;
                this.prev = vm.prev;
                this.next = vm.next;
                this.last = vm.last;
                this.goto = vm.goto;
                this.setPageSize = vm.setPageSize;
                this.sort = vm.sort;
                this.load = vm.load;

                // initial load
                vm.load();

            }],
            controllerAs: "vm"
        };
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
        return {
            restrict: "E",
            require: "^todoPaginatedList",
            templateUrl: "app/templates/pagination.html",
            link: function (scope, elem, attrs, todoCtrl) {
                // bind pager from the parent directive controller
                scope.pager = todoCtrl.pager;

                // helper call map
                scope.first = function () { todoCtrl.first(); };
                scope.prev = function () { todoCtrl.prev(); };
                scope.next = function () { todoCtrl.next(); };
                scope.last = function () { todoCtrl.last(); };
                scope.goto = function () { todoCtrl.goto(scope.pager.page); };
                scope.onPageSizeChange = function (val) { todoCtrl.setPageSize(val); };
                scope.sort = function (field) { todoCtrl.sort(field); };
            }
        };
    }

})(angular);
