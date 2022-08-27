// Constants for item status
const ItemStatus = Object.freeze({
    unselected: 1,
    selected: 2,
    bought: 3,
    removed: 4,
});

const ItemStatusColor = Object.freeze({
    unselected: "bg-white",
    selected: "bg-info",
    // not used but maybe in the future
    bought: "bg-warning",
    removed: "bg-danger"
});

// Functions for modifying html dom li elements
function createListItem(itemName){
        // create html elements
        let li = document.createElement("li");
        li.style.cursor = "pointer";

        // Add text/data to elements
        li.className = "list-group-item bg-white";
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

    constructor(itemName, isInitial){
        this.itemName = itemName;
        this.isInitial = isInitial;
    }

    // remove this item from html
    removeItem(){
        if(this.itemDom === null){
            console.log(`${this.itemName} dom is null`);
            return;
        }
        this.itemDom.remove();
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
            case itemStatus === ItemStatus.unselected:
                color = ItemStatusColor.unselected;
            case itemStatus === ItemStatus.selected:
                color = ItemStatusColor.selected;
                break;
            case itemStatus === ItemStatus.removed:
                color = ItemStatusColor.removed;
                break;
            case itemStatus ===ItemStatus.bought:
                color = ItemStatusColor.bought;
                break;
        }

        changeItemColor(this.itemDom, color);
    }
}

function searchList(list, attribute, search){
    list.every.forEach((obj) => {
        if(obj[attribute] === search){
            return true;
        }
    });

    return false;
}

class ItemList{
    listName = "";
    // List from initial get request
    initialList = [];
    // Items added this session to post
    list = [];
    listDom = "";
    selectedCount = 0;

    constructor(listName, rawInitialList, listDom){
        this.listName = listName;
        // this dom element has click event attached to it
        // fn selectItem is attached
        this.listDom = listDom;

        rawInitialList.forEach((itemName) => {
            let newItem = new Item(itemName, true);
            newItem.addItem(this.listDom);
            this.initialList.push(initialItem);
        });
    }

    // Items to add after initial load (post these to add)
    addToList(itemName){

        if(itemName === ""){
            return;
        }

        // check if item to add is in our lists
        let exists = searchList(this.initialList, "itemName", itemName) || searchList(this.list, "itemName", itemName);
        if(exists){
            alert(`${itemName} is already added to the list`);
            return;
        }

        let newItem = new Item(itemName, false);

        newItem.addItem(this.listDom);
        this.list.push(newItem);
    }

    selectItem(itemName, status){
        let findA = this.initialList.find((item) => { return item.itemName === itemName });
        let findB = this.list.find((item) => { return item.itemName === itemName });

        let selectedItem = findA || findB;

        if(selectedItem === undefined){
            return;
        }

        if(status === ItemStatus.selected){
            this.selectedCount++;
        }
        else{
            this.selectedCount--;
        }

        selectedItem.updateStatus(status);
    }

    // this status update should be bought or removed
    removeItems(status){
        // soft remove from intialList in order to make post request to remove
        this.initialList.forEach((item) => {
            if(item.itemStatus === ItemStatus.selected){
                item.itemStatus = status;
                // left off here 
            }
        });
        // hard remove any added to this session;
        // no need to make post request to remove these because they were never in the db
    }



}