const GroceryItemStatus = Object.freeze({
    requested: 0,
    selected: 1,
    bought: 2,
    removed: 3,
    initial: 4
});

class GroceryItem{
    itemName = "";
    status = GroceryItemStatus.initial;
    itemDom = null;
    isInitial = false;

    constructor(itemName, status, initialStatus){
        this.itemName = itemName;
        this.status = status;
        this.isInitial = initialStatus;
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

        // Attach event
        // move this to "changeItemStatus"
        li.addEventListener("click", function(event){

            if(event.target.className.includes("bg-white")){
                event.target.classList.remove("bg-white");
                event.target.classList.add("bg-info");
            }
            else{
                event.target.classList.remove("bg-info");
                event.target.classList.add("bg-white");
            }
        });
        
        // save reference and return it
        this.itemDom = li;
        return li;
    }
}

class List{
    listTitle = "";
    list = [];
    listDom = "";
    selectedCount = 0;

    constructor(listTitle, itemList, listDom){
        this.listTitle = listTitle;
        this.listDom = listDom;

        itemList.forEach((itemTitle) => {
            this.addToList(itemTitle, GroceryItemStatus.initial, true);
        });
    }

    // Add item to internal array (list)
    addToList(itemTitle, status, isInitial){

        if(itemTitle === ""){
            return;
        }

        let exists = false;
        this.list.forEach((item) => {
            if(item.itemName === itemTitle){
                alert(`${itemTitle} is already added to the list`);
                exists = true;
            }
        });

        if(exists){
            return;
        }

        let newGroceryItem = new GroceryItem(itemTitle, status, isInitial);

        // add to js object
        this.list.push(newGroceryItem);

        // add to html
        this.listDom.appendChild(newGroceryItem.itemDom);
    }

    itemSelected(itemName){
        this.list.forEach(item => {
            if(item.itemName === itemName){
                let selected = item.status === GroceryItemStatus.selected;

                if(selected){
                    if(item.isInitial){
                        item.status = GroceryItemStatus.initial;
                    }
                    else{
                        item.status = GroceryItemStatus.requested;
                    }
                    this.selectedCount--;
                }
                else{
                    item.status = GroceryItemStatus.selected;
                    this.selectedCount++;

                }

                if(selected && !item.isInitial){
                    item.status = GroceryItemStatus.requested;
                }

                return;
            }
        });
    }

    changeItemStatus(status){
        const indices = [];

        // find all selected
        for(let i = 0; i < this.list.length; i++){
            if(this.list[i].status ===GroceryItemStatus.selected){
                indices.push(i);
            }
        }

        // soft remove initial selected
        for(let i = 0; i < indices.length; i++){
            if(indices[i].isInitial && ){

            }
        }

        // hard remove requested
        // this.list.forEach(item => {
        //     if(item.status === GroceryItemStatus.selected){
        //         indices
        //         item.status = status;
        //         if(item.status === GroceryItemStatus.bought || GroceryItemStatus.removed){
        //             this.selectedCount--;
        //             item.removeFromHtmlList();

        //             if(!item.isInitial){
        //                 // remove from this.list
        //             }
        //         }
        //     }
        // });
    }
}