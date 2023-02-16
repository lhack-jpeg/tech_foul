"""
This module removes matches that are 5 hours past their start time
"""

from sql_mongo_link import get_sql_matches
from datetime import datetime, timedelta
from mongo_db_connect import get_mongoDB

mongoDB = get_mongoDB()
# Get current datetime as timestamp
current_datetime = datetime.now()
time_difference = timedelta(hours=5)


if __name__ == "__main__":
    matches = list(get_sql_matches())
    for match in matches:
        # Convert unix time stamp to datetime
        match_time = datetime.fromtimestamp(match.epoch_time)
        # Add 5 hours to time stamp
        match_time_5_hours = match_time + time_difference
        # Check if greater than 5 hours difference
        if current_datetime > match_time_5_hours:
            # Will need to change to remove from database
            # Remove from mongodb with mongo delete
            # delete from sql database using sql begin
            print("True")
