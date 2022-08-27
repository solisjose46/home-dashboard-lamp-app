class Item:
    def __init__(self, itemLabel):
        self.itemLabel = itemLabel

class ItemList:
    def __init__(self, listLabel):
        self.listLabel = listLabel
        self.items = []

    def addToList(self, itemLabel):
        self.items.append(Item(itemLabel))