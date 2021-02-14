const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div)
        toggleSpinner(false);
    })

}

const getImages = (query) => {
    toggleSpinner(true);
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => {
            if(data.hits.length > 0) {
                showImages(data.hits)
            } else {
                document.getElementById('not-found').innerHTML = "Result not found";
                toggleSpinner(false);
            }
        })
        .catch(err => console.log(err))
}


let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');

    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        sliders.splice(item, 1)
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    let duration = document.getElementById('duration').value || 1000;
    if (duration < 0) {
        duration = Math.abs(duration);
    }
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);

    sliders.map((item, index) => {
        let dot = document.createElement('div');
        dot.className = 'dot dotActive';
        dot.setAttribute('onclick', `currentSlide(${index})`)
        document.getElementById('dots').appendChild(dot);
    })
}


// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}


//handle current slide 
const currentSlide = index => {
    changeSlide(slideIndex = index)
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

//working on enter key button
document.getElementById('search').addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
})

searchBtn.addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
    createSlider()
})

const toggleSpinner = (show) => {
    const spinner = document.getElementById('spinner');
    if(show) {
        spinner.classList.remove('d-none')
    } else {
        spinner.classList.add('d-none')
    }
}
