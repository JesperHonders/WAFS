/*global console, alert, $, window, document*/

// SCRIPT.JS

(function () {
    'use strict';
    
    var app = {
        init: function () {
            routes.init();
        },
        config: {
            defaultPage: function (args) {
                if (!args || args === "") {
                    return 1;
                } else if (args) {
                    return args;
                }
            }
        }
    };
        
    var routes = {
        init: function () {
            window.location.hash = '1';
            window.addEventListener('hashchange', function (event) {
                var route = window.location.hash;
                sections.toggle(route);
            });
        }
    };
    
    var sections = {
        toggle: function (route) {
            var section = document.querySelectorAll('section'),
                links = document.querySelectorAll('nav ul li a'),
                routeSplit = route.split('#');

            Array.prototype.forEach.call(section, function (section) {
                // The forEach() method executes a provided function once per array element.
                // The call() method calls a function with a given this value and arguments provided individually.
                section.classList.remove('active');
            });

            document.getElementById(routeSplit[1]).classList.add('active');
        }
    };
    
    app.init();
    
}());