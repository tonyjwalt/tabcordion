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
	_create : function() {
		var self = this;
		//set variables
		self.activeClass = self.options.activeClass;
		self.headerClass = self.options.headerClass;
		self.accordianDispClass = self.options.accordianDispClass;
		self.hideSpeed = self.options.hideSpeed;
		self.showSpeed = self.options.showSpeed;

		self.$tabDisplay = $( self.options.tabDisplayID, self.element );
		if ( self.options.selectFirst ) {
			var $el = this.element.find( self.options.headerClass+':first' );
			self._changeDispContent ( $el, true ); //activate the first item in the set
		}
		//events
		self.element.on( 'click', self.options.headerClass, function ( e ) {
			self._changeDispContent ( $( this ), false); //pass clicked tech list to function for proper display
		} );
	},
	_init : function() {

	},
	_changeDispContent : function ( $el, init ) {
		var self = this,
			$tabDisplay = self.$tabDisplay;

		if ( $( window ).width() > self.options.toggleWidth ) {
			self._changeTabBased( $el );
		} else {
			self._changeAccordionBased( $el, init );
		}
		//example callback
		var callback = this.options.afterShowFunc;
		if ($.isFunction(callback)) callback(); //if it's a function run it
	},
	_changeTabBased : function ( $el ) {
		var self = this;
		if ( $el.hasClass( self.activeClass ) ) { return false; } // in tab view return if item is already active
		var $curAct = $( self.headerClass + '.' + self.activeClass, self.element );
			$curAct.removeClass( self.activeClass ); // strip all active techlist titles
			$curAct.next( self.accordianDispClass ).hide(); //hide associated accordian display
			$el.addClass( self.activeClass ); // set this title to active
			$el.next( self.accordianDispClass ).show(); //show associated accordian display
			/*self.$tabDisplay.fadeOut( self.hideSpeed, function (e) {
					self.$tabDisplay.html( $el.next( self.accordianDispClass ).clone().show() );
					self.$tabDisplay.fadeIn( self.showSpeed );
				} );*/
	},
	_changeAccordionBased : function ( $el, init ) {
		var self = this;
		if ( init ) {
			var $elAccordInit = $el.next( self.accordianDispClass );
				$el.addClass( self.activeClass );
				$elAccordInit.slideDown( self.showSpeed, function (e) {
					self.$tabDisplay.html( $elAccordInit.clone().show() );
					self.$tabDisplay.show();
				} );
		}
		else if ( $el.hasClass( self.activeClass ) ) { //item clicked is active, deactivate it.
			$el.removeClass( self.activeClass );
			$el.next( self.accordianDispClass ).slideUp( self.hideSpeed );
			self.$tabDisplay.empty();
		} else {
			var $curAct = $( self.headerClass + '.' + self.activeClass, self.element ),
				$curAccord = $curAct.next( self.accordianDispClass ),
				$elAccord = $el.next( self.accordianDispClass );
			if ($curAct.length>0) { //there is at least one active tab, deactivate it and activate this one.
				$curAct.removeClass( self.activeClass ); // strip all active titles
				$curAccord.slideUp( self.hideSpeed, function ( e ) {
					self._AccordionShow($el, $elAccord);
				});
			} else { //no current active tabs, activate this one
				self._AccordionShow($el, $elAccord);
			}
		}
	},
	_AccordionShow : function ($el, $elAccord) {
		var self = this;
		$el.addClass( self.activeClass );
		//test callback before showing accordion
		var callback = this.options.beforeShowFunc;
		if ($.isFunction(callback)) callback(); //if it's a function run it
		//animate to show the grid
		$elAccord.slideDown( self.showSpeed, function ( e ) {
			self.$tabDisplay.html( $elAccord.clone().show() );
			self.$tabDisplay.show();
		});
	},
	options : { // initial values are stored in the widget's prototype
		tabDisplayID:			'#tabcord-tabDisp', //the display where the list shows in tab mode
		headerClass:			'.tabcord-title', //the headers that will act as buttons
		accordianDispClass:		'.tabcord-accDisp', //display for the accordion items
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