// TODO: add loop rotate disable

// elements
const sliderHolder = document.querySelector('.slider_holder')
const sliderElem = document.querySelector('.slider')
const prevBtn = document.querySelector('.nav_btn_prev')
const nextBtn = document.querySelector('.nav_btn_next')

// params
const ITEM_PER_SLIDE = 3
const SLIDER_ANIMATION_TIME = 1000
const SLIDER_COLUMNS = ITEM_PER_SLIDE + 2
const SLIDER_GAP = parseFloat(window.getComputedStyle(sliderElem).gap)

// variables
const slidesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const slides = []

let activeSlidesIndex = Array(ITEM_PER_SLIDE)
    .fill()
    .map((_, index) => index)

let nextActive = ITEM_PER_SLIDE
let prevActive = slidesList.length - 1

let isAnimationEnded = true
let slideWidth = 0

// events
prevBtn.addEventListener('click', prev)
nextBtn.addEventListener('click', next)

// init slider
addSlides()
updateSlider(activeSlidesIndex)
slideWidth = slides[0].clientWidth + SLIDER_GAP
prepareSecCards()

// functions
function addSlides() {
    sliderElem.style.gridTemplateColumns = `repeat(${ITEM_PER_SLIDE}, 1fr)`

    slidesList.forEach((slideItem, index) => {
        const slide = document.createElement('div')
        slide.classList.add('slide', `slide-${index}`)
        slide.innerHTML = slideItem
        sliderElem.appendChild(slide)

        slides.push(slide)
    })
}

function next() {
    if (!isAnimationEnded) return
    isAnimationEnded = false

    sliderElem.classList.add('next_anim', 'move_animation')
    activeSlidesIndex = activeSlidesIndex.map(index => checkActive(++index))

    sliderElem.style.transform = `translateX(-${slideWidth}px)`
    prepareSecCards()

    sliderElem.addEventListener('transitionend', () => {
        sliderElem.classList.remove('next_anim', 'move_animation')
        sliderElem.style.removeProperty('transform')

        updateSlider(activeSlidesIndex)
    })
}

function prev() {
    if (!isAnimationEnded) return
    isAnimationEnded = false

    sliderElem.classList.add('prev_anim', 'move_animation')
    activeSlidesIndex = activeSlidesIndex.map(index => checkActive(--index))

    sliderElem.style.transform = `translateX(${slideWidth}px)`
    prepareSecCards()

    sliderElem.addEventListener('transitionend', () => {
        sliderElem.classList.remove('prev_anim', 'move_animation')
        sliderElem.style.removeProperty('transform')

        updateSlider(activeSlidesIndex)
    })
}

function updateSlider(activeSlides) {
    resetSecCards()

    removePrev()

    prevActive = checkActive(activeSlides[0] - 1)
    nextActive = checkActive(activeSlides[activeSlides.length - 1] + 1)

    activeSlides.forEach(index => {
        slides[index].classList.add('show')
    })

    addNext()
    prepareSecCards()
    isAnimationEnded = true
}

function removePrev() {
    slides[prevActive].classList.remove('show_prev')
    slides[nextActive].classList.remove('show_next')
}

function addNext() {
    slides[prevActive].classList.remove('show')
    slides[nextActive].classList.remove('show')

    slides[prevActive].classList.add('show_prev')
    slides[nextActive].classList.add('show_next')
}

function prepareSecCards() {
    slides[prevActive].style.width = `${slideWidth - SLIDER_GAP}px`
    slides[nextActive].style.width = `${slideWidth - SLIDER_GAP}px`

    slides[prevActive].style.left = `-${slideWidth}px`
    slides[nextActive].style.right = `-${slideWidth}px`
}

function resetSecCards() {
    slides[prevActive].style.removeProperty('width')
    slides[nextActive].style.removeProperty('width')

    slides[prevActive].style.removeProperty('left')
    slides[nextActive].style.removeProperty('right')
}

function checkActive(index) {
    return index > slides.length - 1 ? 0 : index < 0 ? slides.length - 1 : index
}
