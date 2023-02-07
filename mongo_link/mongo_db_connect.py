"""
This module returns a connection instance to a mongoDB server.
"""
import variables
from pymongo import MongoClient
import certifi


def get_mongoDB():
    CONNECTION_STRING = variables.MONGO_DB_CONNECTION_STRING

    client = MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())

    return client["matches"]


if __name__ == "__main__":

    # Get the database
    dbname = get_mongoDB()
