class SearchData {
    constructor() {
        this.list = document.querySelector('.js-search-list');
        this.wrapper = this.list.parentNode.parentNode;
        this.input = document.querySelector('.js-search-input');
        this.endpoint = `${API_PATH}search/movie${API_KEY}&include_adult=false&page=`;
        this.page = 0;
        this.results = undefined;
        this.totalPages = 0;
        this.hasScroll = false;
        this.valueHolder = document.querySelector('.js-value');
        this.closeBtn = document.querySelector('.js-search-close');
        this.controller = new AbortController();
        this.signal = this.controller.signal;
        this.value = '';
        this.request = undefined;
        this.otherWrapper = document.querySelector('.js-now-playing').parentNode;
        this.scrollObserver;

        this.init();
    }

    init() {

        this.closeBtn.addEventListener('click', _ => this.closeSearch());
        // Initiate search
        this.input.addEventListener('input', this.debounce(this.doSearch, 300));
    }

    debounce(callback, interval) {
        let debounceTimeoutId;
        const self = this;

        return function (...args) {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = setTimeout(() => callback.apply(self, args), interval);
        };
    }

    loadData() {
        const scrollTrigger = document.createElement('div');
        scrollTrigger.classList = 'scroll-trigger';

        const signal = this.signal;
        this.page += 1;

        const request = new Request(this.endpoint + this.page + '&query=' + encodeURI(this.value));

        this.request = fetch(request, { signal })
            .then((response) => response.json())
            .then((response) => {

                //console.log(JSON.stringify(response, null, '\t'));

                if (this.page == 1) {
                    this.totalPages = response.total_pages;
                }

                if (response.results.length) {
                    response.results.forEach((e, i) => {
                        let genres = '';
                        if (genresArray) {
                            e.genre_ids.forEach(e => {
                                genres += genresArray.find(item => item.id === e).name + ' ';
                            });
                        } else {
                            // In case the genres request is not succesful and we cannot match genre id with genre name just display a list of ids
                            genres = JSON.stringify(e.genre_ids);
                        }

                        const element = this.item(e.id, e.title, e.poster_path, e.release_date, genres, e.vote_average);
                        this.list.append(element);
                        //new ItemDetails(element);
                    });
                    this.list.append(scrollTrigger);
                } else {
                    // response.results.length == 0
                    this.list.classList.add('empty');
                    this.hasScroll = false;
                    this.scrollObserver.remove();
                    this.request = undefined;
                    return;
                }

                if (this.totalPages > 1 && !this.hasScroll) {
                    // Inititate Infinite Scrolling
                    this.scrollObserver = new ScrollObserver(this.list);
                    this.hasScroll = true;
                } else if (this.hasScroll) {
                    this.scrollObserver.updateTrigger();
                }

                if (this.totalPages == this.page && this.hasScroll) {
                    this.scrollObserver.remove();
                }

                this.request = undefined;
            })
            .catch((error) => {
                alert('in movies' + error);
                console.log(error.stack);
            });
    }

    doSearch() {
        const value = this.input.value;

        // Kill Previous Search and rendering
        if (this.request) this.controller.abort();
        this.list.innerHTML = '';
        //const signal = this.signal;

        if (this.list.classList.contains('empty')) this.list.classList.remove('empty');

        if (!this.wrapper.classList.contains('searching')) {
            this.wrapper.classList.add('searching');

            // This is in case we have scrolled down and then make a search
            // So that it goes to the top again and not keep the current scrollY value
            // We need the scrollBehavior set to auto so that it happes immediately without animation
            document.documentElement.style.scrollBehavior = 'auto';
            setTimeout(() => window.scrollTo(0, 0), 5);
            setTimeout(() => document.documentElement.style.scrollBehavior = 'smooth', 5);

            this.wrapper.addEventListener('transitionend', () => {
                this.otherWrapper.classList.remove('active');
                this.otherWrapper.setAttribute('hidden', true);
                this.wrapper.style.position = 'absolute';
            }, {once: true});
            //body.classList.add('stop-scrolling');
        }

        globalNowPlaying.scrollObserver.remove();

        // Check if Results Wrapper is visible
        if (value.length > 3) {
            this.valueHolder.innerHTML = value;
            this.value = value;

            this.loadData();

        } else {
            this.closeSearch();
        }
    }

    closeSearch() {
        this.input.value = '';
        globalNowPlaying.scrollObserver.updateTrigger();
        this.hasScroll = false;
        if (this.scrollObserver) this.scrollObserver.remove();
        this.otherWrapper.classList.add('active');
        this.otherWrapper.removeAttribute('hidden');
        //this.wrapper.style.position = '';
        this.wrapper.style.display = 'none';
        this.wrapper.classList.remove('searching'); 
        this.wrapper.style = '';  
        //this.wrapper.addEventListener('transitionend', () => {
            //this.otherWrapper.classList.add('active');
            // this.otherWrapper.removeAttribute('hidden');
        //}, {once: true});
    }

    item(id, title, poster = undefined, release_date = undefined, genres = undefined, vote_average = undefined, overview = undefined) {
        // TO DO 
        // Add link
        const item = document.createElement('div');
        const imgUrl = poster ? `https://image.tmdb.org/t/p/original/${poster}` : './src/assets/movie.png';
        item.classList = 'item border-box';
        item.dataset.id = id;
        item.dataset.imgurl = imgUrl;
        item.setAttribute('tabindex', 0);

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
}

const globalSearchData = new SearchData();