# MovieRama-FrontEnd

Front End Assignment 

The objective is to build a small project named MovieRama. The application is a movie catalog where users can check the movies of the week, search for movies and view details about them. The project doesn't have any backend parts but instead will relies on The Movie DB (MDB) JSON API (https://developers.themoviedb.org/3/getting-started) for a data source. MovieRama is a client-side only - single page application.

Basic requirements are:
- Users should be able to browse through the movies of the week using infinite scrolling
- Users should be able to search for movies by typing into a textbox and then browse
through the results using infinite scrolling
- Users should be able to click on a movie to view more info about it. Clicking on it should
expand (feel free to interpret “expand” into an animation of your liking) the item to fit the
extra information while clicking on it again should return it to its normal state.

Getting Started:

Open the project folder and run command line.
Make sure you have Node.js installed on your machine (If not follow the directions here https://nodejs.org/en/download/)
Make sure you have Express or follow the directions (https://expressjs.com/en/starter/installing.html) for installation. 

To start the project: 

When in CMD, type
    npm run dev 

This runs node ./index.js simultaneously with some gulp tasks to watch for changes in JS and SCSS files, so that they are recompiled in real time if needed. 

You are now ready to view the web page in http://localhost:8000.

Information about HTTPS:

Some basic procedures for running this project in https are followed in the index.js file where the application starts. However the code is commented until I resolve the issue with the certificate not being authorized.

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

Future improvements:

1. Add loading status for all fetch requests (the loading of the "now playing movies", the items loaded from search and the additional information fetched when clicking a movie)

2. When faced with a slow connection, use an asynchronous function, maybe with Promise.allSettled to run fetch requests such as the ones for reviews, trailer and movie details in parallel.

3. Make SCSS files more versatile by adding mixins and map for handling different breakpoints. Also it is necessary to write some SCSS functions to generate some utility classes for margins, paddings, borders etc since those properties are used quite often. 

4. By making use of CSS variables, a "Settings" modal can be added on the page where the user can manipulate the page according to his liking and possible make it even more accessible by increasing/decreasing the font size vase (to be changed in the code to make use of the CSS variable) and possibly the color palette.

