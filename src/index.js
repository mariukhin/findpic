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

window.onload = function() {
//   if(localStorage.length >= 1){
//     addedUrl = getLocalStorage('urlArr');
//     showItems(addedUrl);
//     addDeleteButton();
//   }
}
function onSearch(evt) {
    evt.preventDefault();
    const request = input.value;
    getPics(request, 12);
    // if(checkRequest(request))
    // {
    //     getPics(request);
    // }
    // else
    // {
    //     //сообщение что не валидный запрос
    // }
}
function onFavourites(evt) {
    evt.preventDefault();
    favTitle.style.display='block';
}
function onLoadMore(evt) {
    evt.preventDefault();
    
}
//Тут реализовать валидацию
function checkRequest(request) {}

//проверка наличия этого фото в избранном
function checkPresence(pic) {
  if(checkArr(pic)){
    alert("This pic is alredy been added!");
  }else{
    //добавить фото в избранное(локальное хранилище)
  }
}
// function isValid(pattern, val) {
//   return pattern.test(val);
// }

function checkArr(img) {
    if(localStorage.length >= 1){
        localPics = getLocalStorage('urlArr');
        return localPics.find(item => item.img === img);
    }
    else
    {
        alert("Your local storage is empty");
    }
}
function getPics(pic, count) {
  return axios
      .get(`https://api.pexels.com/v1/search?query=${pic}&per_page=${count}`,
      { headers: { Authorization: API_KEY } })
      .then(response => {
        const res = response.data.photos;
        res.forEach(item => {
            const pic = {
                src: item.src.small,
                alt: item.photographer
            }
            addedPics.push(pic);
        })

        updateGrid(addedPics);
        addLoadMoreBtn();
        // addedUrl.unshift(item);
        // setLocalStorage('urlArr', addedUrl);
        // showItems(addedUrl);
        // addDeleteButton();
      })
      .catch(error =>alert(`Повторите попытку! ${error}`));
}
function updateGrid(items) {
    if(items.length>0){
      const markup = createItems(items);
      container.innerHTML = markup;
    }else{
      container.innerHTML = '';
    }
}
function createItems(pics) {
    return pics.reduce((acc , item) => 
        acc + 
        `<div class="gallery-container_item"><img class="item-pic" src=${item.src}></div>`
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
// function addDeleteButton() {
//   const btnDel = Array.from(document.querySelectorAll(".js-delete"));
//   return btnDel.forEach(item => item.addEventListener("click", onDelete));
// }
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
