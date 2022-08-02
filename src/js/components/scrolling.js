/* Observer js */

class scrollObserver {
    constructor(element) {
        this.trigger = element.querySelector('.scroll-trigger:last-child');
        this.options = {
            //root: element,
            rootMargin: '0px',
            threshold: 0
        };

        this.observer;
        this.init();

    }

    init() {
        //let tr = this.trigger;
        this.observer = new IntersectionObserver( (entries, self) => {
            entries.forEach( entry => {
                if ( entry.isIntersecting ) {
                    //entry.target.classList.add('passed');
                    entry.target.remove(); // It messes with the order and how I have already implented the animation using dummy items
                    self.unobserve(entry.target);
                    globalNowPlaying.init();  
                }
            });            
        }, this.options);

        this.runObserve();
    }

    updateTrigger() {
        this.trigger = element.querySelector('.scroll-trigger:last-child');
        this.runObserve();
    }

    runObserve() {
        this.observer.observe(this.trigger);
    }

    unobserve() {
        this.observer.disconnect();
    }
}