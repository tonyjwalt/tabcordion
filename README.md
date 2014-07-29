# Tabcordion
Creates a tab / accordion system based on the window width. Uses CSS to swap viewable sections based on media query to avoid heavy window resize event.

## Important Notes
+ Toggle size for tab switch to accordion must be set in the CSS as well as the JS.

## Options
+ **headerBarID** 'tabcord-headerBar' - string: the display where the list shows in tab mode
+ **headerClass** '.tabcord-title' - string: the headers that will act as buttons
+ **dispClass** .tabcord-disp' - string: class for display items
+ **activeClass** 'active' - string: class to append to active items
+ **selectFirst** true - boolean: Select first item in list on initialize
+ **toggleWidth** 700 - number: window size to swap between accordion and tabs
+ **hideSpeed** 200 - number: speed in milliseconds to hide current list
+ **showSpeed** 600 - number: speed in milliseconds to show new list
+ **beforeShowFunc** none - function: to run before show
+ **afterShowFunc** none - function: function to run after show

## Public Methods
+ changeDispContent ( jquery element ) - pass in a jquery instance of the element you wish to activate

## Example Use
$( '#myID' ).tabcordion();

## Technology
The styles are compiled to CSS, but the base code was written using SASS. This allows for variables, mixins, modularized CSS, and more. You can learn more about SASS at http://sass-lang.com/.

## Dependencies
+ [Jquery](http://jquery.com/) - Cross browser compatibility
+ [JqueryUI](http://jqueryui.com/) - Used for the widget factory

## Create a Build (using Terminal on a MAC)
+ Ensure you have Sass by opening terminal and typing: *sass -v*
+ Navigate to the base folder of this repo *tabcordion*
+ Run: *sass --watch styles:styles*

## To Do
+ move to transit or other hardware accelerated animation option
+ allow an active item to be initially set via JS or class on HTML item
+ if click during an animation, track final one so that we can trigger it on completion


## Known Issues
none yet

### License
The MIT License (MIT)