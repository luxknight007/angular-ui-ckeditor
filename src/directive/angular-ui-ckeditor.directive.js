(function() {
    'use strict';

    angular.module('angular-ui-ckeditor', [])
        .directive('uiCkeditor', UiCkeditorDirective)
        .controller('uiCkeditorCtrl', uiCkeditorCtrl);

    UiCkeditorDirective.$inject = [];

    function UiCkeditorDirective() {
        return {
            restrict: 'A',
            controller: 'uiCkeditorCtrl',
            controllerAs: '$ctrl',
            link: Linker,
            replace: true,
            require: ['ui-ckeditor', 'ngModel'],
            scope: {
                data: '='
            }
        };
    }

    function Linker(scope, element, attrs, ctrls) {
        var uiCkeditorCtrl = ctrls[0];
        var ngModelController = ctrls[1];

        uiCkeditorCtrl.instance.on('change', function syncView() {
            ngModelController.$setViewValue(uiCkeditorCtrl.instance.getData());
        });

        function init() {
            uiCkeditorCtrl.instance.setData(scope.data);
        }

        init();
    }

    uiCkeditorCtrl.$inject = ['$scope', '$window', '$element', '$attrs', '$parse'];

    function uiCkeditorCtrl($scope, $window, $element, $attrs, $parse) {
        var ctrl = this;
        ctrl.instance = {};
        // Parse and get the configuration define in the parent
        ctrl.config = $parse($attrs.ckeditor)($scope.$parent) || {};
        ctrl.editorElement = $element[0];
        ctrl.loaded = false;

        angular.extend(ctrl, {
            ckeditor: $window.CKEDITOR
        });

        function init() {
            ctrl.instance = ctrl.editorElement.hasAttribute('contenteditable') &&
            ctrl.editorElement.getAttribute('contenteditable').toLowerCase() === 'true' ?
                ctrl.ckeditor.inline(ctrl.editorElement, ctrl.config) :
                ctrl.ckeditor.replace(ctrl.editorElement, ctrl.config);
        }

        init();
    }
}());
