class ListItem{
    title = "";
    // array of strings for relating item and keywords
    // tags = [];
    constructor(){}
}

class MediaItem extends ListItem{
    year = "";
    notes = "";
    constructor(){}
}

class List{
    listTitle = "";
    list = [];

    constructor(){}

    // Add item to internal array (list)
    // string value must be wrapped prior to adding to list (ie ListItem, MovieItem)
    addToList(item){
        this.list.push(item);
    }

    // Return a sub array of items based on input (useful for displaying dynamic searching)
    getSublist(query){
        let sublist = [];
        
        sublist = this.list.filter(listItem => listItem.title.includes(query));

        return sublist;
    }
}

// create html elements for grocerylist and pantryinventory
function itemHtmlWrapper(listId, title, buttonAName, buttonBName, buttonAAction, buttonBAction){
    let li = document.createElement("li");
    let buttonA = document.createElement("button");
    let buttonB = document.createElement("button");

    buttonA.textContent = buttonAName;
    buttonA.addEventListener("click", buttonAAction);
    li.appendChild(buttonA);

    buttonB.textContent = buttonBName;
    buttonB.addEventListener("click", buttonBAction);
    li.appendChild(buttonBName);

    li.className = "list-group-item";
    li.textContent = title;
    document.getElementById(listId).appendChild(li);
}

// function removeItemHtml(){}