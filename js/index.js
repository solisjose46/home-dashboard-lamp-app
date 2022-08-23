// Constants for item status
const ItemStatus = Object.freeze({
    initial: 0,
    requested: 1,
    selected: 2,
    bought: 3,
    removed: 4,
});

const ItemStatusColor = Object.freeze({
    nonselect: "bg-white",
    selected: "bg-info",
    bought: "bg-warning",
    removed: "bg-danger"
});

class ListItem{
    itemName = "";
    itemStatus = ItemStatus.initial;
    itemDom = null;
    isInitial = true;

    constructor(itemName, itemStatus, isInitial){
        this.itemName = itemName;
        this.itemStatus = itemStatus;
        this.isInitial = isInitial;
        this.appendDomElement();
    }

    removeFromHtmlList(){
        if(this.itemDom === null){
            console.log(`${this.itemName} dom reference is null`);
            return;
        }

        this.itemDom.remove();
    }

    appendDomElement(){
        // create html elements
        let li = document.createElement("li");
        li.style.cursor = "pointer";

        // Add text/data to elements
        li.className = "list-group-item bg-white";
        li.innerText = this.itemName;
        
        // save reference and return it
        this.itemDom = li;
        return li;
    }

    changeItemColor(color){
        let classname = `list-group-item ${color}`;
        this.itemDom.setAttribute("class", classname);
    }
}

class List{
    listName = "";
    list = [];
    listDom = "";
    selectedCount = 0;

    constructor(listTitle, itemList, listDom){
        this.listTitle = listTitle;
        this.listDom = listDom;

        itemList.forEach((item) => {
            this.addToList(item, ItemStatus.initial, true);
        });
    }

    // Add item to internal array (list) and add as to dom
    addToList(item, itemStatus, isInitial){

        if(item === ""){
            return;
        }

        this.list.every((listItem) => {
            if(listItem.itemName === item){
                alert(`${item} is already added to the list`);
                return;
            }
        });

        let newGroceryItem = new GroceryItem(item, itemStatus, isInitial);

        // add to js object
        this.list.push(newGroceryItem);

        // add to html
        this.listDom.appendChild(newGroceryItem.itemDom);
    }

    selectItem(item){
        const itemListObject = this.list.find((itemList) => {itemList.itemName === item});
        let selected = itemListObject.itemStatus !== ItemStatus.selected;

        if(selected){
            itemListObject.itemStatus = ItemStatus.selected;
            this.selectedCount++;
            itemListObject.changeItemColor(ItemStatusColor.selected);
        }
        else{
            if(itemListObject.isInitial){
                itemListObject.itemStatus = ItemStatus.initial;
            }
            else{
                itemListObject.itemStatus = ItemStatus.requested;
            }
            itemListObject.changeItemColor(ItemStatusColor.nonselect);
        }
    }

    removeItems(){
        // soft remove intial items; these need to be tracked in order to make post request
        this.list.forEach((item) => {
            if(item.itemStatus)
            if(item.status === GroceryItemStatus.bought || this.itemSelected === GroceryItemStatus.removed){
                item.removeFromHtmlList();
            }
        });

        // hard remove items that have been requested but removed;
        // cannot use bought action on item that was just requested
        let indices = [];
        let i = 0;
        this.list.forEach((item) => {

        });
    }
}