import './scss/styles.scss';

var axios = require('axios');

const form = document.querySelector(".form-box");
const btnFavorites = document.querySelector(".navigation__text");
const favTitle = document.querySelector(".gallery-title");

const input = document.querySelector(".form__input");
const container = document.querySelector(".gallery-container");
const wrapper = document.querySelector(".gallery-wrapper");

let addedPics = [];
let localPics = [];

const API_KEY = "563492ad6f91700001000001cb307b13186e4085ba4554cc62e1e913";
form.addEventListener("submit", onSearch);
btnFavorites.addEventListener("click", onFavourites);

function onSearch(evt) {
    evt.preventDefault();
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
}
function onFavourites(evt) {
    evt.preventDefault();
    favTitle.style.display='block';
    //дописать загрузку картинок из localstorage
}
function onLoadMore(evt) {
    evt.preventDefault();
    deleteLoadMoreBtn();
    const request = input.value;
    const count = addedPics.length+12;
    console.log(count);
    if(count <= 80){
      getPics(request, count, "load");
    }
}
//при нажатии на картинку
function onPicClick(evt) {
    evt.preventDefault();
    const target = evt.target;
    const targetChild = target.childNodes[1];
    const targetSrc = targetChild.currentSrc;//src картинки 
    //с помощью find найти этот объект в массиве и открыть модальку 
}
//в модальке при добавлении в избранное
function onAddToFavourites(evt) {
    evt.preventDefault();

}
//в модальке при нажатии на крестик
function onCloseModal(evt) {
    evt.preventDefault();

}
//удалить из избранного
function onDeleteFromFavourites(evt) {
    evt.preventDefault();
}

//Тут реализовать валидацию
function checkRequest(request) {

}

//проверка наличия этого фото в избранном
function checkPresence(pic) {
    if(checkArr(pic)){
      alert("Эта картинка уже есть в избранном!");
    }else{
      //добавить фото в избранное(локальное хранилище)
    }
}

function checkArr(img) {
    if(localStorage.length >= 1){
        localPics = getLocalStorage('urlArr');
        return localPics.find(item => item.img === img);
    }
    else
    {
        alert("У вас нет избранных картинок");
    }
}
function getPics(pic, count, flag) {
  addedPics = [];
  return axios
      .get(`https://api.pexels.com/v1/search?query=${pic}&per_page=${count}`,
      { headers: { Authorization: API_KEY } })
      .then(response => {
        const res = response.data.photos;
        res.forEach(item => {
            const pic = {
                small: item.src.small,
                large: item.src.large,
            }
            addedPics.push(pic);
        })

        updateGrid(addedPics, flag);
        addPicEvent();
        addLoadMoreBtn();
      })
      .catch(error =>alert(`Повторите попытку! ${error}`));
}
function updateGrid(items, flag) {
    if(flag == "load")
    {
      if(items.length>0){
        const markup = createItems(items);
        container.innerHTML = markup;
      }else{
        container.innerHTML = '';
      }
    }else if(flag == "favourite"){
      if(items.length>0){
        const markup = createFavouriteItems(items);
        container.innerHTML = markup;
      }else{
        container.innerHTML = '';
      }
    }
}
function createItems(pics) {
    return pics.reduce((acc , item) => 
        acc + 
        `<div class="gallery-container_item">
          <img class="item-pic" src=${item.small} alt="pic">
        </div>`
        ,'');
}
function createFavouriteItems(pics) {
    return pics.reduce((acc , item) => 
         acc + 
        `<div class="gallery-container_item">
          <div class="item-wrapper"></div>
          <button class="item-closebutton"></button>
          <img class="item-pic" src=${item.large} alt="pic">
        </div>`
        ,'');
}
function deleteItem(target) {
    return addedUrl = (addedUrl.length>0) ? addedUrl.filter(item => item.url != target) : [];
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
    console.log(pics);
    return pics.forEach(item => item.addEventListener("click", onPicClick));
}



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
