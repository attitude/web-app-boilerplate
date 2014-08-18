/*! appLayout.js v0.0.1 | (c) 2014 Martin Adamko | Licence MIT */
/*jslint browser: true*/
(function(window, document, body, eventName, bodyClass) {
    var pageHeaderElement = document.getElementById('view-header'),
        pageHeaderContainer = document.getElementsByClassName('page-header-inner-container'),
        i;

    window.addEventListener(eventName, function(e) {
        var h,
            el;

        // Need to remove the class, so the default CSS kicks in, otherwise calculation's not right
        body.parentElement.classList.remove(bodyClass);

        // Test for menu too wide
        for (i = 0; i < pageHeaderContainer.length; i++) {
            if (pageHeaderContainer[i].offsetWidth > pageHeaderContainer[i].parentElement.offsetWidth) {
                body.parentElement.classList.add(bodyClass);
            }
        }

        // Push content down with padding
        if (pageHeaderElement.nextElementSibling.classList.contains('page-content')) {
            el = pageHeaderElement.nextElementSibling;
        } else if (pageHeaderElement.previousElementSibling.classList.contains('page-content')) {
            el = pageHeaderElement.previousElementSibling;
        }

        h = parseInt(pageHeaderElement.offsetHeight);

        // Add padding so that when hiding header while scrolling is possible
        if (el.style.paddingTop != h + 'px') {
            el.style.paddingTop = h + 'px';
        }
    }, false);
}(window, window.document, window.document.body, 'mediaexperiencechanged', 'has-extra-navigation'));
