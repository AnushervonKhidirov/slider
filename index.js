class Slider {
    constructor(placement, sliderData, { columns, loopRotate, showThumbs }) {
        this.placement = placement
        this.sliderWrapper = null
        this.thumbWrapper = null
        this.sliderHolder = null
        this.slider = null

        this.navigation = null
        this.prevBtn = null
        this.nextBtn = null

        this.sliderData = sliderData

        this.columns = columns
        this.loopRotate = loopRotate
        this.showThumbs = showThumbs

        this.slides = []
        this.thumbs = []
        this.activeSlidesIndex = Array(columns).fill().map((_, index) => index)

        this.isPossibleToLeft = true
        this.isPossibleToRight = loopRotate ? true : false
        this.isAnimationEnded = true

        this.slideWidth = 0
        this.sliderGap = 0

        this.nextSlide = columns
        this.prevSlide = 0
    }

    initSlider() {
        this.createSlides()
        if (this.showThumbs) this.createThumbs()
        this.updateSlider()
        this.createNavigation()
        this.getProperties()
    }

    createSlides() {
        this.sliderWrapper = document.createElement('div')
        this.sliderWrapper.classList.add('slider_wrapper')

        this.sliderHolder = document.createElement('div')
        this.sliderHolder.classList.add('slider_holder')

        this.slider = document.createElement('div')
        this.slider.classList.add('slider')
        this.slider.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`

        this.sliderWrapper.appendChild(this.sliderHolder)
        this.sliderHolder.appendChild(this.slider)

        this.sliderData.forEach((slideItem, index) => {
            const slide = document.createElement('div')
            slide.classList.add('slide', `slide-${index}`)
            slide.innerHTML = slideItem

            this.slider.appendChild(slide)

            this.slides.push(slide)
        })

        this.placement.appendChild(this.sliderWrapper)
    }

    createNavigation() {
        this.navigation = document.createElement('div')
        this.navigation.classList.add('navigation')

        this.prevBtn = document.createElement('div')
        this.prevBtn.classList.add('nav_btn', 'nav_btn_prev')
        this.prevBtn.innerHTML = `
            <svg viewBox="0 0 451.846 451.847" transform="matrix(-1, 0, 0, 1, 0, 0)">
                <path
                    d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744   L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284   c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"
                />
            </svg>
        `

        this.nextBtn = document.createElement('div')
        this.nextBtn.classList.add('nav_btn', 'nav_btn_next')
        this.nextBtn.innerHTML = `
            <svg viewBox="0 0 451.846 451.847">
                <path
                    d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744   L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284   c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"
                />
            </svg>
        `

        if (!this.loopRotate) this.prevBtn.classList.add('disabled')

        this.navigation.appendChild(this.prevBtn)
        this.navigation.appendChild(this.nextBtn)
        this.sliderWrapper.appendChild(this.navigation)

        this.prevBtn.addEventListener('click', this.prev.bind(this))
        this.nextBtn.addEventListener('click', this.next.bind(this))
    }

    createThumbs() {
        this.thumbWrapper = document.createElement('div')
        this.thumbWrapper.classList.add('thumbs')
        this.sliderWrapper.appendChild(this.thumbWrapper)

        this.sliderData.forEach((_, index) => {
            const thumb = document.createElement('div')
            thumb.classList.add('thumb', `thumb-${index}`)

            this.thumbWrapper.appendChild(thumb)

            this.thumbs.push(thumb)
        })
    }

    getProperties() {
        this.sliderGap = parseFloat(window.getComputedStyle(this.slider).gap)
        this.slideWidth = this.slides[0].clientWidth + this.sliderGap
    }

    next() {
        if (!this.isAnimationEnded || !this.isPossibleToLeft) return
        this.isAnimationEnded = false

        this.nextSlide = this.checkActive(
            this.activeSlidesIndex[this.activeSlidesIndex.length - 1] + 1,
            !this.loopRotate
        )
        this.prevSlide = this.checkActive(this.activeSlidesIndex[0])

        this.slider.classList.add('next_anim', 'move_animation')
        this.activeSlidesIndex = this.activeSlidesIndex.map(index => this.checkActive(++index))

        this.slider.style.transform = `translateX(-${this.slideWidth}px)`
        this.prepareNextSlide('right')

        this.slider.addEventListener('transitionend', () => {
            this.slider.classList.remove('next_anim', 'move_animation')
            this.slider.style.removeProperty('transform')

            this.updateSlider()
        })
    }

    prev() {
        if (!this.isAnimationEnded || !this.isPossibleToRight) return
        this.isAnimationEnded = false

        this.nextSlide = this.checkActive(this.activeSlidesIndex[0] - 1, !this.loopRotate)
        this.prevSlide = this.checkActive(this.activeSlidesIndex[this.activeSlidesIndex.length - 1])

        this.slider.classList.add('prev_anim', 'move_animation')
        this.activeSlidesIndex = this.activeSlidesIndex.map(index => this.checkActive(--index))

        this.slider.style.transform = `translateX(${this.slideWidth}px)`
        this.prepareNextSlide('left')

        this.slider.addEventListener('transitionend', () => {
            this.slider.classList.remove('prev_anim', 'move_animation')
            this.slider.style.removeProperty('transform')

            this.updateSlider()
        })
    }

    updateSlider() {
        if (this.columns >= this.slides.length) {
            this.prevBtn.classList.add('disabled')
            this.nextBtn.classList.add('disabled')
        } else {
            this.resetNextSlide()
        }

        this.activeSlidesIndex.forEach((index, order) => {
            if (!this.slides[index]) return

            if (this.showThumbs && this.columns < this.slides.length) {
                this.thumbs[index].classList.add('active')
            }

            this.slides[index].classList.add('show')
            this.slides[index].style.order = order + 1
        })

        this.isAnimationEnded = true
    }

    prepareNextSlide(side) {
        this.slides[this.nextSlide].classList.add('show_next')
        this.slides[this.nextSlide].style.width = `${this.slideWidth - this.sliderGap}px`
        this.slides[this.nextSlide].style[side] = `-${this.slideWidth}px`
    }

    resetNextSlide() {
        if (this.showThumbs && this.columns < this.slides.length) {
            this.thumbs[this.prevSlide].classList.remove('active')
        }

        this.slides[this.prevSlide].classList.remove('show')
        this.slides[this.nextSlide].classList.remove('show', 'show_next')

        this.slides[this.nextSlide].style.removeProperty('width')
        this.slides[this.nextSlide].style.removeProperty('right')
        this.slides[this.nextSlide].style.removeProperty('left')

        this.slides[this.prevSlide].style.removeProperty('order')
    }

    checkActive(index, checkOnLoopRotate) {
        if (checkOnLoopRotate) {
            this.isPossibleToLeft = true
            this.isPossibleToRight = true

            index >= this.slides.length - 1
                ? this.nextBtn.classList.add('disabled') & (this.isPossibleToLeft = false)
                : this.nextBtn.classList.remove('disabled')
            index <= 0
                ? this.prevBtn.classList.add('disabled') & (this.isPossibleToRight = false)
                : this.prevBtn.classList.remove('disabled')
        }

        return index > this.slides.length - 1 ? 0 : index < 0 ? this.slides.length - 1 : index
    }
}

const placement1 = document.querySelector('.placement1')
const placement2 = document.querySelector('.placement1')

const slidesList1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const options1 = {
    columns: 3,
    loopRotate: true,
    showThumbs: true,
}

const sliderSP1 = new Slider(placement1, slidesList1, options1)
sliderSP1.initSlider()



const slidesList2 = ['a', 'b', 'c', 'd']

const options2 = {
    columns: 3,
    loopRotate: false,
    showThumbs: false,
}

const sliderSP2 = new Slider(placement2, slidesList2, options2)
sliderSP2.initSlider()