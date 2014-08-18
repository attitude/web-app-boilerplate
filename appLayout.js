/*jslint browser: true*/
/*! appLayout.js v0.0.3 | (c) 2014 Martin Adamko | Licence MIT */
(function(window, eventName) {
    var debug = window.location.search.match(/[\?&]debug-app-layout=true/) ? true : false,
        document,
        console,
        body,
        // Extend a given object with all the properties in passed-in object(s).
        // source: https://raw.githubusercontent.com/lodash/lodash/2.4.1/dist/lodash.underscore.js
        extend = function(object) {
            if (!object) {
                return object;
            }
            for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
                var iterable = arguments[argsIndex];
                if (iterable) {
                    for (var key in iterable) {
                        object[key] = iterable[key];
                    }
                }
            }
            return object;
        },
        AppLayout = function() {
            this.settings = {};
            this.init = function() {
                this.content = window.document.getElementById(this.settings.content);
                if (!this.content) {
                    if (debug) console.warn('AppLayout: Content element  #' + this.settings.content + '  missing.');
                    
                    return;
                }
                
                this.header = window.document.getElementById(this.settings.header);
                this.headerContainer = this.header ? this.header.getElementsByClassName(this.settings.containers) : null;
                
                if (this.headerContainer) {
                    this.headerContainer = this.headerContainer[0];
                } else {
                    if (debug) console.info('AppLayout: Header element #' + this.settings.header + ' is missing');
                }


                this.footer = window.document.getElementById(this.settings.footer);
                this.footerContainers = this.footer ? this.footer.getElementsByClassName(this.settings.containers) : null;
                if (this.footerContainers) {
                    this.footerContainers = this.footerContainers[0];
                } else {
                    if (debug) console.info('AppLayout: Footer element  #' + this.settings.footer + '  missing.');
                }


                this.update();
            };
            this.update = function() {
                var h, i, l;

                if (debug) console.info(this);

                // Nothing to do
                if (!this.content) return;

                // Udate padding for header
                if (this.header) {
                    h = parseInt(this.header.offsetHeight);

                    // Add padding so that when hiding header while scrolling is possible
                    if (this.content.style.paddingTop != h + 'px') {
                        this.content.style.paddingTop = h + 'px';
                    }

                    if (this.headerContainer) {
                        this.content.parentElement.classList.remove(
                            this.settings.content + '-' + this.settings.header + '-' + AppLayouts.prototype.className
                        );

                        if (this.headerContainer.offsetWidth > this.headerContainer.parentElement.offsetWidth) {
                            body.parentElement.classList.add(
                                this.settings.content + '-' + this.settings.header + '-' + AppLayouts.prototype.className
                            );
                        }
                    }
                }

                // Udate padding for footer
                if (this.footer) {
                    h = parseInt(this.footer.offsetHeight);

                    // Add padding so that when hiding header while scrolling is possible
                    if (this.content.style.paddingBottom != h + 'px') {
                        this.content.style.paddingBottom = h + 'px';
                    }

                    if (this.footerContainer) {
                        this.content.parentElement.classList.remove(
                            this.settings.content + '-' + this.settings.footer + '-' + AppLayouts.prototype.className
                        );

                        if (this.footerContainer.offsetWidth > this.footerContainer.parentElement.offsetWidth) {
                            body.parentElement.classList.add(
                                this.settings.content + '-' + this.settings.footer + '-' + AppLayouts.prototype.className
                            );
                        }
                    }
                }
                if (debug) console.info('AppLayout: Layout instance updated');
            };
        },
        AppLayouts = {
            items: [],
            create: function(options) {
                // Create new object
                var v = new AppLayout();

                if (debug) console.info('AppLayout: Create(options: ', options, ')');

                // Define settings
                v.settings = extend(this.prototype.defaults, options);
                // Run firs time
                v.init();
                // Add to array
                AppLayouts.items.push(v);
                // return current object
                return v;
            },
            update: function() {
                if (debug) console.info('AppLayout: Update all instances...');
                
                var i, l = AppLayouts.items.length;

                for (i = 0; i < l; i += 1) {
                    AppLayouts.items[i].update();
                }
            },
            prototype: {
                defaults: {
                    // Expecting IDs
                    header: 'header',
                    content: 'content',
                    footer: 'footer',
                    // Expecting class
                    containers: 'container'
                },
                eventName: 'resize',
                className: 'collapsed'
            }
        };

    document = window.document;
    body = document.body;
    console = window.console;

    if (debug) console.time('AppLayout Init');

    // Activating on document ready should leave room to modify any settings
    window.document.onreadystatechange = function() {
        if (window.document.readyState == "complete" && AppLayouts.items.length === 0) {
            if (debug) console.info('AppLayout: Document ready initialise...');
            AppLayouts.create();
        }
    };

    window.addEventListener(AppLayouts.prototype.eventName, function() {
        if (debug) {
            console.time('AppLayout Change');
            console.info('AppLayout: Change event...');
        }

        AppLayouts.update();
        
        if (debug) console.timeEnd('AppLayout Change');
    }, false);

    if (debug) console.info('AppLayout: Start...');

    // Export globally
    window.AppLayouts = AppLayouts;
    
    if (debug) console.timeEnd('AppLayout Init');
}(window));
