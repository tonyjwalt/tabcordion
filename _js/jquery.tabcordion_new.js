/**
 * Creates a tab / accordion system based on the available width
 * needs CSS to swap viewable sections based on media query to avoid heavy window resize event
 * putting display:none !important; and display:block !important; on the tab display container
 *
 * TODO: should also further optimize the change functions to share some code
 *
 * @author Tony Walt <tony.walt@effectiveui.com>
 */
// make sure required JavaScript modules are loaded
if (typeof jQuery === "undefined") {
  throw "This widget requires jquery module to be loaded";
}
//Requires JQUERY, JQUERYUI - WIDGET

var Tabcordion  = {
/* INITIALIZE FUNCTIONS
========================================================================== */
	_create : function() {
		var self = this;
		//set variables
		self.activeClass = self.options.activeClass;
		self.headerClass = self.options.headerClass;
		self.dispClass = self.options.dispClass;
		self.hideSpeed = self.options.hideSpeed;
		self.showSpeed = self.options.showSpeed;
		self.headerArr = $( this.headerClass, this.element );
		self.headerObj = {};
		self.currActive = '';

		self._createHeaderBar();
		//if select first is set, then select the first item in the tab list
		if ( self.options.selectFirst ) {
			var $el = this.element.find( self.headerClass+':first' );
			self._changeDispContent ( $el, true ); //activate the first item in the set
		}
		//events
		self.element.on( 'click', self.headerClass, function ( e ) {
			self._changeDispContent ( $( this ), false); //pass clicked tech list to function for proper display
		} );
	},
	_init : function() {

	},
/* BUILD HEADER BAR
========================================================================== */
	_createHeaderBar : function ( ) {
		var i=0,
			$tempHead = $( '<div id="' + this.options.headerBarID + '" class="' + this.options.headerBarID + '"></div>' );

		// collect headers, loop through them and place in a temporary object
		for ( ; i<this.headerArr.length; i++ ) {
			var $tHeader = $( this.headerArr[i] ),
				$tClone = $tHeader.clone();
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
/* CHANGE CONTENT FUNCTIONS
========================================================================== */
	_changeDispContent : function ( $el, init ) {
		var self = this,
			beforecallback = this.options.beforeShowFunc;

		//callback before change of content
		if ($.isFunction(beforecallback)) beforecallback(); //if it's a function run it

		//change the content
		if ( $( window ).width() > self.options.toggleWidth ) {
			//change tab view based
			self._changeTabBased( $el );
		} else {
			//change accordion view based
			self._changeAccordionBased( $el, init );
		}
	},
	_changeTabBased : function ( $el ) {
		if ( $el.hasClass( this.activeClass ) ) { return false; } // in tab view return if item is already active
		var self = this;
		//deactivate and hide
		self._deactiveCurrent();
		//activate both headers
		self._activateHeaders( $el );

		if ( self.currActive !== '' ) {
			self.headerObj[ self.currActive ].disp.fadeOut( self.hideSpeed, function ( e ) {
				self.headerObj[ $el.data( 'hname' ) ].disp.fadeIn( self.showSpeed, function () {
					self._runAfterCallback( $el );
				} );
			} );
		} else {
			self.headerObj[ $el.data( 'hname' ) ].disp.fadeIn( self.showSpeed, function () {
				self._runAfterCallback( $el );
			} );
		}
	},
	_changeAccordionBased : function ( $el, init ) {
		if ( init ) {
			this._accodionShow( $el );
		}
		else if ( $el.hasClass( this.activeClass ) ) { //item clicked is active, deactivate it.
			this._deactiveCurrent();
			this.headerObj[ $el.data( 'hname' ) ].disp.slideUp( this.hideSpeed );
		} else {
			this._accodionShow( $el );
		}
	},
	_deactiveCurrent : function () {
		//if an item is active, deactivate it
		if ( this.currActive !== '' ) {
			//remove the active classes
			this.headerObj[ this.currActive ].tabH3.removeClass( this.activeClass );
			this.headerObj[ this.currActive ].baseH3.removeClass( this.activeClass );
		}
	},
	_activateHeaders : function ( $el ) {
		var nameVal = $el.data( 'hname' );
		this.headerObj[ nameVal ].tabH3.addClass( this.activeClass );
		this.headerObj[ nameVal ].baseH3.addClass( this.activeClass );
	},
	_accodionShow : function ( $el ) {
		var self = this;
		self._deactiveCurrent();
		//activate both headers
		self._activateHeaders( $el );

		if ( self.currActive !== '' ) {
			self.headerObj[ self.currActive ].disp.slideUp( self.hideSpeed, function ( e ) {
				self.headerObj[ $el.data( 'hname' ) ].disp.slideDown( self.showSpeed );
			} );
		} else {
			self.headerObj[ $el.data( 'hname' ) ].disp.slideDown( self.showSpeed );
		}
	},
	_runAfterCallback : function ( $el ) {
		var afterCallback = this.options.afterShowFunc;
		this.currActive = $el.data( 'hname' );
		//callback after change of content
		if ($.isFunction(afterCallback)) afterCallback(); //if it's a function run it
	},
/* ==========================================================================
DEFAULTS
========================================================================== */
	options : { // initial values are stored in the widget's prototype
		headerBarID:			'tabcord-headerBar', //the display where the list shows in tab mode
		headerNode:				'h3',
		headerClass:			'.tabcord-title', //the headers that will act as buttons
		dispClass:				'.tabcord-disp', //class for display items
		activeClass:			'active', //class to append to active items
		selectFirst:			true, //Select first item in list on initialize
		toggleWidth:			700, //window size to swap between accordion and tabs
		hideSpeed:				200, //speed in milliseconds to hide current list
		showSpeed:				600, //speed in milliseconds to show new list
		beforeShowFunc:			function () {},
		afterShowFunc:			function () {}
	}
};
$.widget("ui.tabcordion", Tabcordion);