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
                var i, l, el;

                // Set empty array
                this.content = [];

                // Allow passing of multiple ids on content elements...
                this.settings.content = this.settings.content.replace(/[\#\s]+/g, '').split(',');
                l = this.settings.content.length;

                for (i = 0; i < l; i += 1) {
                    el = window.document.getElementById(this.settings.content[i]);

                    if (el) {
                        this.content.push(el);
                    }
                }

                if (!this.content[0]) {
                    if (debug) console.warn('AppLayout: Content element(s) #' + this.settings.content.join(', #') + '  missing.');

                    return;
                }

                this.header = window.document.getElementById(this.settings.header.replace(/#/, ''));
                this.headerContainer = this.header ? this.header.getElementsByClassName(this.settings.containers.replace(/\./g, '')) : null;

                if (this.headerContainer) {
                    this.headerContainer = this.headerContainer[0];
                } else {
                    if (debug) console.info('AppLayout: Header element #' + this.settings.header + ' is missing');
                }

                this.footer = window.document.getElementById(this.settings.footer.replace(/#/, ''));
                this.footerContainers = this.footer ? this.footer.getElementsByClassName(this.settings.containers.replace(/\./g, '')) : null;
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
                if (!this.content[0]) return;

                l = this.content.length;

                // Udate padding for header
                if (this.header) {
                    h = parseInt(this.header.offsetHeight);

                    if (this.settings.isDefaultView && typeof window.StatusBar === 'object') {
                        h -= window.StatusBar.offset;
                    }

                    for (i = 0; i < l; i += 1) {
                        // Offset top for default view/layout
                        if (this.settings.isDefaultView && typeof window.StatusBar === 'object') {
                            this.content[i].style.top = window.StatusBar.offset + 'px';
                        }

                        // Add padding so that when hiding header while scrolling is possible
                        if (this.content[i].style.paddingTop != h + 'px') {
                            this.content[i].style.paddingTop = h + 'px';
                        }

                        if (this.headerContainer) {
                            this.content[i].parentElement.classList.remove(
                                this.settings.content + '-' + this.settings.header + '-' + AppLayouts.prototype.className
                            );

                            if (this.headerContainer.offsetWidth > this.headerContainer.parentElement.offsetWidth) {
                                body.parentElement.classList.add(
                                    this.settings.content + '-' + this.settings.header + '-' + AppLayouts.prototype.className
                                );
                            }
                        }
                    }
                }

                // Udate padding for footer
                if (this.footer) {
                    h = parseInt(this.footer.offsetHeight);

                    for (i = 0; i < l; i += 1) {
                        // Add padding so that when hiding header while scrolling is possible
                        if (this.content[i].style.paddingBottom != h + 'px') {
                            this.content[i].style.paddingBottom = h + 'px';
                        }

                        if (this.footerContainer) {
                            this.content[i].parentElement.classList.remove(
                                this.settings.content + '-' + this.settings.footer + '-' + AppLayouts.prototype.className
                            );

                            if (this.footerContainer.offsetWidth > this.footerContainer.parentElement.offsetWidth) {
                                body.parentElement.classList.add(
                                    this.settings.content + '-' + this.settings.footer + '-' + AppLayouts.prototype.className
                                );
                            }
                        }
                    }
                }
                if (debug) console.info('AppLayout: Layout instance updated');
            };
        },
        AppLayouts = {
            running: false,
            items: [],
            create: function(options) {
                // Create new object
                var v = new AppLayout();

                AppLayouts.running = true;

                if (debug) console.info('AppLayout: Create(options: ', options, ')');

                // Define settings
                v.settings = extend(AppLayouts.prototype.defaults, options);
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
                    // #id of header
                    header: '#header',
                    // #id of content elements divided by ’,’ character
                    content: '#content',
                    // #id of footer
                    footer: '#footer',
                    // Expecting one class
                    containers: '.container',
                    // Special option to add 20px more using the window.StatusBar object
                    isDefaultView: false
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
            AppLayouts.create({
                isDefaultView: true
            });
        }
    };

    window.addEventListener(AppLayouts.prototype.eventName, function() {
        if (debug) {
            console.time('AppLayout Change');
            console.info('AppLayout: Change event...');
        }

        setTimeout(AppLayouts.update, 100);

        if (debug) console.timeEnd('AppLayout Change');
    }, false);

    window.addEventListener('load', function() {
        // Fallback for iOS 4
        if (!AppLayouts.running) {
            if (debug) window.console.log('AppLayout: Window loaded...');
            AppLayouts.create({
                isDefaultView: true
            });
        }
    }, false);

    if (debug) console.info('AppLayout: Start...');

    // Export globally
    window.AppLayouts = AppLayouts;

    if (debug) console.timeEnd('AppLayout Init');
}(window));
