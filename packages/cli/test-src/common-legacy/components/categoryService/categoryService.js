/**
 * Created by entryone on 11/6/14.
 * Refactored by A.Nakhabov 2015-11-18
 */
(function(angular){
    angular.module('dtCommon').factory('categoryService', categoryService);

    categoryService.$inject = ['$http'];
    function categoryService($http) {
        var categoryService = {};

        /*
        categoryService.getCategories = function(project, from,  variable, stext, publicMode) {
            console.log('DEPRECATED categoryService.getCategories, use categoryService.get instead');

            var options = {
                max: 50,
                from: from || 0,
                variable: variable,
                project: project,
                stext: stext || ''
            };
            var url = publicMode ? EnvironmentService.getURL('api/v2/projects/{{project.hash}}/columns/{{variable.id}}/categories?offset={{from}}&max={{max}}',options) : EnvironmentService.getURL('api/v2/projects/{{project.hash}}/categoriesAll?offset={{from}}&max={{max}}&columnId={{variable.id}}',options),
                deferred = $q.defer();

            url = options.stext.length ? url + '&contains=' + encodeURIComponent(options.stext) : url;

            $http.get(url)
                .success(function (data) {
                    console.log('SUCCESS');
                    deferred.resolve(data);
                }).error(function (data) {
                    console.log('FAILED');
                    deferred.reject(data);
                });

            return deferred.promise
        };
        */

        categoryService.get = function(projectHash, variable, from = 0, count = 50, stext = '', publicMode) {
            let url = publicMode ?
                `/api/v2/projects/${projectHash}/columns/${variable.id}/categories?offset=${from}&max=${count}` :
                `/api/v2/projects/${projectHash}/categoriesAll?offset=${from}&max=${count}&columnId=${variable.id}`;

            if (stext.length) {
                url += '&contains=' + encodeURIComponent(stext);
            }

            return $http.get(url);
        };

        return categoryService;
    }
})(angular);