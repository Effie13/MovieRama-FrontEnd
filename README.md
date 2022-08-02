# MovieRama-FrontEnd

Assignment

Javascript - General Choices

Most of the project is sepatated in JS files each containing a class, named accordingly. 

List of classes:

NowPlaying: Handles the requests and the rendering of the HTML for the Now Playing Movies. There is a global instance of this class called globalNowPlaying, which is used by the scrollObserver. The fetchMovies method is called both at the initialization of the page when the global instance is created and again each time the observer "reaches the current end of the page".

ItemDetails: It is the class responsible for rendering content dynamically by fetching data each time a movie item is clicked. It also handles the active states of the items and some additional animations and functionality concerning the videos. A new instance is created every time a movie item is added inside the NowPlaying fetchMovies function.

scrollObserver: 

----------------------------------------

The Javascript file base.js is a generic one. It consists of some Event handlers, some basic if statements and code which is not necessarily associated to a component-like functionality. Depending on the time left at the end of this deadline, I plan on adding functionality to respect the user's preferences for reduced motion and theme preferences as well. 


Infinite Scrolling

The infinite scrolling requirement is fulfilled using the Intersection Observer API 
After the data for a new "page" are loaded and added in the list, an empty element with class scroll-trigger is added on the wrapper.
This element is then passed to the observer to being checked for intersecting. Since the observer is costly, performance-wise, the oberver uses the unobserve built-in method to stop checking for this element when the threshold is passed. It makes sense since we only need to trigger the load the end of the current list of results, so we only need one trigger at a time. Everything before that is already fetched and rendered. 

HTTPS vs HTTP in this project

Future work:

Make SCSS files more versatile by adding mixins and map for handling different breakpoints. Also it is necessary to write some SCSS functions to generate some utility classes for margins, paddings, borders etc since those properties are used quite often. 

By making use of CSS variables, a "Settings" modal can be added on the page where the user can manipulate the page according to his liking and possible make it even more accessible by increasing/decreasing the font size vase (to be changed in the code to make use of the CSS variable) and possibly the color palette.


TO BE DONE

Add explanation for running and scripts in package json

3. Hover state on links 
Add linkedin on information on the bottom of the page
4. Check basic keyboard navigation
5. Generalize oberver for being used for the search results as well
12. Promise for search
13. Loader in between new rendering
14. Check data for nulls
15. CSS and responsive
16. Search functionality
17. Details in animation
18. Update readme file with my choices
20. HTML and CSS validation
21. Web Accessibility validation
