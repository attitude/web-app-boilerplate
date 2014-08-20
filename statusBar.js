/*! statusBar.js v0.2.0 | (c) 2014 Martin Adamko | Licence MIT */
/*jslint browser: true*/
(function(window) {
    var debug = window.location.search.match(/[\?&]debug-standalone=true/),
        isiOS = !!window.navigator.userAgent.match(/(iPad|iPhone|iPod)/),
        iOSVersion = null,
        // The Status Bar object
        StatusBar = {
        	running: false,
            active: null,
            offset: 0,
            // Cache screen size since on iOS device has fixed screen size
            screen: {
                height: window.screen.height,
                width:  window.screen.width,
                orientation: {}
            },
            init: function() {
                if (debug) window.console.log('Initialize');

                StatusBar.running = true;

                // Apply html.standalone class
                if (StatusBar.prototype.htmlClasses.standalone) {
                    window.document.body.parentElement.classList.add(StatusBar.prototype.htmlClasses.standalone);
                }

                // Attach event listener to listen for a change event trigger
                window.addEventListener(StatusBar.prototype.changeEventName, StatusBar.update, false);

                // Run first time
                StatusBar.update();
            },
            update: function() {
                // Set screen orientation
                StatusBar.screen.orientation = window.innerHeight > window.innerWidth ? {
                    display: 'portrait',
                    vertical: true,
                    horizontal: false
                } : {
                    display: 'landscape',
                    vertical: false,
                    horizontal: true
                };

                // In vertical orientation
                if (StatusBar.screen.orientation.vertical) {
                    // Is not active, when window fills the screen
                    StatusBar.active = !(
                        window.innerHeight === StatusBar.screen.height &&
                        window.innerWidth  === StatusBar.screen.width
                    );

                    // Offset can be only 20px or 0 when the status bar is active
                    StatusBar.offset = StatusBar.active ? 0 : 20;
                } else {
                    // Is not active, when window fills the screen, but
                    // in horizontal position, window.innerHeight fits screen.width
                    StatusBar.active = !(
                        window.innerHeight === StatusBar.screen.width &&
                        window.innerWidth  === StatusBar.screen.height
                    );

                    // Offset can be only 20px; Since iOS 8 however the landspape mode
                    // runs as fullscreen without the status bar visible
                    StatusBar.offset = iOSVersion >= 8 ? 0 : 20;
                }

                if (debug) window.console.log('StatusBar active:', StatusBar.active);

                // Toggle the html class based on the calculated offset
                StatusBar.prototype.toggleClass(StatusBar.offset);

                // Trigger the Status Bar Changed event
                StatusBar.prototype.triggerEvent();
            },
            prototype: {
                changeEventName: 'resize',
                triggerEventName: 'statusbarchange',
                htmlClasses: {
                    statusbar: 'standalone-statusbar-active',
                    standalone: 'standalone'
                },
                ignoreVersion: false,
                triggerEvent: function() {
                    var e = window.document.createEvent('Event');

                    e.initEvent(this.triggerEventName, true, false);
                    window.dispatchEvent(e);
                },
                toggleClass: function(size) {
                    if (!this.htmlClasses.statusbar) {
                        return;
                    }

                    if (!size) {
                        window.document.body.parentElement.classList.remove(this.htmlClasses.statusbar);

                        return;
                    }

                    window.document.body.parentElement.classList.add(this.htmlClasses.statusbar);
                }
            }
        };

    // Run only in standalone mode
    if (debug || (typeof window.navigator.standalone === 'boolean' && window.navigator.standalone === true)) {
        // This code is required only for iOS
        if (isiOS) {
            // Sniff the version from the User Agent string
            iOSVersion = window.navigator.userAgent.match(/\w+\s+OS\s+(\d)/);
            iOSVersion = iOSVersion ? parseInt(iOSVersion[1], 10) : 0;
            if (debug) window.console.log('iOS v', iOSVersion);

            // Was not able to test version of iOS < 4.3.2
            if (iOSVersion >= 4 || StatusBar.prototype.ignoreVersion) {
                // Activating on document ready should leave room to modify any settings
                window.document.onreadystatechange = function() {
                    if (window.document.readyState == "complete") {
                        if (debug) window.console.info('StatusBar: Document ready initialise...');

                        // Initialize for the first time
                        StatusBar.init();
                    }
                };

				// Fallback for iOS 4
                if (!StatusBar.running) {
                	if (debug) window.console.info('StatusBar: Window load initialise...');

                    // Initialize for the first time
                    window.addEventListener('load', StatusBar.init, false);
				}
            }

            // Export as global object
            window.StatusBar = StatusBar;
        }
    }
}(window));
