// Js for header getting fixed on top

const API_KEY = '?api_key=15d382b5ad53d6b7c9569e8b85954ffa';
const API_PATH = 'https://api.themoviedb.org/3/';


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
class NowPlaying {
    constructor() {
        this.endpont = 'movie/now_playing';
        this.now_playing = `${API_PATH}${this.endpont}${API_KEY}&page=1`;
        this.genres = `${API_PATH}genre/movie/list${API_KEY}`;
        this.totalPages = 0;
        this.wrapper = document.querySelector('.js-now-playing');
        this.genresArray = undefined;
        this.page = 0;
        this.getGenres().then((value) => this.init(value));
    }

    item(id, title, poster = undefined, release_date = undefined, genres = undefined, vote_average = undefined, overview = undefined) {

        const item = document.createElement('div');
        item.classList = 'item border-box';
        item.dataset.id = id;
        item.setAttribute('tabindex', 0);
        item.innerHTML = `
            <div class="item-imgWrapper rounded">
                <img src="https://image.tmdb.org/t/p/original/${poster}" alt="${title} thumbnail">
            </div>
            <h3>${title}</h3>
            <div class="item-details">
                <div>Released on: ${release_date}</div>
                <div>Genres: ${genres}</div>
                <div class="flex animation-wrapper">Average vote: <span class="animated-circle" data-percentage="${vote_average*0.1}">${vote_average}</span></div>
            </div>`;

        return item;
    }

    getGenres() {
        const request = new Request(this.genres);

        return new Promise((resolve) => {
            fetch(request)
                .then((response) => response.json())
                .then((response) => {
                    this.genresArray = response.genres;
                    resolve(true);
                })
                .catch((error) => {
                    alert('in genres' + error);
                    resolve(false);
                });
        });
    }

    init(genres) {

        this.page +=1;

        const request = new Request(this.now_playing +'&page=' +this.page);
        
        fetch(request)
            .then((response) => response.json())
            .then((response) => {
                //console.log(JSON.stringify(response, null, '\t'));
                this.totalPages = response.total_pages;

                const countElement = document.createElement('div');
                countElement.classList = 'items-results-info';
                countElement.append(`Found ${response.total_results} results, playing until ${response.dates.maximum}`);
                this.wrapper.prepend(countElement);

                response.results.forEach(e => {
                    let genres = '';
                    if (this.genresArray) {
                        e.genre_ids.forEach(e => {
                            genres += this.genresArray.find(item => item.id === e).name + ' ';
                        });
                    } else {
                        // In case the genres request is not succesful and we cannot match genre id with genre name just display a list of ids
                        genres = JSON.stringify(e.genre_ids);
                    }

                    const element = this.item(e.id, e.title, e.poster_path, e.release_date, genres, e.vote_average);
                    this.wrapper.append(element);
                    new ItemDetails(element);
                });

                if (this.totalPages > 1) {
                    // Inititate Infinite Scrolling
                }
            })
            .catch((error) => {
                alert('in movies' + error);
                console.log(error.stack);
            });
    }
}

const globalNowPlaying = new NowPlaying();
/* Observer js */