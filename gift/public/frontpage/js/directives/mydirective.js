angular.module('app')
.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
})
// .directive('contenteditable', function() {
//     return {
//         require: 'ngModel',
//         link: function(scope, elm, attrs, ctrl) {
//             // view -> model
//             elm.bind('blur', function() {
//                 scope.$apply(function() {
//                     ctrl.$setViewValue(elm.html());
//                 });
//             });

//             // model -> view
//             ctrl.$render = function() {
//                 elm.html(ctrl.$viewValue);
//             };

//             // load init value from DOM
//             ctrl.$setViewValue(elm.html());
//         }
//     };
// })
.directive("quickEdit", function($parse) {
    return {
        restrict: 'A',
        require: "?ngModel", // require ngModel on the same HTML element as quickEdit      
        // scope: {
        //     onTextSelect:"&"
        //   },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$render = function() {
                element.text(ngModel.$viewValue || '');
            };


            // add HTML5 "contentEditable" attribute with value "true" on double click
            // this will make field editable
            element.dblclick(function() {
                $(this).attr("contentEditable", "true");
                $(this).focus();
            });

            element.click(function() {                
                if( $(this).attr("contentEditable") == "true" )
                {
                    var html = "";
                    if (typeof window.getSelection != "undefined") {
                        var sel = window.getSelection();
                        if (sel.rangeCount) {
                            var container = document.createElement("div");
                            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                                container.appendChild(sel.getRangeAt(i).cloneContents());
                            }
                            html = container.innerHTML;
                        }
                    } else if (typeof document.selection != "undefined") {
                        if (document.selection.type == "Text") {
                            html = document.selection.createRange().htmlText;
                        }
                    }

                    if( !html || html.length < 1 )
                    {
                        event.preventDefault();
                        return; 
                    }

                    var onSelectCallback = $parse(attrs.onTextSelect);
                    onSelectCallback(scope, {$text: html});
                }                    
                
                event.preventDefault();
            });

            // handling "return/enter" and "escape" key press
            element.bind('keydown', function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                // on "enter" set "contentEditable" to "false" to make field not-editable again
                // and call "read" method which is responsible for setting new value to the object in ngModel
                if (keycode === 13) { // ENTER
                    $(this).attr("contentEditable", "false");
                    $(this).blur();
                    event.preventDefault();
                    read();
                }
                // on "escape"and set the text in the element back to the original value
                // and set "contentEditable" to "false" to make field not-editable again
                if (keycode === 27) { // ESCAPE
                    element.text(ngModel.$viewValue);
                    $(this).attr("contentEditable", "false");
                    $(this).blur();
                }
            });

            // this is called to update the value in the object after edit
            function read() {
                var text = element.text();
                ngModel.$setViewValue(text);
            }
        }
    };
})
.directive('sglclick', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr['sglclick']);
          var delay = 300, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = setTimeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                }); 
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    }
})    
.directive('scrollybottom', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading scrolly directive');
                
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    console.log("I am at the bottom");
                    scope.$apply(attrs.scrollybottom);
                }
            });
        }
    };
})
.directive('scrollytop', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading scrolly directive');
                
            element.bind('scroll', function () {
                if (raw.scrollTop <= 0) {
                    console.log("I am at the top");
                    scope.$apply(attrs.scrollytop);
                }
            });
        }
    };
})
.directive("keepScroll", function(){
  
  return {

    controller : function($scope){
      var element = 0;
      
      this.setElement = function(el){
        element = el;
      }

      this.addItem = function(item){
        console.log("Adding item", item, item.clientHeight);
        element.scrollTop = (element.scrollTop+item.clientHeight+1); //1px for margin
      };

      this.itemRemoved = function(height){
        element.scrollTop = (element.scrollTop - height - 1); //1px for margin
        console.log("Item removed");
      };
      
    },
    
    link : function(scope,el,attr, ctrl) {
      
     ctrl.setElement(el[0]);
      
    }
    
  };
  
})
.directive("scrollItem", function(){
  
  
  return{
    require : "^keepScroll",
    link : function(scope, el, att, scrCtrl){
      scrCtrl.addItem(el[0]);

      var height = el[0].clientHeight;

      scope.$on('$destroy', function() {
        scrCtrl.itemRemoved(height);
      });
    }
  }
})
.directive('imgOrientation', function(){
  return {
    restrict: 'A',
    link: function(scope, element/*, attrs*/) {
      function setTransform(transform) {
        element.css('-ms-transform', transform);
        element.css('-webkit-transform', transform);
        element.css('-moz-transform', transform);
        element.css('transform', transform);
      }

      var parent = element.parent();
      $(element).bind('load', function() {
        EXIF.getData(element[0], function() {
          var orientation = EXIF.getTag(element[0], 'Orientation');
          var height = element.height();
          var width = element.width();
          if (orientation && orientation !== 1) {
            switch (orientation) {
              case 2:
                setTransform('rotateY(180deg)');
                break;
              case 3:
                setTransform('rotate(180deg)');
                break;
              case 4:
                setTransform('rotateX(180deg)');
                break;
              case 5:
                setTransform('rotateZ(90deg) rotateX(180deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 6:
                setTransform('rotate(90deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 7:
                setTransform('rotateZ(90deg) rotateY(180deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
              case 8:
                setTransform('rotate(-90deg)');
                if (width > height) {
                  parent.css('height', width + 'px');
                  element.css('margin-top', ((width -height) / 2) + 'px');
                }
                break;
            }
          }
        });
      });
    }
  };
})
.directive('onSizeChanged', ['$window', function ($window) {
    return {
        restrict: 'A',
        scope: {
            onSizeChanged: '&'
        },
        link: function (scope, $element, attr) {
            var element = $element[0];

            cacheElementSize(scope, element);
            $window.addEventListener('resize', onWindowResize);

            function cacheElementSize(scope, element) {
                scope.cachedElementWidth = element.offsetWidth;
                scope.cachedElementHeight = element.offsetHeight;
            }

            function onWindowResize() {
                var isSizeChanged = scope.cachedElementWidth != element.offsetWidth || scope.cachedElementHeight != element.offsetHeight;
                if (isSizeChanged) {
                    var expression = scope.onSizeChanged();
                    expression();
                }
            };
        }
    }
}])
.directive('elementSize', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.ready(function () {
        var height,
            width;
        $timeout(function () {
          height  = element[0].offsetHeight;
          width  = element[0].offsetWidth;
          if (attrs.key) {
            scope[attrs.key] = {
              height: height,
              width: width
            };
            return;
          }

          scope.elementSize = {
            height: height,
            width: width
          };
        }, 100);
      });
    }
  };
})
.directive('fillHeight', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
        return {
            restrict: 'A',
            scope: {
                footerElementId: '@',
                additionalPadding: '@',
                debounceWait: '@'
            },
            link: function (scope, element, attrs) {

                var ele = element[0];

                cacheElementSize(scope, ele);
                $window.addEventListener('resize', onWindowResize1);

                function cacheElementSize(scope, ele) {
                    scope.cachedElementWidth = ele.offsetWidth;
                    scope.cachedElementHeight = ele.offsetHeight;
                }

                function onWindowResize1() {
                    var isSizeChanged = scope.cachedElementWidth != ele.offsetWidth || scope.cachedElementHeight != ele.offsetHeight;
                    if (isSizeChanged) {
                        if (scope.debounceWait === 0) 
                            onWindowResize();
                        else
                            debounce(onWindowResize, scope.debounceWait || 250);                        
                    }
                };

                if (scope.debounceWait === 0) 
                    onWindowResize();
                else
                    debounce(onWindowResize, scope.debounceWait || 250);      
                // onWindowResize();
                
                // returns a fn that will trigger 'time' amount after it stops getting called.
                function debounce(fn, time) {
                    $timeout(fn, time);                    
                }
                
                function onWindowResize() {
                    var footerElement = angular.element($document[0].getElementById(scope.footerElementId));
                    var footerElementHeight;

                    if (footerElement.length === 1) {
                        footerElementHeight = footerElement[0].offsetHeight
                              + getTopMarginAndBorderHeight(footerElement)
                              + getBottomMarginAndBorderHeight(footerElement);
                    } else {
                        footerElementHeight = 0;
                    }

                    var elementOffsetTop = element[0].offsetTop;
                    var elementBottomMarginAndBorderHeight = getBottomMarginAndBorderHeight(element);

                    var additionalPadding = scope.additionalPadding || 0;

                    var elementHeight = $window.innerHeight
                                        - elementOffsetTop
                                        - elementBottomMarginAndBorderHeight
                                        - footerElementHeight
                                        - additionalPadding;
                    element.css('height', elementHeight + 'px');
                    element.css('overflow-y', 'auto');
                }

                function getTopMarginAndBorderHeight(element) {
                    var footerTopMarginHeight = getCssNumeric(element, 'margin-top');
                    var footerTopBorderHeight = getCssNumeric(element, 'border-top-width');
                    return footerTopMarginHeight + footerTopBorderHeight;
                }

                function getBottomMarginAndBorderHeight(element) {
                    var footerBottomMarginHeight = getCssNumeric(element, 'margin-bottom');
                    var footerBottomBorderHeight = getCssNumeric(element, 'border-bottom-width');
                    return footerBottomMarginHeight + footerBottomBorderHeight;
                }

                function getCssNumeric(element, propertyName) {
                    return parseInt(element.css(propertyName), 10) || 0;
                }
            }
        };
    }]);
   