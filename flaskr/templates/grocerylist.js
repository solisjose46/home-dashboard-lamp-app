(function () {
    // Elements to react to
    const groceryInput = document.getElementById("grocery-input");
    const addBtn = document.getElementById("grocery-add");
    const clearBtn = document.getElementById("grocery-clear");
    const saveBtn = document.getElementById("grocery-save");
    const resetBtn = document.getElementById("grocery-reset");
    const boughtBtn = document.getElementById("grocery-bought");
    const removeBtn = document.getElementById("grocery-remove");


    const listDom = document.getElementById("grocery-list");

    const groceryList = new ItemList("Grocery List", listDom);

    fetch(API.groceryList, { credentials: "include" })
    .then((response) => {
        return response.json();
    }).then((items) => {
        groceryList.addInitialItems(items);
    }).catch((error) => { console.log(error) });

    function disableActions(){

        if(groceryList.areItemsSelected()){
            boughtBtn.disabled = false;
            removeBtn.disabled = false;
        }
        else{
            boughtBtn.disabled = true;
            removeBtn.disabled = true;  
        }

        if(groceryList.isListModified()){
            saveBtn.disabled = false;
        }
        else{
            saveBtn.disabled = true;
        }
    }

    // Attach events to elements
    listDom.addEventListener("click", function(event){
        groceryList.selectItem(event.target.innerText);
        disableActions();
    });

    addBtn.addEventListener("click", ()=>{
        if(groceryInput.value === ""){
            return;
        }

        groceryList.addToList(groceryInput.value);
        groceryInput.value = "";
        disableActions();
    });

    clearBtn.addEventListener("click", ()=> {
        groceryInput.value = "";
    });

    saveBtn.addEventListener("click", ()=> {
        if(groceryList.areItemsSelected()){
            alert("Mark selected items as 'Bought' or 'Removed' before saving!");
            return;
        }

        if(!groceryList.isListModified()){
            alert("No changes to save!");
            return;
        }

        let requested = groceryList.getItemsByStatus(ItemStatus.unselected);
        let bought = groceryList.getItemsByStatus(ItemStatus.bought);
        let removed = groceryList.getItemsByStatus(ItemStatus.removed);


        // prepare message
        let confirmMessage = "Are you sure you want to save the following changes?\n";

        if(requested.length > 0){
            confirmMessage += "\nAdd to your grocery list:\n";
        }

        requested.forEach((itemName) => {
            confirmMessage += `${itemName}\n`;
        });

        if(bought.length > 0){
            confirmMessage += "\nBought these items:\n"
        }

        bought.forEach((itemName) => {
            confirmMessage += `${itemName}\n`;
        });

        if(removed.length > 0){
            confirmMessage += "\nThese items will be removed from your grocery list:\n"
        }

        removed.forEach((itemName) => {
            confirmMessage += `${itemName}\n`;
        });

        if(!confirm(confirmMessage)){
            location.reload();
            return;
        }

        console.log("POST REQUEST");
    });

    resetBtn.addEventListener("click", ()=>{
        location.reload();
    });

    boughtBtn.addEventListener("click", (event)=>{
        groceryList.removeItems(ItemStatus.bought);
        disableActions();
    });

    removeBtn.addEventListener("click", (event)=>{
        groceryList.removeItems(ItemStatus.removed);
        disableActions();
    });
    
})();