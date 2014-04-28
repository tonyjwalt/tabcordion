/**
 * Creates a tab / accordion system based on the available width
 * needs CSS to swap viewable sections based on media query to avoid heavy window resize event
 * putting display:none !important; and display:block !important; on the tab display container
 *
 * @author Tony Walt <tony.walt@effectiveui.com>
 */
// make sure required JavaScript modules are loaded
if (typeof jQuery === "undefined") {
  throw "This widget requires jquery module to be loaded";
}
//Requires JQUERY, JQUERYUI - WIDGET
(function($){
	var Tabcordion  = {
		options : { // initial values are stored in the widget's prototype
			headerBarID:			'tabcord-headerBar', //the display where the list shows in tab mode
			headerClass:			'.tabcord-title', //the headers that will act as buttons
			dispClass:				'.tabcord-disp', //class for display items
			activeClass:			'active', //class to append to active items
			selectFirst:			true, //Select first item in list on initialize
			toggleWidth:			700, //window size to swap between accordion and tabs
			hideSpeed:				200, //speed in milliseconds to hide current list
			showSpeed:				600, //speed in milliseconds to show new list
			beforeShowFunc:			function () {},
			afterShowFunc:			function () {}
		},
		//**********************//
	  //    PRIVATE METHODS    //
	  //**********************//
		_init : function() {
			var self = this;
			self.headerArr = $( this.options.headerClass, this.element ); // array of the headers
			self.headerObj = {}; // for storing data about the tabs
			self.headerBar = null; // for holding the header tabs
			self.currActive = null; // for tracking the currently active item
			self.$window = $(window); // reference to the window for size checks
			self.isAnimate = false;

			//create a header bar
			self._createHeaderBar();
			//if select first is set, then select the first item in the tab list
			if ( self.options.selectFirst ) {
				var $el = this.element.find( self.options.headerClass+':first' );
				self.changeDispContent ( $el, true ); //activate the first item in the set
			}
			//events
			self.element.on( 'click', self.options.headerClass, function ( e ) {
				self.changeDispContent ( $( this ), false); //pass clicked tech list to function for proper display
			});
		},
		_createHeaderBar : function ( ) {
			var i=0,
				len = this.headerArr.length,
				$tempHead = $( '<div id="' + this.options.headerBarID + '" class="' + this.options.headerBarID + '"></div>' );

			// collect headers, loop through them and place in a temporary object
			for ( ; i<len; i++ ) {
				var $tHeader = $( this.headerArr[i] ),
					$tClone = $tHeader.clone().css('width', 100/len + '%');
				//append cloned header to new node
				$tClone.appendTo( $tempHead );

				//construct header object for all headers
				this.headerObj[ $tHeader.data( 'hname' ) ] = {
					baseH3 : $tHeader,
					tabH3 : $tClone,
					disp : $tHeader.next( this.dispClass )
				};
			}
			//add header bar to the DOM
			this.element.prepend( $tempHead );
			//store access to the header bar
			this.headerBar = $tempHead;
		},
		_changeTabBased : function ( $el ) {
			if ( $el.hasClass( this.activeClass ) ) { return false; } // in tab view return if item is already active
			var self = this,
				elName = $el.data( 'hname' );
			//deactivate and hide
			self._deactiveCurrent();
			//activate both headers
			self._activateHeaders( elName );

			if ( self.currActive ) {
				self.headerObj[ self.currActive ].disp.fadeOut( self.options.hideSpeed, function ( e ) {
					self.headerObj[ elName ].disp.fadeIn( self.options.showSpeed, function () {
						self._runAfterCallback( elName );
					});
				});
			} else {
				self.headerObj[ elName ].disp.fadeIn( self.options.showSpeed, function () {
					self._runAfterCallback( elName );
				});
			}
		},
		_changeAccordionBased : function ( $el, init ) {
			var self = this;
			if ( init ) {
				this._accodionShow( $el );
			}
			else if ( $el.hasClass( this.options.activeClass ) ) { //item clicked is active, deactivate it.
				this._deactiveCurrent();
				this.headerObj[ $el.data( 'hname' ) ].disp.slideUp( this.options.hideSpeed, function () {
					self.isAnimate = false;
				} );
			} else {
				this._accodionShow( $el );
			}
		},
		_accodionShow : function ( $el ) {
			var self = this,
				elName = $el.data( 'hname' );
			self._deactiveCurrent();
			//activate both headers
			self._activateHeaders( elName );

			if ( self.currActive ) {
				self.headerObj[ self.currActive ].disp.slideUp( self.options.hideSpeed, function ( e ) {
					self.headerObj[ elName ].disp.slideDown( self.options.showSpeed, function () {
						self._runAfterCallback( elName );
					});
				});
			} else {
				self.headerObj[ elName ].disp.slideDown( self.options.showSpeed, function () {
					self._runAfterCallback( elName );
				});
			}
		},
		_deactiveCurrent : function () {
			//if an item is active, deactivate it
			if ( this.currActive ) {
				//remove the active classes
				this.headerObj[ this.currActive ].tabH3.removeClass( this.options.activeClass );
				this.headerObj[ this.currActive ].baseH3.removeClass( this.options.activeClass );
			}
		},
		_activateHeaders : function ( elName ) {
			this.headerObj[ elName ].tabH3.addClass( this.options.activeClass );
			this.headerObj[ elName ].baseH3.addClass( this.options.activeClass );
		},
		_runAfterCallback : function ( elName ) {
			var afterCallback = this.options.afterShowFunc;
			this.currActive = elName;
			this.isAnimate = false;
			//callback after change of content
			if ($.isFunction(afterCallback)) afterCallback(); //if it's a function run it
		},
		//**********************//
	  //    PUBLIC METHODS    //
	  //**********************//
	  changeDispContent : function ( $el, init ) {
			// return if we are currently in an animation
			if (this.isAnimate) { return false; }
			// set flag that we are going to animate
			this.isAnimate = true;

			//callback before change of content
			var beforecallback = this.options.beforeShowFunc;
			if ($.isFunction(beforecallback)) beforecallback(); //if it's a function run it

			//change the content
			if ( this.$window.width() >= this.options.toggleWidth ) {
				//change tab view based
				this._changeTabBased( $el );
			} else {
				//change accordion view based
				this._changeAccordionBased( $el, init );
			}
		}
	}

	$.widget("ui.tabcordion", Tabcordion);
	/**
  * Example
  * $( '#myID' ).tabcordion();
  **/
})(jQuery);