

class ItemDetails {
    constructor(element) {
        this.element = element;
        this.id = element.getAttribute('data-id');
        this.movieEndpoint = `${API_PATH}movie/${this.id}`;
        this.trailerEndpoint = `${this.movieEndpoint}/videos${API_KEY}`;
        this.reviewsEndpoint = `${this.movieEndpoint}/reviews${API_KEY}`;
        this.similarEndpoint = `${this.movieEndpoint}/similar${API_KEY}`;
        this.youtubeURL = 'https://www.youtube.com/embed/';
        this.activeDecor = document.querySelector('.decor-img');
        this.withData = false;
        this.imgReady = false;

        this.init();
    }

    init() {

        this.element.addEventListener('click', () => {

            // Hide active decorative image if any
            if (this.imgReady) {
                this.hideImage();
            }

            const active = document.querySelector('.item.expanded');

            // Stop video from playing when change in between movies

            if (active) {
                const iframe = active.querySelector('iframe');
                if (iframe) {
                    const iframeSrc = iframe.src;
                    iframe.src = iframeSrc;
                }
            }

            // Reset rest of the items
            if (!this.element.classList.contains('expanded')) {
                if (active) active.classList.remove('expanded');
            } else {
                this.element.classList.remove('expanded');
                return;
            }

            if (!this.element.classList.contains('expanded') && !this.imgReady) {
                this.imageChange(this.element.getAttribute('data-imgurl'));
            } else if (this.imgReady) {
                this.activeDecor.addEventListener('transitionend', () => {
                    this.imageChange(this.element.getAttribute('data-imgurl'));
                }, { once: true });
            }

            // Not stable in terms of animation performance
            // window.scrollTo(0,this.element.offsetTop);
            this.element.classList.add('expanded');

            // Fetch additional data if not already there
            // So only the first time a movie is clicked
            // All the above code has to do with animations and changes in statuses
            // While the fetching of data is needed only once and only if a movie is clicked 
            // Otherwise we will be getting a large amount of data making the page slow even though the user may 
            // never choose to view them
            if (!this.withData) {
                let request = new Request(this.movieEndpoint + API_KEY);
                const detailsDiv = document.createElement("div");
                detailsDiv.classList = 'item-additional absolute flex rounded';

                detailsDiv.addEventListener('click', e => e.stopPropagation());

                // I could have used Promise all to have the data for all requests,
                // description, reviews, video and then construct the html without manipulating the order with CSS
                // But it is not arbitrary to have all the values

                // I could also have used async await, with an await for each fetch but I didn't need to do that as well
                // Or wanted to actually block the code execution

                // TO DO: Performance improvement
                // async function fetchDetails() {
                //     const [moviesResponse, categoriesResponse] = await Promise.allSettled([
                //         fetch(detailsRequest),
                //         fetch(trailerRequest),
                //         fetch(reviewRequest)
                //     ]);
                //     const details = await detailsResponse.json();
                //     const trailer = await trailerResponse.json();
                //     const reviews = await reviewsResponse.json();
                //     return [details, trailer, reviews];
                // }

                // fetchDetails().then(([details, trailer, reviews]) => {
                //     Remove loader and handle data
                // }).catch(error => {
                //     // Handle Erros
                // });


                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        const description = document.createElement("div");
                        description.classList = 'item-description'
                        description.innerHTML = '';

                        if (response.title != undefined) description.innerHTML += `<h4><a href="${response.homepage}" target="_black">${response.title}</a></h4>`;

                        if (response.overview) description.innerHTML += `<p>${response.overview}</p>`;

                        detailsDiv.append(description);

                    })
                    .catch((error) => {
                        //alert('in movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });

                request = new Request(this.reviewsEndpoint);

                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        const reviewsWrapper = document.createElement("div");
                        reviewsWrapper.classList = 'item-reviews flex';

                        const reviewItem = (e) => {
                            const div = document.createElement("div");
                            div.classList = 'review';

                            div.innerHTML = `<div class="review-author">User ${e.author_details.username} said: </div>
                                <p class="review-content">${e.content}</p>`;
                            return div;
                        };
                        response.results.forEach((e, i) => {
                            if (i < 2) {
                                reviewsWrapper.append(reviewItem(e));
                            } else {
                                return;
                            }
                        });

                        detailsDiv.append(reviewsWrapper);
                    })
                    .catch((error) => {
                        //alert('in reviews for movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });

                request = new Request(this.trailerEndpoint);

                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        //console.log(JSON.stringify(response, null, '\t'));
                        const trailer = response.results.filter((e) => { return e.type === 'Teaser' || e.type === 'Trailer' })[0];

                        //console.log(trailer);
                        if (trailer && trailer.key !== undefined) {
                            const iframe = document.createElement("iframe");
                            iframe.src = this.youtubeURL + trailer.key;
                            detailsDiv.append(iframe);
                        }
                    })
                    .catch((error) => {
                        //alert('in reviews for movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });

                this.element.append(detailsDiv);
                this.withData = true;
            }
        });
    }

    imageChange(imgUrl) {
        this.activeDecor.src = imgUrl;
        this.imgReady = true;
        if (this.activeDecor.complete) {
            this.activeDecor.classList.add('ready');
        } else {
            this.activeDecor.addEventListener("load", (e) => e.target.classList.add('ready'), { once: true });
        }
    }

    hideImage() {
        this.activeDecor.src = undefined;
        this.activeDecor.classList.remove('ready');
    }
}

export default ItemDetails;