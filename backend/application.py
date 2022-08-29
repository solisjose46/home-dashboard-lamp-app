from flask import Flask
from test_db_creds import DB_CREDENTIALS
import mysql.connector

app = Flask(__name__)

connection = mysql.connector.connect(host=f"{DB_CREDENTIALS.host}", user=f"{DB_CREDENTIALS.username}", passwd=f"{DB_CREDENTIALS.password}", database=f"{DB_CREDENTIALS.database}")

db_cursor = connection.cursor()

def get_grocery_list_prep(result):
    items = []
    for i in result:
        for j in i:
            items.append({"itemName" : j})
    return items

def get_grocery_list():
    statement = "select item_name from grocery_list"
    db_cursor.execute(statement)
    result = db_cursor.fetchall()
    items = get_grocery_list_prep(result)
    return items

# def set_remove_items(removed_items):
#     pass

# def set_bought_items(bought_items):
#     pass

# def set_add_items(added_items):
#     pass

# groceryList = {
#     "type":"grocery",
#     "items":[
#         "Cake",
#         "Coffee",
#         "Bleach"
#     ]
# }

@app.route('/')
def index():
    return 'Hello world!\n'

@app.route('/grocerylist')
def get_grocerylist():
    items = get_grocery_list() 
    return items