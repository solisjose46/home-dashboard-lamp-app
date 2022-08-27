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
        console.log(`itemStatus ${itemStatus}`);
        this.itemStatus = itemStatus;
        let color = "";

        switch(itemStatus){
            case ItemStatus.unselected:
                color = ItemStatusColor.unselected;
                break;
            case ItemStatus.selected:
                color = ItemStatusColor.selected;
                break;
            // case itemStatus === ItemStatus.removed:
            //     color = ItemStatusColor.removed;
            //     break;
            // case itemStatus ===ItemStatus.bought:
            //     color = ItemStatusColor.bought;
            //     break;
        }

        updateItemColor(this.itemDom, color);
    }
}

function prepItemName(itemName){
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
    selectedCount = 0;

    constructor(listName, rawInitialList, listDom){
        this.listName = listName;
        // this dom element has click event attached to it
        // fn selectItem is attached
        this.listDom = listDom;

        rawInitialList.forEach((itemName) => {
            let newItem = new Item(prepItemName(itemName));
            newItem.addItem(this.listDom);
            this.initialList.push(newItem);
        });
    }

    isListModified(){
        console.log("CHECK MODIFIED");
        let resultA = this.list.find((item) => { return item.itemStatus === ItemStatus.unselected });

        let resultB = this.initialList.find((item) => {return item.itemStatus === ItemStatus.bought || item.itemStatus === ItemStatus.removed});
        
        if(resultB !== undefined || resultA !== undefined){
            return true;
        }

        return false;
    }

    // Items to add after initial load (post these to add)
    addToList(itemName){

        
        if(itemName === ""){
            return;
        }

        // Enforce char count

        // prep name for adding to list
        itemName = prepItemName(itemName);

        // check if item to add is in our lists
        let findA = this.initialList.find((item) => { return item.itemName === itemName });
        let findB = this.list.find((item) => { return item.itemName === itemName });

        let exists = findA || findB;

        if(exists !== undefined){

            if(exists.itemStatus === ItemStatus.selected || exists.itemStatus === ItemStatus.unselected){
                alert(`${itemName} is already on the grocery list!`);
                return;
            }

            let foundMessage = `${itemName} was recently bought or removed. Did you want to add this item to your grocery list again?`
            if(confirm(foundMessage)){
                exists.itemStatus = ItemStatus.unselected;
                exists.addItem(this.listDom);
                return;
            }
        }

        let newItem = new Item(itemName);

        newItem.addItem(this.listDom);
        this.list.push(newItem);
    }

    selectItem(itemName){
        let findA = this.initialList.find((item) => { return item.itemName === itemName });
        let findB = this.list.find((item) => { return item.itemName === itemName });

        let selectedItem = findA || findB;

        if(selectedItem === undefined){
            return;
        }

        let status = selectedItem.itemStatus === ItemStatus.selected ? ItemStatus.unselected : ItemStatus.selected;

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
        // this status should be removed or bought
        if(status !== ItemStatus.removed && status !== ItemStatus.bought){
            console.log("removeItems: status should be removed or bought");
            return;
        }

        // soft remove from intialList in order to make post request to remove
        this.initialList.forEach((item) => {
            if(item.itemStatus === ItemStatus.selected){
                this.selectedCount--;
                // this bought or remove status matters to be able to post 
                item.itemStatus = status;
                // remove from html
                item.removeItem();
            }
        });

        // hard remove any added to this session
        this.list.forEach((item) => {
            if(item.itemStatus === ItemStatus.selected){
                this.selectedCount--;
                item.itemStatus = status;
                item.removeItem();
            }
        });
    }
}