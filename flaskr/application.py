from flask import Flask, render_template, request, redirect, url_for
from test_db_creds import DB_CREDENTIALS
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

connection = mysql.connector.connect(host=f"{DB_CREDENTIALS.host}", user=f"{DB_CREDENTIALS.username}", passwd=f"{DB_CREDENTIALS.password}", database=f"{DB_CREDENTIALS.database}")

db_cursor = connection.cursor()

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
@app.route('/login.js', methods=['GET'])
def get_login_js():
    return render_template("login.js")

@app.route('/index.js', methods=['GET'])
def get_index_js():
    return render_template("index.js")

@app.route('/grocerylist.js', methods=['GET'])
def get_grocery_js():
    return render_template("grocerylist.js")

@app.route('/', methods=['GET'])
def get_index():
    return render_template("login.html")

@app.route('/login', methods=['POST'])
def login():
    username = request.get_json()["username"]
    password = request.get_json()["password"]

    # hash password and use that
    
    if not username or not password:
        return "Bad login", 401

    login_statement = f"select password from users where username='{username}'"

    db_cursor.execute(login_statement)

    result = db_cursor.fetchone()[0]

    if result != password:
        return "Bad login", 401

    # start session and return with home page
    
    return redirect(url_for('get_home_html')), 301


@app.route('/home', methods=['GET'])
def get_home_html():
    # authenticate first
    return render_template("grocerylist.html")

@app.route('/grocerylist', methods=['GET'])
def get_grocerylist():
    # authenticate first
    items = get_grocery_list() 
    return items

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)