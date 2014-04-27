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
		},
		//**********************//
	  //    PRIVATE METHODS    //
	  //**********************//
		_init : function() {
			var self = this;


			//create a header bar

			//select the first item

			//events
			self.element.on( 'click', self.options.headerClass, function ( e ) {
				console.log( $(this) );
				//self._changeDispContent ( $( this ), false); //pass clicked tech list to function for proper display
			});
		}
		//**********************//
	  //    PUBLIC METHODS    //
	  //**********************//
	}

	$.widget("ui.tabcordion", Tabcordion);
	/**
  * Example
  * $( '#myID' ).tabcordion();
  **/
})(jQuery);