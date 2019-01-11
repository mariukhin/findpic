import './scss/styles.scss';

var axios = require('axios');

const form = document.querySelector(".form-box");
const btnFavorites = document.querySelector(".navigation__text");
const favTitle = document.querySelector(".gallery-title");
const input = document.querySelector(".form__input");
const container = document.querySelector(".gallery-container");
const wrapper = document.querySelector(".gallery-wrapper");
const request = input.value;
let addedPics = [];
let localPics = [];

const API_KEY = "563492ad6f91700001000001cb307b13186e4085ba4554cc62e1e913";
form.addEventListener("submit", onSearch);
btnFavorites.addEventListener("click", onFavourites);
//input.addEventListener("click", toTop);
window.onload = function() {
    localPics = checkLocalStorage();
}

function onSearch(evt) {
    evt.preventDefault();
    addedPics = [];
    favTitle.style.display = 'none';
    // if(checkRequest(request))
    // {
    //     getPics(request);
    // }
    // else
    // {
    //     //сообщение что не валидный запрос
    // }
    const request = input.value;
    const count = 12;
    getPics(request, count, "load");
}*/

/*function toTop (evt) {
    evt.preventDefault();
    let nav = document.querySelector(".header__navigation");
if(request.length !== 0 ) {

  return  nav.style.marginBottom = "0rem";
}
}
*/

function onFavourites(evt) {
    evt.preventDefault();
    resetContainer();
    favTitle.style.display = 'block';
    localPics = getLocalStorage('localPics');
    updateGrid(localPics, "favourite");
    addDeletePicEvent();
}

function onLoadMore(evt) {
    evt.preventDefault();
    deleteLoadMoreBtn();
    const request = input.value;
    const count = addedPics.length + 12;
    console.log(count);
    if (count <= 80) {
        getPics(request, count, "load");
    }
}

//при нажатии на картинку
function onPicClick(evt) {
    evt.preventDefault();
    const target = evt.target;
    const targetChild = target.childNodes[1];
    const targetSrc = targetChild.currentSrc;
    const findImg = (element) => element.small === targetSrc;

    let imgPreview = addedPics.find(findImg);
    let largeSrc = imgPreview.large;
    let modal = document.getElementById('modal');
    document.getElementById('preview-image').src = largeSrc;
    modal.style.display = "block";
}

//в модалке при нажатии на <
function previousImage(evt) {
    evt.preventDefault();
    let target = document.getElementById('preview-image');
    let targetSrc = document.getElementById('preview-image').src;

    const findImg = (element) => element.large === targetSrc;
    let img = addedPics.find(findImg);

    const findImgId = (element) => element.id === prevId;
    let prevId = img.id - 1;

    let imgPrev = addedPics.find(findImgId);
    target.src = imgPrev.large;
}

//в модалке при нажатии на >
function nextImage(evt) {
    evt.preventDefault();
    let target = document.getElementById('preview-image');
    let targetSrc = document.getElementById('preview-image').src;

    const findImg = (element) => element.large === targetSrc;
    let img = addedPics.find(findImg);

    const findImgId = (element) => element.id === nextId;
    let nextId = img.id + 1;

    let imgPrev = addedPics.find(findImgId);
    target.src = imgPrev.large;
}

//в модалке при добавлении в избранное
function onAddToFavourites(evt) {
    evt.preventDefault();
    const targetSrc = document.getElementById('preview-image').src;
    localPics = checkLocalStorage();
    const picToAdd = addedPics.find(item => item.large == targetSrc);
    checkPresence(picToAdd);
}

//в модалке при нажатии на крестик
function onCloseModal(evt) {
    evt.preventDefault();
    let modal = document.getElementById('modal');
    modal.style.display = "none";
}

//удалить из избранного
function onDeleteFromFavourites(evt) {
    evt.preventDefault();
    const target = evt.target;
    const targetParent = target.parentElement;
    const newTarget = targetParent.childNodes[5];
    const targetSrc = newTarget.src;

    const findImg = (element) => element.small === targetSrc;
    let delPic = localPics.find(findImg);
    localPics = checkLocalStorage();
    localPics = deletePic(delPic);
    container.removeChild(targetParent);    
    setLocalStorage('localPics', localPics);
}

//Тут реализовать валидацию
/*function checkRequest(request) {
    let patt = /^[a-zа-яё]+$/i;
    let check = patt.test(request);
     if (!check) {
    
        return false;
     } 
        /* if (check) {
         return true;
         } else {
             return false;
         }
}
*/
//проверка наличия этого фото в избранном
function checkPresence(pic) {
    if (checkArr(pic)) {
        alert("Эта картинка уже есть в избранном!");
    } else {
        localPics.push(pic);
        setLocalStorage('localPics', localPics);
    }
}
function checkArr(src) {
    return localPics.find(item => item.large == src.large);
}
function getPics(pic, count, flag) {
    addedPics = [];
    return axios
        .get(`https://api.pexels.com/v1/search?query=${pic}&per_page=${count}`,
            {headers: {Authorization: API_KEY}})
        .then(response => {
            const res = response.data.photos;
            let id = 0;
            res.forEach(item => {
                id++;
                const pic = {
                    id: id,
                    small: item.src.small,
                    large: item.src.medium,
                };
                addedPics.push(pic);
            });

            updateGrid(addedPics, flag);
            addPicEvent();
            addLoadMoreBtn();
        })
        .catch(error => alert(`Повторите попытку! ${error}`));
}
function resetContainer() {
    addedPics = [];
    deleteLoadMoreBtn();
}
function updateGrid(items, flag) {
    if (flag === "load") {
        if (items.length > 0) {
            const markup = createItems(items);
            container.innerHTML = markup;
        } else {
            container.innerHTML = '';
        }
    } else if (flag === "favourite") {
        if (items.length > 0) {
            const markup = createFavouriteItems(items);
            container.innerHTML = markup;
        } else {
            container.innerHTML = '';
        }
    }
}

function createItems(pics) {
    return pics.reduce((acc, item) =>
        acc +
        `<div class="gallery-container_item">
          <img class="item-pic" src=${item.small} alt="pic">
        </div>`
        , '');
}

function createFavouriteItems(pics) {
    return pics.reduce((acc, item) =>
        acc +
        `<div class="gallery-container_item">
          <div class="item-wrapper"></div>
          <button class="item-deletebutton"></button>
          <img class="item-pic" src=${item.small} alt="pic">
        </div>`
        , '');
}
function deletePic(target) {
    return localPics = (localPics.length > 0) ? localPics.filter(item => item != target) : [];
}
function checkLocalStorage() {
    return localPics = (localPics.length >= 1) ? localPics = getLocalStorage('localPics') : [];
}
function addLoadMoreBtn() {
    const btn = document.createElement('button');
    btn.classList.add('gallery-loadmore-button');
    btn.textContent = 'Показать еще';
    btn.addEventListener("click", onLoadMore);
    wrapper.appendChild(btn);
}
function deleteLoadMoreBtn() {
    const btnLMore = document.querySelector(".gallery-loadmore-button");
    wrapper.removeChild(btnLMore);
}

function addPicEvent() {
    const pics = Array.from(document.querySelectorAll(".gallery-container_item"));
    return pics.forEach(item => item.addEventListener("click", onPicClick));
}
function addDeletePicEvent() {
    const btns = Array.from(document.querySelectorAll(".item-deletebutton"));
    return btns.forEach(item => item.addEventListener("click", onDeleteFromFavourites));
}
// добавление event модалке
(function addModalEvent() {
    const previous = document.getElementById('previous');
    previous.addEventListener("click", previousImage);
    const next = document.getElementById('next');
    next.addEventListener("click", nextImage);
    const favorite = document.getElementById('favorite');
    favorite.addEventListener("click", onAddToFavourites);
    const close = document.getElementById('close');
    close.addEventListener("click", onCloseModal);
}());

function setLocalStorage(key, value) {
    try {
        const serState = JSON.stringify(value);
        localStorage.setItem(key, serState);
    } catch (error) {
        console.error("Set state error: ", error);
    }
}

function getLocalStorage(key) {
    try {
        const serState = localStorage.getItem(key);
        return serState === null
            ? undefined
            : JSON.parse(serState);
    } catch (error) {
        console.error("Get state error: ", error)
    }
}
