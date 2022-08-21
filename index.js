class ListItem{
    title = "";
}

class MediaItem extends ListItem{
    year = "";
    notes = "";
}

class List{
    title = "";
    list = [];

    constructor(){}

    addToList(item){
        this.list.push(item);
    }

    removeFromList(itemTitle){
        this.list = this.list.filter(listItem => listItem.title != itemTitle);
    }
}