/* jshint browser: true */
/* global ss, Hogan */
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

      // Initialize buggyfill to fix vh and vw units on iOS
      window.viewportUnitsBuggyfill.init();

      // Initialize smoothscroll.js
      ss.fixAllLinks();

      // Init Google Analytics
      window.ga = function () {
        window.ga.q.push( arguments )
      };
      ga.q = [];
      ga.l = +new Date;
      ga( 'create', 'UA-61791620-1', {
        'cookieDomain': 'molovo.co',
        'cookieExpires': 60 * 60 * 24 * 28 // Time in seconds.
      } );
      ga( 'send', 'pageview' )

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
        if ( document.querySelector( "a[title=\"Open Work Menu\"]" ) ) {
          document.querySelector( "a[title=\"Open Work Menu\"]" ).addEventListener( "click", this.openWorkMenu );
        }

        document.querySelector( ".work" ).addEventListener( "scroll", this.headerScrollListener );

        if ( document.body.classList.contains( "home" ) ) {
          document.getElementById( "workLink" ).addEventListener( "click", this.openWorkMenu );
        }

        if ( document.body.classList.contains( "contact" ) ) {
          document.getElementById( "project-type" ).onchange = function () {
            document.getElementById( "linkToContactForm" ).click();
            document.getElementById( "name" ).focus();
          };
        }

        window.addEventListener( "mousemove", this.mouseOverHeader );

        this.bindScrollListeners();
        this.checkPageVisibility();

        if ( document.body.classList.contains( "contact" ) ) {
          this.bindFormListeners();
        }
      },

      headerScrollListener: function () {
        var list = document.querySelector( ".work" ),
          items = document.querySelectorAll( ".work li" );
        clearTimeout( window.isScrollingWorkList );

        for ( var i = items.length - 1; i >= 0; i-- ) {
          items[ i ].style.pointerEvents = "none";
        }

        window.isScrollingWorkList = setTimeout( function () {
          for ( var i = items.length - 1; i >= 0; i-- ) {
            items[ i ].style.pointerEvents = "auto";
          }
        }, 50 );
      },

      /**
       * Show the header if the users cursor is within 100px of it
       */
      mouseOverHeader: function ( event ) {
        var header = document.querySelector( ".fixed" );

        event = event || window.event;

        if ( event.clientY < 100 ) {
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

      bindFormListeners: function () {
        var self = this,
          fields = document.querySelectorAll( ".contact-form input, .contact-form textarea" );

        if ( fields.length < 1 ) return false;

        for ( var i = fields.length - 1; i >= 0; i-- ) {
          /* jshint loopfunc: true */
          fields[ i ].addEventListener( "change", function ( event ) {
            self.recordFormFieldFilled( event );
          } );
        }
      },

      recordFormFieldFilled: function ( event ) {
        var act = event.target;

        if ( window.filledFormFields[ act.name ] ) return;
        if ( !act.value ) return;

        window.filledFormFields[ act.name ] = true;
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

      ctaOnScroll: function ( current_scroll ) {
        var act = document.querySelector( ".call-to-action" ),
          top = document.querySelector( ".intro" ).clientHeight;

        if ( current_scroll > top ) {
          act.classList.add( "position-fixed" );
        } else {
          act.classList.remove( "position-fixed" );
        }
      },

      getContentContainer: function () {
        var container = document.body;

        if ( document.body.classList.contains( "blog" ) ) {
          container = document.querySelector( ".post-main .post" ) || document.querySelector( ".post-list li:first-of-type" );
        }

        if ( document.body.classList.contains( "home" ) ) {
          container = document.querySelector( ".about" );
        }

        return container;
      },

      getContentContainerBottom: function () {
        var container = this.getContentContainer();
        return container.getBoundingClientRect().top + container.clientHeight;
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
          this.colorSwatches();
          this.caseStudy();

          if ( document.body.classList.contains( "blog" ) ) {
            this.ads();
          }

          if ( document.body.classList.contains( "home" ) ) {
            this.callToAction();
          }

          // Initialize echo.js here for lazy loading images
          echo.init( {
            offset: 100,
            throttle: 250,
            unload: false,
            debounce: false,
            callback: function ( element, op ) {
              console.log( element, 'has been', op + 'ed' )
            }
          } );
        },

        ads: function () {
          var ads = document.querySelectorAll( '.ad-container a' ), // Grab all the ads
            num = Math.floor( ( Math.random() * ads.length ) + 1 ) - 1, // We grab a random number
            ad = ads[ num ], // And use as an array index
            x = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, // Get the window width, cross-browser
            screenSize, image;

          // Display the ad
          ad.style.display = 'inline-block';

          window.onresize = function () {
            // We rework screen size when the resize happens
            x = window.innerWidth || document.documentElement.clientWidth || d.body.clientWidth;

            // Set the screen size variables based on the em values in the CSS
            screenSize = x > ( 51 * 1.3125 * 16 ) ? 'large' : x > ( 36 * 16 ) ? 'medium' : 'small';

            // Find the right image for the screen size
            image = ad.querySelector( 'img[data-screen-size="' + screenSize + '"]' );

            // Update the src if it hasn't been done already
            // This check stops it being set more than once (resulting in multiple requests)
            if ( image.src !== image.getAttribute( 'data-src' ) )
              image.src = image.getAttribute( 'data-src' );
          }

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

        getCallsToAction: function ( callback ) {
          return this.getFile( "/calls-to-action.json", callback );
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
              context = caseStudies[ num++ ];
            }

            html = compiled.render( context );
            act.innerHTML = html;
            act.setAttribute( 'data-echo-background', "/assets/dist/img/case-studies/" + context.slug + "/bg.jpg" );
          } );
        },

        callToAction: function () {
          this.getCallsToAction( function ( data ) {
            var callsToAction = JSON.parse( data ),
              num = Math.floor( Math.random() * callsToAction.length ),
              context = callsToAction[ num ],
              act = document.getElementById( "call-to-action" ).getElementsByTagName( "p" )[ 0 ];

            act.innerHTML = context;
          } );
        }

      },
    }

  };

  Molovo.init();
} )();