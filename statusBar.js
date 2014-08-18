/*! statusBar.js v0.1.0 | (c) 2014 Martin Adamko | License: MIT */
/*jslint browser: true*/
(function(window, screen, document, body) {
    'use strict';
    var webViewHead,
        webViewLayers,
        webViewLayersLength,
        statusHeight,
        statusHeightDifference,
        debug = window.location.search.match(/[\?&]debug-standalone=true/) ? true : false,
        topOffset = function() {
            var i;

            // Fix iOS scrolling out of view when landscape
            body.scrollTop = 0;

            // Portrait mode
            if (window.innerHeight > window.innerWidth) {
                statusHeight = window.innerHeight - screen.availHeight;
            } else {
                statusHeight = window.innerWidth - screen.availHeight;
            }

            if (statusHeight <= 0) {
                statusHeight = 0;
            }

            // webViewHead.style.marginTop  = -statusHeightDifference + 'px';
            webViewHead.style.paddingTop = statusHeight + 'px';
            for (i = 0; i < webViewLayersLength; i += 1) {
                webViewLayers[i].style.paddingTop = statusHeight + 'px';
            }
        },
        init = function() {
            // Apply standalone class the HTML tag
            body.parentElement.classList.add('standalone');
            // Fix iOS scrolling out of view when landscape
            body.scrollTop = 0;

            // View header element
            webViewHead = document.getElementById('view');
            // View layer elements like modals etc.
            webViewLayers = document.getElementsByClassName('view-layer');
            // Cache length
            webViewLayersLength = webViewLayers.length;
        };

    if (debug || (typeof window.navigator.standalone === 'boolean' && window.navigator.standalone)) {
        init();

        // Calculate & apply top margin when in standalone
        window.addEventListener('mediaexperiencechanged', function(e) {
            topOffset();
        });
    }
}(window, window.screen, document, window.document.body));
