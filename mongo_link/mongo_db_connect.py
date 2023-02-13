"""
This module returns a connection instance to a mongoDB server.
"""
import variables
from pymongo import MongoClient
import certifi
from os import getenv, path

if path.exists("./variables.py"):
    import variables


def get_mongoDB():
    """Creates a connection to MongoDB database"""
    if getenv("MONGO_DB_CONNECTION_STRING"):
        CONNECTION_STRING = getenv("MONGO_DB_CONNECTION_STRING")
    else:
        CONNECTION_STRING = variables.MONGO_DB_CONNECTION_STRING

    client = MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())

    return client["matches"]


if __name__ == "__main__":

    # Get the database
    dbname = get_mongoDB()
