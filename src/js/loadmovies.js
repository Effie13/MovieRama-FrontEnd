class NowPlaying {
    constructor() {
        this.endpont = 'movie/now_playing';
        this.now_playing = `${API_PATH}${this.endpont}${API_KEY}&page=1`;
        this.genres = `${API_PATH}genre/movie/list${API_KEY}`;
        this.totalPages = 0;
        this.wrapper = document.querySelector('.js-now-playing');
        this.genresArray = undefined;
        this.getGenres().then((value) => this.init(value));
    }

    item(id, title, poster = undefined, release_date = undefined, genres = undefined, vote_average = undefined, overview = undefined) {

        const item = document.createElement('div');
        item.classList = 'item border-box';
        item.dataset.id = id;
        item.setAttribute('tabindex', 0);
        item.innerHTML = `
            <img class="rounded" src="https://image.tmdb.org/t/p/original/${poster}" alt="${title} thumbnail">
            <h3>${title}</h3>
            <div class="item-details">
                <p>Released on: ${release_date}</p>
                <p>Genres: ${genres}</p>
                <p>Average vote: ${vote_average}</p>
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

        const request = new Request(this.now_playing);

        fetch(request)
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.stringify(response, null, '\t'));
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

                    this.wrapper.append(this.item(e.id, e.title, e.poster_path, e.release_date, genres, e.vote_average));
                });

                if (this.totalPages > 1) {
                    // Inititate Infinite Scrolling
                }
            })
            .catch((error) => {
                alert('in movies' + error);
            });
    }
}

const globalNowPlaying = new NowPlaying();
