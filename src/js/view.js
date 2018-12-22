import EventEmitter from '../services/event-emitter';
var postTpl = require("../templates/post.hbs");

export default class View extends EventEmitter{
    constructor(){
        super();

        this.form = document.querySelector(".js-form");
        this.input = document.querySelector(".js-input");
        this.container = document.querySelector(".container");

        this.form.addEventListener('submit', this.onAdd.bind(this));

        this.showItems = this.showItems.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }
    onAdd(evt){
        evt.preventDefault();
        const url = this.input.value;
        this.emit('add', url);
        this.form.reset();
    }
    onRemove(evt){
        evt.preventDefault();
        const target = evt.target;
        const targetParent = target.parentNode;
        const targetUrl = targetParent.firstElementChild.textContent;
        this.emit('remove', targetUrl);
    }
    clearContainer(){
        this.container.innerHTML = '';
    }
    showItems(items) {
        // this.clearContainer();
        if(items.length>0){
          const markup = items.reduce((acc , item) => acc + postTpl(item), '');
          this.container.innerHTML = markup;
          this.addDeleteButton();
        }else{
            this.clearContainer();
        }
    }
    removeItem(url){
        const conChild = Array.from(this.container.childNodes);
        const remItem =  conChild.find(item => item.childNodes[1].href == url);
        this.container.removeChild(remItem);
    }
    addDeleteButton() {
        const btnDel = Array.from(document.querySelectorAll(".js-delete"));
        return btnDel.forEach(item => item.addEventListener("click", this.onRemove.bind(this)));
    }
}