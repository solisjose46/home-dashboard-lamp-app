from flask import Flask
from flask_restful import Resource, Api
from backend.home_dashboat_popo import *
import mysql.connector
from backend.test_db_creds import DB_CREDS

app = Flask(__name__)
api = Api(app)

# attempt to connect to mysql db
try:
    home_dashboard_db = mysql.connector.connect(
        host = DB_CREDS.host,
        user = DB_CREDS.user,
        password = DB_CREDS.password
    )
except:
    print("connection error")

# Instantiate python objects: grocery list
groceryList = ItemList("GroceryList")

# get data from 


class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)