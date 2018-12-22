import * as api from '../services/api';
import * as valid from '../services/validation';

export default class Model {
    constructor(items = []) {
        this.items = items;
        this.selectedItemId = null;
    }
    addNewUrl(url){
        return this.getUrl(url).then(res => {
            this.postUrl(res);
            return this.items;
        });
    }
    fetchUrls() {
        return api.getAllUrls().then(urls => {
            this.items = urls.data;
            return this.items;
        }); 
    }
    findUrl(arr ,url) {
        return arr.find(item => item.url === url);
    }
    getUrl(url){
        if(valid.checkCard(url, this.findUrl(this.items, url))){
            return api.getUrlFromCite(url).then(urls =>{
                const item = { 
                    title: urls.data.title,
                    descr: urls.data.description,
                    url: urls.data.url,
                    img: urls.data.image
                };
                this.items.unshift(item);
                return item;
                
            });
        }
    }
    postUrl(item){
        return api.addUrl(item);
    }
    removeItem(url) {
        let idUrl;
        return this.fetchUrls()
            .then(urls => this.findUrl(urls, url))
            .then(item =>{
                api.deleteUrl(item.id).then(id => {
                    idUrl = this.items.find(item => item.id == id);
                    this.items = this.items.filter(item => item.url !== idUrl.url);
                    console.log(this.items);
                });
            });
    }

}