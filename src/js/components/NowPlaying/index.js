import ItemDetails from "../ItemDetails/index.js";
import ScrollObserver from "../ScrollObserver/index.js";

class NowPlaying {
    constructor() {
        this.endpont = 'movie/now_playing';
        this.now_playing = `${API_PATH}${this.endpont}${API_KEY}&page=1`;
        this.genres = `${API_PATH}genre/movie/list${API_KEY}`;
        this.totalPages = 0;
        this.wrapper = document.querySelector('.js-now-playing');
        this.genresArray = undefined;
        this.hasScroll = false;
        this.dummyElement = document.createElement('div');
        this.dummyElement.classList = 'item-dummy animated';
        this.scrollObserver;
        this.page = 0;
        this.getGenres().then(_ => this.fetchMovies());
    }

    item(id, title, poster = undefined, release_date = undefined, genres = undefined, vote_average = undefined, overview = undefined) {

        const item = document.createElement('button');
        const imgUrl = poster ? `https://image.tmdb.org/t/p/original/${poster}` : './src/assets/movie.png';
        item.classList = 'item border-box';
        item.dataset.id = id;
        item.dataset.imgurl = imgUrl;
        //item.href= "javascript:;";
        //item.setAttribute('tabindex', 0);

        const pxPercentage = Math.PI * 40 * (100 - (vote_average * 10)) / 100;

        item.innerHTML = `
            <div class="relative">
                <div class="item-imgWrapper rounded">
                    <img src="${imgUrl}" alt="${title} thumbnail" class="lazy-load">
                </div>
                <div class="item-content absolute smooth-medium rounded flex-column">
                    <h3>${title}</h3>
                    <div class="item-details">
                        <div>Released on: ${release_date}</div>
                        <div>Genres: ${genres}</div>
                        <div class="flex animation-wrapper">Average vote: 
                            <span class="animated-circle" data-percentage="${vote_average * 10}" style="--percentage:${pxPercentage}px">
                                <svg id="svg" width="50" height="50" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <circle r="20" cx="25" cy="25" fill="transparent" stroke-dasharray="${Math.PI * 40}" stroke-dashoffset="0"></circle>
                                    <circle id="bar" r="20" cx="25" cy="25" fill="transparent" stroke-dasharray="${Math.PI * 40}" stroke-dashoffset="0"></circle>
                                </svg>
                                <span class="absolute">${vote_average}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;

        item.querySelector('.lazy-load').addEventListener('load', (e) => e.target.classList.add('ready'));

        return item;
    }

    async getGenres() {
        const request = new Request(this.genres);

        return await
            fetch(request)
                .then((response) => response.json())
                .then((response) => {
                    this.genresArray = genresArray = response.genres; //
                    return;
                })
                .catch((error) => {
                    console.log(error + ' while requesting movies genres.');
                    return;
                });
    }

    fetchMovies() {

        this.page += 1;

        const request = new Request(this.now_playing + '&page=' + this.page);
        //const dummyElement = document.createElement('div');
        //dummyElement.classList = 'item-dummy animated';

        const scrollTrigger = document.createElement('div');
        scrollTrigger.classList = 'scroll-trigger';

        async function movies() {
            let response = await fetch(request);
            return response = await response.json();
        };

        movies().then((response) => {

            // Remove loader
            this.wrapper.parentNode.classList.remove('loading');

            if (this.page == 1) {
                this.totalPages = response.total_pages;

                const countElement = document.createElement('div');
                countElement.classList = 'items-results-info';
                countElement.append(`Found ${response.total_results} results, playing until ${response.dates.maximum}`);
                this.wrapper.prepend(countElement);
            }

            response.results.forEach((e, i) => {
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
                if ((i + 1) % 2 == 0) {
                    this.wrapper.append(this.dummyElement.cloneNode());
                }
                new ItemDetails(element);
            });

            this.wrapper.append(scrollTrigger);

            if (this.totalPages > 1 && !this.hasScroll) {
                // Inititate Infinite Scrolling
                this.scrollObserver = new ScrollObserver(this.wrapper);
                this.hasScroll = true;
            } else if (this.hasScroll) {
                this.scrollObserver.updateTrigger();
            }

            if (this.totalPages === this.page && this.hasScroll) {
                this.scrollObserver.remove();
            }
        })
            .catch((error) => {
                // Remove loader
                this.wrapper.parentNode.classList.remove('loading');
                // Give some feedback
                const errorItem = document.createElement('div');
                errorItem.classList = 'error-message align-center row';
                errorItem.innerHTML = `Error during the fetch request probably due to bad connection.`;
                this.wrapper.append(errorItem);
                console.log(error.stack);
            });
    }
}

export default NowPlaying;