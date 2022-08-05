/* Observer js */

class ScrollObserver {
    constructor(element) {
        this.element = element;
        this.trigger = this.element.querySelector('.scroll-trigger:last-child');
        this.options = {
            //root: element,
            rootMargin: '0px',
            threshold: 0
        };

        this.observer;
        this.init();
    }

    init() {
        const nowplaying = this.element.classList.contains('js-now-playing');
        
        this.observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    //entry.target.classList.add('passed');
                    entry.target.remove(); // It messes with the order and how I have already implented the animation using dummy items
                    self.unobserve(entry.target);
                    nowplaying ? globalNowPlaying.fetchMovies() : globalSearchData.loadData()
                }
            });
        }, this.options);

        this.runObserve();
    }

    updateTrigger() {
        this.trigger = this.element.querySelector('.scroll-trigger:last-child');
        this.runObserve();
    }

    runObserve() {
        this.observer.observe(this.trigger);
    }

    remove() {
        this.observer.disconnect();
    }
}