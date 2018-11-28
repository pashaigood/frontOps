/**
 * Created by Entryone on 21.11.2014.
 * Remade by Andrei Nakhabov 15.12.2015
 */
(function(angular) {
    angular.module('dtCommon').directive('meditorTree', meditorTree);

    function meditorTree() {
        return {
            restrict: 'EA',
            replace: false,
            transclude: true,
            scope: {
                hash: '=',
                group: '='
            },
            templateUrl: 'components/editorTree/meditorTreeTpl.html',
            controller: meditorTreeController,
            controllerAs: 'meditorTree'
        }
    }

    class meditorTreeController {
        dragOptions = {
            revert: 'invalid',
            axis: 'y',
            handle: '.drag-handler',
            scroll: true,
            helper: () => this.$element.find('.dragClone').clone().show(),
            start: () => this.$element.addClass('leafsBeingDragged'),
            stop: () => this.$element.removeClass('leafsBeingDragged')
        };

        dropOptions = {
            hoverClass: 'drag-enter',
            tolerance: "pointer",
            accept: '.droppableOnTree'
        };

        getDragPayload(node) {
            return node;
        }

        loadGroups(node) {
            var deferred = this.$q.defer();
            this.meditor
                .getGroups(this.$scope.hash, node)
                .then(response => {
                    let data = response.data;
                    this.$scope.data = data;
                    this.$scope.select(data[0]);
                }).catch(err => deferred.reject(err));
            return deferred.promise;
        };

        onVariablesDrop(node, $payload, $dragScope, parentId) {
            $dragScope.$emit('item-dropped-on-tree', node, $payload, parentId); // todo! DANGER scoup soup with $parent, to change ng-include with component, 
        };

        /* @ngInject */
        constructor($scope, $q, meditor, $element, growl) {
            var meditorTree = this;
            this.$element = $element;
            this.$scope = $scope;
            this.$q = $q;
            this.meditor = meditor;
            this.growl = growl;
            $scope.data = [];
            
            $scope.$on('item-dropped-on-tree', (event, node, $payload, destinationId) => {
                event.stopPropagation();
                var groupId  = $payload.id;
                var beforeId = (node == null) ? null : node.id;

                if (groupId == destinationId) return;
                meditor.reorderGroup(
                    $scope.hash,
                    groupId,
                    destinationId,
                    beforeId
                ).then(
                    () => meditorTree.loadGroups(),
                    error => this.growl.addErrorMessage(error.data.message)
                );
            });

            $scope.select = function (node) {
                $scope.group = node;
            };

            meditorTree.loadGroups();

            $scope.createSubFolder = node => {
                var newGroup = {
                    name: 'new folder',
                    visible: true,
                    groups: []
                };
                meditor.createGroup($scope.hash, node.id, newGroup.name).then(
                    response => {
                        newGroup.id = response.data;
                        node.groups.push(newGroup);
                    },
                    error => this.growl.addErrorMessage(error.message)
                );
            };
            $scope.hideFolder = node => {
                meditor.updateGroupVisibility($scope.hash, node.id, false).then(
                    () => node.visible = false
                );
            };
            $scope.showFolder = node => {
                meditor.updateGroupVisibility($scope.hash, node.id, true).then(
                    () => node.visible = true
                );
            };

            $scope.removeFolder = node => {
                node._deleted = true;
                meditor.removeGroup($scope.hash, node.id).then(
                    data => {},
                    error => this.growl.addErrorMessage(error.message)
                );
            };

            $scope.renameFolder = node => {
                meditor.updateGroup($scope.hash, node.id, node.name).then(
                    data => {},
                    error => this.growl.addErrorMessage(error.message)
                );
            };


            $scope.dblclick = function(){
                this.$form.$show();
            }
        }
    }
})(angular);