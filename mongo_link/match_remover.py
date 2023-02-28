"""
This module removes matches that are 5 hours past their start time
"""

from sql_mongo_link import get_sql_matches
from sqlalchemy.orm import sessionmaker
from sql_model import mysql_connect
from datetime import datetime, timedelta
from mongo_db_connect import get_mongoDB

mongoDB = get_mongoDB()
matches_collection = mongoDB["matches"]
# Get current datetime as timestamp
current_datetime = datetime.now()
time_difference = timedelta(hours=3)


if __name__ == "__main__":
    engine = mysql_connect()
    Session = sessionmaker(bind=engine)
    session = Session()
    matches = list(get_sql_matches())
    for match in matches:
        # Convert unix time stamp to datetime
        match_time = datetime.fromtimestamp(match.epoch_time)
        # Add 5 hours to time stamp
        match_time_5_hours = match_time + time_difference
        # Check if greater than 5 hours difference
        if current_datetime > match_time_5_hours:
            new_object = session.merge(match)
            print(match.id)
            session.delete(new_object)
            session.commit()
            matches_collection.delete_one({"match_id": match.id})
