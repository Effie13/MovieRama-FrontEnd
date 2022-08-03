class FontAdjust {
    constructor() {
        this.parent = document.querySelector('.js-adjust-font');
        this.up = this.parent.querySelector('.js-adjust-font-increase');
        this.down = this.parent.querySelector('.js-adjust-font-decrease');
        this.max = parseInt(this.parent.getAttribute('data-max'));
        this.min = parseInt(this.parent.getAttribute('data-min'));
        this.base = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fs').slice(0, -2));

        if (this.up && this.down) this.init();
    }

    init() {
        this.up.addEventListener('click', _ => this.increase());
        this.down.addEventListener('click', _ => this.decrease());
    }

    setVariable(value) {
        document.documentElement.style.setProperty('--fs', value + 'px');
    }

    decrease() {
        this.base -=1;
        this.setVariable(this.base);
        this.checkValue();
    }

    increase() {
        this.base +=1;
        this.setVariable(this.base);
        this.checkValue();
    }

    checkValue() {
        this.base == this.max ? this.up.classList.add('disabled') : this.up.classList.remove('disabled')
        this.base == this.min ? this.down.classList.add('disabled') : this.down.classList.remove('disabled')
    }
}

const globalFontAdjust = new FontAdjust();