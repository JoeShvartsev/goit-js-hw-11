import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"
import { galleryMarkup } from "./gallerymarkup";
import { fetchPics } from "./fetch";

export const refs = {
  formEl: document.querySelector('.search-form'),
  buttonEl: document.querySelector('.submit'),
  galleryEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  observer: document.querySelector('.observer'),
  loadBtn: document.querySelector('.load-more')
}

let currentPage = 1; 
let currentValue = ''
isNextPageLoad = false;
const onFormSubmit = (e) => {
  e.preventDefault();
  const inputValue = refs.inputEl.value.trim();
  currentValue = inputValue;
  refs.galleryEl.textContent = '';
  isNextPageLoad = false
  performSearch(currentValue);
  e.currentTarget.reset();
};
const performSearch = (inputValue) => {
  fetchPics(inputValue, currentPage)
    .then((data) => {
      if (currentPage === Math.ceil(data.totalHits / 3)) {
        observer.unobserve(refs.observer);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }else if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        // refs.galleryEl.textContent = ''
      } else if (!isNextPageLoad){
        galleryMarkup(data);
        Notiflix.Notify.info(`Hooray! We found  ${data.totalHits} images.`);
        galleryLightbox.refresh();
        observer.observe(refs.observer);
      }
      else if(isNextPageLoad){
        galleryMarkup(data);
        galleryLightbox.refresh();
        observer.observe(refs.observer);
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
};
let options = {
  root: null,
  rootMargin: "300px",
  threshold: 0,
};
const onLoadMore = (entries, observer) => {
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      currentPage++;
      isNextPageLoad = true; 
      performSearch(currentValue);
    }
  })
};
let observer = new IntersectionObserver(onLoadMore, options);

const optionsEl = {captionData:'alt', captionDelay:'250'};
const galleryLightbox = new SimpleLightbox('.gallery a', optionsEl);

refs.formEl.addEventListener('submit', onFormSubmit);

