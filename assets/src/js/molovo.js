/* jshint browser: true */
/* global Hogan, NProgress, echo */
( function () {
  "use strict";

  var Molovo = {

    /**
     * Start your engines!
     */
    init: function () {

      var self = this;

      self.events.lazyLoaders.init();

      setTimeout( function () {
        self.events.bindListeners();
      }, 250 );

      window.userHasScrolled = false;
    },

    /**
     * Event bindings live here
     */
    events: {

      /**
       * Setup event listeners across the site, calling their respective events
       */
      bindListeners: function () {

        document.getElementById( "work-link" ).addEventListener( "click", this.openWorkMenu );

        if ( document.body.classList.contains( "home" ) ) {
          document.getElementById( "workLink" ).addEventListener( "click", this.openWorkMenu );
        }

        window.addEventListener( "mousemove", this.mouseOverHeader );

        this.bindScrollListeners();
        this.checkPageVisibility();
      },

      /**
       * Show the header if the users cursor is within 100px of it
       */
      mouseOverHeader: function ( evt ) {
        var header = document.querySelector( ".fixed" );

        evt = evt || window.event;

        if ( evt.clientY < 100 ) {
          header.classList.remove( "scrolled" );
        }
      },

      /**
       * Open the "Work" menu
       */
      openWorkMenu: function ( evt ) {
        var tmp = document.getElementById( "work-link" ),
          act = tmp.querySelector( ".lines-button" ).classList,
          target = document.querySelector( ".fixed" ).classList;

        evt = evt || window.event;

        evt.preventDefault();

        // Make sure the menu is visible
        target.remove( "scrolled" );

        if ( target.contains( "open" ) ) {
          // Switch the icon
          act.remove( "close" );

          // Close the menu
          target.remove( "open" );

          // Re-enable scrolling on the body
          document.body.style.overflow = "auto";
          document.body.style.marginTop = 0;

          // Return to the scroll position before the menu was opened
          window.pageYOffset = window.saved_scroll_position;
        } else {
          // Switch the icon
          act.add( "close" );

          // Open the menu
          target.add( "open" );

          // Disallow scrolling on the body
          document.body.style.overflow = "hidden";
        }

        return false;
      },

      /**
       * We have a number of different functions running on scroll
       */
      bindScrollListeners: function () {
        var self = this,
          scroll_pos = 0,
          header = document.querySelector( ".fixed" ),
          transparent = header.classList.contains( "transparent" ),
          scroll_time, track_events, current_scroll;

        window.addEventListener( "scroll", function () {
          clearTimeout( scroll_time );
          clearTimeout( track_events );

          current_scroll = window.saved_scroll_position = window.pageYOffset;

          self.scrollHeader( header, current_scroll, scroll_pos );

          if ( transparent ) {
            self.setHeaderBg( header, current_scroll );
          }

          scroll_time = setTimeout( function () {
            scroll_pos = window.pageYOffset;
          }, 50 );

          if ( !window.userHasScrolled ) {
            Molovo.events.lazyLoaders.caseStudy();
            window.userHasScrolled = true;
          }

          if ( window.trackingScrollEvents ) {
            return;
          }

          window.trackingScrollEvents = true;
        } );
      },

      checkPageVisibility: function () {
        var hidden = "hidden";

        // Standards:
        if ( hidden in document )
          document.addEventListener( "visibilitychange", this.updatePageTitle );
        else if ( ( hidden = "mozHidden" ) in document )
          document.addEventListener( "mozvisibilitychange", this.updatePageTitle );
        else if ( ( hidden = "webkitHidden" ) in document )
          document.addEventListener( "webkitvisibilitychange", this.updatePageTitle );
        else if ( ( hidden = "msHidden" ) in document )
          document.addEventListener( "msvisibilitychange", this.updatePageTitle );
        // IE 9 and lower:
        else if ( "onfocusin" in document )
          document.onfocusin = document.onfocusout = this.updatePageTitle;
        // All others:
        else
          window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this.updatePageTitle;
      },

      updatePageTitle: function ( evt ) {
        var v = window.pageTitle,
          h = "I Miss You! ❤",
          evtMap = {
            focus: v,
            focusin: v,
            pageshow: v,
            blur: h,
            focusout: h,
            pagehide: h
          };

        evt = evt || window.event;

        if ( evt.type in evtMap ) {
          document.title = evtMap[ evt.type ];
        } else {
          if ( document.hidden ) {
            document.title = h;
          } else {
            document.title = v;
          }
        }
      },

      scrollHeader: function ( target, current_scroll, scroll_pos ) {

        if ( current_scroll <= scroll_pos - 25 || current_scroll <= 0 ) {
          // If the user is scrolling UP, show the header
          target.classList.remove( "scrolled" );
        } else if ( current_scroll > scroll_pos + 25 && current_scroll >= 100 ) {
          // If the user is scrolling DOWN, hide the header
          target.classList.add( "scrolled" );
        }

      },

      /**
       * Removes the transparent background from the header
       * if the user has scrolled far enough
       */
      setHeaderBg: function ( target, current_scroll ) {

        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, // Get the window height, cross-browser
          busyHeader = document.querySelector( ".contact-header" ) || document.querySelector( ".intro" ),
          top = busyHeader ? busyHeader.clientHeight : screenHeight;

        if ( current_scroll > top ) {
          target.classList.remove( "transparent" );
        } else {
          target.classList.add( "transparent" );
        }

      },

      lazyLoaders: {

        /**
         * Initialize all the lazy loaders
         */
        init: function () {
          this.fonts();
          this.colorSwatches();

          // if ( document.body.classList.contains( "blog" ) ) {
          //   this.ads();
          // }

          // Initialize echo.js here for lazy loading images
          echo.init( {
            offset: 100,
            throttle: 250,
            unload: false,
            debounce: false
          } );
        },

        fonts: function () {
          function addFont() {
            var style = document.createElement( "style" );
            style.rel = "stylesheet";
            document.head.appendChild( style );
            style.textContent = localStorage.gauthier;
          }

          try {
            if ( localStorage.gauthier ) {
              // The font is in localStorage, we can load it directly
              addFont();
            } else {
              // We have to first load the font file asynchronously
              var request = new XMLHttpRequest();
              request.open( "GET", "/assets/fonts/gauthier_fy/molovo.css", true );

              request.onload = function () {
                if ( request.status >= 200 && request.status < 400 ) {
                  // We save the file in localStorage
                  localStorage.gauthier = request.responseText;

                  // ... and load the font
                  addFont();
                }
              };

              request.send();
            }
          } catch ( ex ) {
            // maybe load the font synchronously for woff-capable browsers
            // to avoid blinking on every request when localStorage is not available
            var link = document.createElement( "link" );
            link.rel = "stylesheet";
            link.href = "/assets/fonts/gauthier_fy/molovo.css";
            document.head.appendChild( link );
          }
        },

        ads: function () {
          var ads = document.querySelectorAll( ".ad-container a" ), // Grab all the ads
            num = Math.floor( ( Math.random() * ads.length ) + 1 ) - 1, // We grab a random number
            ad = ads[ num ], // And use as an array index
            x = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, // Get the window width, cross-browser
            screenSize, image;

          // Display the ad
          ad.style.display = "inline-block";

          window.onresize = function () {
            // We rework screen size when the resize happens
            x = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            // Set the screen size variables based on the em values in the CSS
            screenSize = x > ( 51 * 1.3125 * 16 ) ? "large" : x > ( 36 * 16 ) ? "medium" : "small";

            // Find the right image for the screen size
            image = ad.querySelector( "img[data-screen-size=\"" + screenSize + "\"]" );

            // Update the src if it hasn't been done already
            // This check stops it being set more than once (resulting in multiple requests)
            if ( image.src !== image.getAttribute( "data-src" ) )
              image.src = image.getAttribute( "data-src" );
          };

          // Fire a resize event on first load
          window.onresize();
        },

        /**
         * Set up color swatches in case studies
         */
        colorSwatches: function () {

          var swatches = document.querySelectorAll( ".swatch" ),
            act, color, isDark, i;

          if ( !swatches ) return false;

          for ( i = 0; i < swatches.length; i++ ) {
            act = swatches[ i ];

            // Find the color, and remove escape characters
            color = act.getAttribute( "data-color" ).replace( "\\", "" );

            // Update the attribute with new non-escaped color string
            act.setAttribute( "data-color", color );

            // Set it as the elements background
            act.style.background = color;

            // See if the color for this swatch is light or dark
            isDark = ( parseInt( color.replace( "#", "" ), 16 ) > 0xffffff / 1.25 );

            // Set a font color to provide contrast
            act.classList.add( isDark ? "light" : "dark" );
          }
        },

        getFile: function ( filename, callback ) {

          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            callback( this.responseText );
          };
          xhr.open( "GET", filename );
          xhr.responseType = "text";
          xhr.send();

        },

        getCaseStudies: function ( callback ) {
          return this.getFile( "/case-studies.json", callback );
        },

        caseStudy: function () {
          this.getCaseStudies( function ( data ) {
            var caseStudies = JSON.parse( data ),
              num = Math.floor( Math.random() * caseStudies.length ),
              act = document.getElementById( "featured-case-study" ),
              template = document.getElementById( "case-study-template" ),
              compiled = Hogan.compile( template.innerHTML ),
              context = caseStudies[ num ],
              html;

            if ( location.href.indexOf( context.slug ) > -1 ) {
              context = caseStudies[ num === ( num.length - 1 ) ? 0 : num++ ];
            }

            html = compiled.render( context );
            act.innerHTML = html;
            act.style.backgroundImage = "url(/assets/dist/img/case-studies/" + context.slug + "/bg.jpg)";
          } );
        }

      },
    },

    progress: {
      start: function () {
        NProgress.start();
      },

      remove: function () {
        NProgress.remove();
      },

      done: function () {
        NProgress.done();
        Molovo.init();
      }
    }

  };

  // document.addEventListener( "DOMContentLoaded", Molovo.init() );

  document.addEventListener( "page:fetch", Molovo.progress.start );
  document.addEventListener( "page:restore", Molovo.progress.remove );
  document.addEventListener( "page:change", Molovo.progress.done );
  document.addEventListener( "page:load", Molovo.progress.done() );
} )();