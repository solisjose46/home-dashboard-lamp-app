// Dummy data
let testData = ["Sugar", "Milk", "Orange Juice", "Eggs"];

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
    // get request then create list object
    const groceryList = new List("Grocery List", testData, listDom);

    function disableActions(){
        if(groceryList.selectedCount > 0){
            boughtBtn.disabled = false;
            removeBtn.disabled = false;
        }
        else{
            boughtBtn.disabled = true;
            removeBtn.disabled = true;
        }
    }

    // Attach events to elements
    listDom.addEventListener("click", function(event){
        console.log(`selected ${event.target.innerText}`);
        groceryList.itemSelected(event.target.innerText);
        disableActions();
    });

    addBtn.addEventListener("click", ()=>{
        if(groceryInput.value === ""){
            return;
        }

        groceryList.addToList(groceryInput.value, GroceryItemStatus.requested, false);
        groceryInput.value = "";
    });

    clearBtn.addEventListener("click", ()=> {
        groceryInput.value = "";
    });

    saveBtn.addEventListener("click", ()=> {
        if(groceryList.selectedCount > 0){
            alert("Mark selected items as 'Bought' or 'Removed' before saving!");
            return;
        }

        let noChange = true;

        groceryList.list.forEach((item) => {
            if(item.status !== GroceryItemStatus.initial){
                noChange = false;
            }
        });

        if(noChange){
            alert("No changes to save!");
            return;
        }

        let bought = ""
        let removed = "";
        let requested = "";

        groceryList.list.forEach((item) => {
            if(item.status === GroceryItemStatus.bought){
                bought += `${item.itemName}\n`;
            }
            if(item.status === GroceryItemStatus.removed){
                removed += `${item.itemName}\n`;
            }
            if(item.status === GroceryItemStatus.requested){
                requested += `${item.itemName}\n`;
            }
        });

        let confirmMessage = "Are you sure you want to save the following changes?\n\n";
        if(bought !== ""){
            confirmMessage += `Bought:\n${bought}\n`;
        }

        if(requested !== ""){
            confirmMessage += `Requested:\n${requested}\n`;
        }

        if(removed !== ""){
            confirmMessage += `Removed:\n${removed}`
        }

        if(!confirm(confirmMessage)){
            console.log("CANCEL");
            return;
        }

        console.log("POST REQUEST");
    });

    resetBtn.addEventListener("click", ()=>{
        location.reload();
    });

    boughtBtn.addEventListener("click", (event)=>{
        console.log("bought click");
        groceryList.changeItemStatus(GroceryItemStatus.bought);
    });

    removeBtn.addEventListener("click", (event)=>{
        console.log("remove click");
        groceryList.changeItemStatus(GroceryItemStatus.removed);
        disableActions();
    });
    
})();