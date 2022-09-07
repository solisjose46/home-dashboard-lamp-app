from pickle import FALSE
from flask import Flask, render_template, request, redirect, url_for, session
from flask_session import Session
from test_db_creds import DB_CREDENTIALS
import mysql.connector
from flask_cors import CORS

# use bcrypt to encrypt passwords

app = Flask(__name__)

# CORS for this app
CORS(app)

# database connection
connection = mysql.connector.connect(host=f"{DB_CREDENTIALS.host}", user=f"{DB_CREDENTIALS.username}", passwd=f"{DB_CREDENTIALS.password}", database=f"{DB_CREDENTIALS.database}")
db_cursor = connection.cursor()

# Session management config
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Globals
HOME_PAGE = "grocerylist.html"

# useful functions for db operations
def authenticate_user(username, password):
    statement = f"select password from users where username='{username}'"
    db_cursor.execute(statement)
    result = db_cursor.fetchone()

    if not result:
        return False

    # hash password

    if result[0] != password:
        return False
    
    return True

# input: list of tuples
# output: list of dictionaries 
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

# theres probably a better way to do this
# static resources to serve
@app.route('/index.js', methods=['GET'])
def get_index_js():
    if not session.get("username"):
        return "Not Authenticated", 401
    return render_template("index.js")

@app.route('/grocerylist.js', methods=['GET'])
def get_grocery_js():
    if not session.get("username"):
        return "Not Authenticated", 401
    return render_template("grocerylist.js")

# Pages

# login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html")

    # session already exists
    if session.get("username"):
        return "Already logged in", 400

    username = request.form.get('username')
    password = request.form.get('password')
    
    # empty password, bad input
    if not username or not password:
        return "No Username add/or Password", 400
        
    if not authenticate_user(username, password):
        return "Bad Username and/or Password", 401
    
    session["username"] = username
    return redirect(url_for("index"))        

    

# home page
@app.route('/', methods=['GET'])
def index():
    if not session.get("username"):
        return redirect(url_for("login"))

    # grocerylist will temp. be home page untill a proper home page is developed
    return render_template(HOME_PAGE)


@app.route('/grocerylist', methods=['GET'])
def get_grocerylist():
    if not session.get("username"):
        return "Not Authenticated", 401

    items = get_grocery_list()
    print(items) 
    return items

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)