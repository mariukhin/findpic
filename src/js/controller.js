export default class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;
  
      this.model.fetchUrls().then(this.view.showItems);
  
      this.view.on('add', this.addUrl.bind(this));
      this.view.on('remove', this.removeUrl.bind(this));
    }
    addUrl(url) {
        this.model.addNewUrl(url).then(this.view.showItems);
    }
    removeUrl(url){
        this.model.removeItem(url).then(this.view.removeItem(url));
    }
}