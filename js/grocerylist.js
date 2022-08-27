// Dummy data
let testData = ["Sugar", "Milk", "Orange Juice", "Eggs", "Flour", "Chocolate Chips"];

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
    // Initail get request for the inital data via fetch and promise
    // Use test data for now
    const groceryList = new ItemList("Grocery List", testData, listDom);

    function disableActions(){
        if(groceryList.selectedCount > 0){
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
        console.log(`selected ${event.target.innerText}`);
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
        if(groceryList.selectedCount > 0){
            alert("Mark selected items as 'Bought' or 'Removed' before saving!");
            return;
        }

        let bought = ""
        let removed = "";
        let requested = "";

        groceryList.initialList.forEach((item) => {
            if(item.itemStatus === ItemStatus.bought){
                bought += `${item.itemName}\n`;
            }
            if(item.itemStatus === ItemStatus.removed){
                removed += `${item.itemName}\n`;
            }
        });

        groceryList.list.forEach((item) => {
            if(item.itemStatus === ItemStatus.unselected){
                requested += `${item.itemName}\n`;
            }
        });

        let confirmMessage = "Are you sure you want to save the following changes?\n\n";
        if(bought !== ""){
            confirmMessage += `Bought these items:\n${bought}\n`;
        }

        if(requested !== ""){
            confirmMessage += `Add to the grovery list:\n${requested}\n`;
        }

        if(removed !== ""){
            confirmMessage += `Remove from grocery list:\n${removed}`
        }

        if(!confirm(confirmMessage)){
            console.log("CANCEL");
            location.reload();
            return;
        }

        console.log("POST REQUEST");
    });

    resetBtn.addEventListener("click", ()=>{
        location.reload();
    });

    boughtBtn.addEventListener("click", (event)=>{
        console.log("bought click");
        groceryList.removeItems(ItemStatus.bought);
    });

    removeBtn.addEventListener("click", (event)=>{
        console.log("remove click");
        groceryList.removeItems(ItemStatus.removed);
        disableActions();
    });
    
})();