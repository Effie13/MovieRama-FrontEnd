

class ItemDetails {
    constructor(element) {
        this.element = element;
        this.id = element.getAttribute('data-id');
        this.movieEndpoint = `${API_PATH}movie/${this.id}`;
        this.trailerEndpoint = `${this.movieEndpoint}/videos${API_KEY}`;
        this.reviewsEndpoint = `${this.movieEndpoint}/reviews${API_KEY}`;
        this.similarEndpoint = `${this.movieEndpoint}/similar${API_KEY}`;
        this.youtubeURL = 'https://www.youtube.com/embed/';
        this.withData = false;
        this.expanded = false;

        this.init();
    }

    init() {

        this.element.addEventListener('click', () => {
            // Reset rest of the items

            const active = document.querySelector('.item.expanded');
            if (active) active.classList.remove('expanded');

            // const iframes = document.querySelectorAll('.item iframe');
            // iframes.forEach(e => {
            //     const video = e.querySelector('video');
            //     video.currentTime = 0;
            //     video.pause();
            // });

            this.element.classList.toggle('expanded');
            this.expanded = !this.expanded;
            if (!this.withData) {
                let request = new Request(this.movieEndpoint + API_KEY);
                const detailsDiv = document.createElement("div");
                detailsDiv.classList = 'item-additional absolute flex';

                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        //console.log(JSON.stringify(response, null, '\t'));
                        const description = document.createElement("div");
                        description.classList = 'item-description'
                        description.innerHTML = '';

                        if (response.title != undefined) description.innerHTML +=  `<h4><a href="${response.homepage}" target="_black">${response.title}</a></h4>`;

                        if (response.overview) description.innerHTML += `<p>${response.overview}</p>`;

                        detailsDiv.append(description);

                    })
                    .catch((error) => {
                        alert('in movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });
                
                request = new Request(this.reviewsEndpoint);

                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        const reviewsWrapper = document.createElement("div");
                        reviewsWrapper.classList = 'item-reviews';

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
                        alert('in reviews for movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });

                request = new Request(this.trailerEndpoint);

                fetch(request)
                    .then((response) => response.json())
                    .then((response) => {
                        const trailer = response.results.filter((e) => {return e.type === 'Teaser' || e.type === 'Trailer'})[0];
                        
                        if (trailer.key !== undefined) {
                            const iframe = document.createElement("iframe");
                            iframe.src = this.youtubeURL + trailer.key;
                            detailsDiv.append(iframe);
                        }
                    })
                    .catch((error) => {
                        alert('in reviews for movie with id ' + this.id + ' ' + error);
                        console.log(error.stack);
                    });
                
                this.element.append(detailsDiv);
                // console.log(detailsDiv.offsetTop);
                // window.scrollTo(detailsDiv.offsetTop,0);
                this.withData = true;
            }

        });
    }
}