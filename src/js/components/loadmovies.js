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