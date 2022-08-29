// api endpoints
const API = Object.freeze({
    groceryList: "http://192.168.122.46:5000/grocerylist"
});

// Constants for item status
const ItemStatus = Object.freeze({
    unselected: 0,
    selected: 1,
    bought: 2,
    removed: 3,
});

const ItemStatusColor = Object.freeze({
    unselected: "bg-white text-dark",
    selected: "bg-info text-white",
    // not used but maybe in the future
    bought: "bg-warning text-dark",
    removed: "bg-secondary text-white"
});

// Functions for modifying html dom li elements
function createListItem(itemName){
        // create html elements
        let li = document.createElement("li");
        li.style.cursor = "pointer";

        // Add text/data to elements
        li.className = "list-group-item bg-white text-dark";
        li.innerText = itemName;
        
        // return html element
        return li;
}

function updateItemColor(itemDom, color){
    let classname = `list-group-item ${color}`;
    itemDom.setAttribute("class", classname);
}

class Item{
    itemName = "";
    itemStatus = ItemStatus.unselected;
    itemDom = null;

    constructor(itemName){
        this.itemName = itemName;
    }

    // remove this item from html
    removeItem(){
        if(this.itemDom === null){
            return;
        }
        this.itemDom.remove();
        this.itemDom = null;
    }

    // Adds this item to list html as a child node
    addItem(listDom){
        this.itemDom = createListItem(this.itemName);
        listDom.appendChild(this.itemDom);
    }

    // update status which changes this items color reflected on dom
    updateStatus(itemStatus){
        this.itemStatus = itemStatus;
        let color = "";

        switch(itemStatus){
            case ItemStatus.unselected:
                color = ItemStatusColor.unselected;
                break;
            case ItemStatus.selected:
                color = ItemStatusColor.selected;
                break;
            case ItemStatus.removed:
                color = ItemStatusColor.removed;
                break;
            case ItemStatus.bought:
                color = ItemStatusColor.bought;
                break;
        }

        updateItemColor(this.itemDom, color);
    }
}

function prepItemName(itemName){
    itemName = itemName.trim();
    let words = itemName.split(" ");

    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1).toLowerCase(); 
    }).join(" ");
}

class ItemList{
    listName = "";
    // List from initial get request
    initialList = [];
    // Items added this session to post
    list = [];
    listDom = "";

    constructor(listName, listDom){
        this.listName = listName;
        // this dom element has click event attached to it
        // fn selectItem is attached
        this.listDom = listDom;
    }

    isListModified(){
        let resultA = this.list.find((item) => { return item.itemStatus === ItemStatus.unselected });

        let resultB = this.initialList.find((item) => {return item.itemStatus === ItemStatus.bought || item.itemStatus === ItemStatus.removed});
        
        if(resultB !== undefined || resultA !== undefined){
            return true;
        }

        return false;
    }

    areItemsSelected(){
        for(const item of this.initialList){
            if(item.itemStatus === ItemStatus.selected){
                return true;
            }
        }

        for(const item of this.list){
            if(item.itemStatus === ItemStatus.selected){
                return true;
            }
        }

        return false;
    }

    // Returns array of strings based on item status
    getItemsByStatus(status){
        let items = [];

        if(status === ItemStatus.bought || status === ItemStatus.removed){
            this.initialList.forEach((item) => {
                if(item.itemStatus === status){
                    items.push(item.itemName);
                }
            });
            return items
        }

        this.list.forEach((item) => {
            if(item.itemStatus === ItemStatus.unselected){
                items.push(item.itemName);
            }
        });

        return items;
    }

    getItem(itemName){
        let findA = this.initialList.find((item) => { return item.itemName === itemName });
        let findB = this.list.find((item) => { return item.itemName === itemName });

        let exists = findA || findB;
        return exists; // Item object or undefined
    }

    addInitialItems(items){
        items.forEach((item) => {
            let newItem = new Item(prepItemName(item.itemName));
            newItem.addItem(this.listDom);
            this.initialList.push(newItem);
        });
    }

    // Items to add after initial load 
    addToList(itemName){

        if(itemName === ""){
            return;
        }

        // Enforce char count

        // prep name for adding to list
        itemName = prepItemName(itemName);

        // check if item to add is in our lists
        let exists = this.getItem(itemName);

        if(exists !== undefined){

            if(exists.itemStatus === ItemStatus.selected || exists.itemStatus === ItemStatus.unselected){
                alert(`${itemName} is already on your grocery list!`);
                return;
            }

            let foundMessage = `${itemName} was recently bought or removed. Did you want to add this item to your grocery list again?`
            if(confirm(foundMessage)){
                exists.addItem(this.listDom);
                exists.updateStatus(ItemStatus.unselected);
                return;
            }
        }

        let newItem = new Item(itemName);

        newItem.addItem(this.listDom);
        this.list.push(newItem);
    }

    selectItem(itemName){
        let selectedItem = this.getItem(itemName);

        if(selectedItem === undefined){
            return;
        }

        let status = selectedItem.itemStatus === ItemStatus.unselected ? ItemStatus.selected : ItemStatus.unselected;

        selectedItem.updateStatus(status);
    }

    // this status update should be bought or removed
    removeItems(status){
        this.initialList.forEach((item) => {
            if(item.itemStatus === ItemStatus.selected){
                // this bought or remove status matters to be able to post 
                item.updateStatus(status);
            }
        });

        this.list.forEach((item) => {
            if(item.itemStatus === ItemStatus.selected){
                item.updateStatus(status);
                item.removeItem();
            }
        });
    }
}