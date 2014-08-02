/* global ga:false */

(function (window, undefined) {

    var document = window.document;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // | Google Universal Analytics                                            |
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function handleClickEvent(e) {

        var action;
        var category;
        var label;
        var $target = hasAttr(e.target, 'data-ga-action');
        var url;
        var value;

        if ( $target !== undefined ) {

            action = $target.getAttribute('data-ga-action') || undefined;     // required
            category = $target.getAttribute('data-ga-category') || undefined; // required
            label = $target.getAttribute('data-ga-label') || undefined;
            url = $target.getAttribute('href');
            value = parseInt($target.getAttribute('data-ga-value'), 10) || undefined;

            if ( ga !== undefined &&
                 category !== undefined &&
                 action !== undefined ) {

                // Handle outbound links manually to ensure that
                // they are registered with Google Analytics
                e.preventDefault();

                // 1. Ensure that `Download` links work as intended

                //    The `Download` links aren't directing the user away
                //    from the page. So, using `window.location.href` in this
                //    case may cause unwanted problems. E.g: If the user clicks
                //    on a `Download` link before all the page's content is
                //    downloaded, the browser will abort any remaining downloads.
                //    This happens because the browser considers that it no
                //    longer needs to download anything from this page, and
                //    should start downloading the next page and its content.

                //    Also, the following is done here, and not in `hitCallback`,
                //    so that it prevents the browser popup blocking behavior

                if ( category === 'Download' ) {
                    window.open(url);
                }

                (function (url) {

                    var timeout;

                    // Register the event
                    ga('send', 'event', category, action, label, value, {
                        // 2. Ensure that `Outbound links` are registered before
                        //    navigating away from the current page
                        //    https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#hitCallback
                        'hitCallback': function () {
                            if ( category === 'Outbound links' ) {
                                if ( timeout !== undefined ) {
                                    clearTimeout(timeout);
                                }
                                window.location.href = url;
                            }
                        }
                    });

                    // In case `hitCallback` takes to long
                    timeout = setTimeout(function () {
                        if ( category === 'Outbound links' ) {
                            window.location.href = url;
                        }
                    }, 1000);

                }(url));

            }
        }
    }

    // Check if an element or any of its parents has the specified attribute
    function hasAttr(element, attribute) {

        if ( element.hasAttribute(attribute) === true ) {
            return element;
        } else if ( element.parentNode !== document.body ) {
            return hasAttr(element.parentNode, attribute);
        }

        return undefined;
    }

    // More information about the Google Universal Analytics:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/
    // http://mathiasbynens.be/notes/async-analytics-snippet#universal-analytics

    function loadGoogleAnalytics() {

        /* jshint ignore:start */
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='//www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        /* jshint ignore:end */

        // Create tracker object
        ga('create', 'UA-17904194-1');

        // Send a page view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
        ga('send', 'pageview');

        // Track events
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        document.querySelector('body').addEventListener('click', handleClickEvent);

    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // | Twitter                                                               |
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Tweet Buttons
    // https://dev.twitter.com/docs/tweet-button

    function loadTweetButtons() {
        /* jshint ignore:start */
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='http://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');
        /* jshint ignore:end */
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // loadGoogleAnalytics();
    window.onload = loadTweetButtons;

}(window));
