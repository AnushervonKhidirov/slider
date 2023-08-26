// params
const SLIDER_COLUMNS = 3
const LOOP_ROTATE = true
const SHOW_THUMBS = false

// elements
const sliderWrapper = document.querySelector('.slider_wrapper')
const sliderElem = document.querySelector('.slider')
const prevBtn = document.querySelector('.nav_btn_prev')
const nextBtn = document.querySelector('.nav_btn_next')
const thumbsWrapper = document.createElement('div')

if (SHOW_THUMBS) {
    thumbsWrapper.classList.add('thumbs')
    sliderWrapper.appendChild(thumbsWrapper)
}

// variables
const slidesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const slides = []
const thumbs = []
const SLIDER_GAP = parseFloat(window.getComputedStyle(sliderElem).gap)

let activeSlidesIndex = Array(SLIDER_COLUMNS)
    .fill()
    .map((_, index) => index)

let isAnimationEnded = true
let slideWidth = 0

let nextSlide = SLIDER_COLUMNS
let prevSlide = 0

// events
prevBtn.addEventListener('click', prev)
nextBtn.addEventListener('click', next)

// init slider
addSlides()
updateSlider(activeSlidesIndex)
slideWidth = slides[0].clientWidth + SLIDER_GAP
if (!LOOP_ROTATE) prevBtn.classList.add('disabled')

// functions
function addSlides() {
    sliderElem.style.gridTemplateColumns = `repeat(${SLIDER_COLUMNS}, 1fr)`

    slidesList.forEach((slideItem, index) => {
        const slide = document.createElement('div')
        slide.classList.add('slide', `slide-${index}`)
        slide.innerHTML = slideItem
        sliderElem.appendChild(slide)

        slides.push(slide)

        if (SHOW_THUMBS) {
            const thumb = document.createElement('div')
            thumb.classList.add('thumb', `thumb-${index}`)
            thumbsWrapper.appendChild(thumb)

            thumbs.push(thumb)
        }
    })
}

function next() {
    if (!isAnimationEnded) return
    isAnimationEnded = false

    nextSlide = checkActive(activeSlidesIndex[activeSlidesIndex.length - 1] + 1, !LOOP_ROTATE)
    prevSlide = checkActive(activeSlidesIndex[0])

    sliderElem.classList.add('next_anim', 'move_animation')
    activeSlidesIndex = activeSlidesIndex.map(index => checkActive(++index))

    sliderElem.style.transform = `translateX(-${slideWidth}px)`
    prepareNextSlide('right')

    sliderElem.addEventListener('transitionend', () => {
        sliderElem.classList.remove('next_anim', 'move_animation')
        sliderElem.style.removeProperty('transform')

        updateSlider(activeSlidesIndex)
    })
}

function prev() {
    if (!isAnimationEnded) return
    isAnimationEnded = false

    nextSlide = checkActive(activeSlidesIndex[0] - 1, !LOOP_ROTATE)
    prevSlide = checkActive(activeSlidesIndex[activeSlidesIndex.length - 1])

    sliderElem.classList.add('prev_anim', 'move_animation')
    activeSlidesIndex = activeSlidesIndex.map(index => checkActive(--index))

    sliderElem.style.transform = `translateX(${slideWidth}px)`
    prepareNextSlide('left')

    sliderElem.addEventListener('transitionend', () => {
        sliderElem.classList.remove('prev_anim', 'move_animation')
        sliderElem.style.removeProperty('transform')

        updateSlider(activeSlidesIndex)
    })
}

function updateSlider(activeSlides) {
    if (SLIDER_COLUMNS >= slidesList.length) {
        nextBtn.classList.add('disabled')
        prevBtn.classList.add('disabled')
    } else {
        resetNextSlide()
    }

    activeSlides.forEach((index, order) => {
        if (!slides[index]) return
        if (SHOW_THUMBS) thumbs[index].classList.add('active')
        slides[index].classList.add('show')
        slides[index].style.order = order + 1
    })

    isAnimationEnded = true
}

function prepareNextSlide(side) {
    slides[nextSlide].classList.add('show_next')
    slides[nextSlide].style.width = `${slideWidth - SLIDER_GAP}px`
    slides[nextSlide].style[side] = `-${slideWidth}px`
}

function resetNextSlide() {
    if (SHOW_THUMBS) thumbs[prevSlide].classList.remove('active')

    slides[prevSlide].classList.remove('show')
    slides[nextSlide].classList.remove('show', 'show_next')

    slides[nextSlide].style.removeProperty('width')
    slides[nextSlide].style.removeProperty('right')
    slides[nextSlide].style.removeProperty('left')

    slides[prevSlide].style.removeProperty('order')
}

function checkActive(index, checkOnLoopRotate) {
    if (checkOnLoopRotate) {
        index >= slides.length - 1
            ? nextBtn.classList.add('disabled')
            : nextBtn.classList.remove('disabled')
        index <= 0 ? prevBtn.classList.add('disabled') : prevBtn.classList.remove('disabled')
    }

    return index > slides.length - 1 ? 0 : index < 0 ? slides.length - 1 : index
}
