'''
Module gets the matches from the Database and create rich info to 
store in Mongo.
'''

from sql_model import mysql_connect, Match, Team_rating
from sqlalchemy.orm import sessionmaker
from get_team_logo import get_team_logo
from mongo_db_connect import get_mongoDB
import variables
import requests
import json

engine = mysql_connect()
Session = sessionmaker(bind=engine)
session = Session()
mongo_coll = get_mongoDB()
mongo_matches = mongo_coll['matches']
api_key = variables.API_KEY

def get_sql_matches():
    """returns all matches from MySQL Database"""
    return session.query(Match)

def get_team_series(team_id):
    '''
    Returns the last 10 series a team has played in Key Value Pairs.
    {series_id: [match_id, match_id]}
    '''
    res_status = 0
    sql = f'SELECT DISTINCT matches.series_id FROM matches \
        WHERE (matches.radiant_team_id = {team_id} \
        OR matches.dire_team_id = {team_id}) \
        AND series_id IS NOT NULL ORDER BY series_id DESC LIMIT 10;'
    headers = {'api_key': api_key}
    while res_status != 200:
        r = requests.get('https://api.opendota.com/api/explorer?sql='+sql,
                         headers=headers)
        res_status = r.status_code
    data = json.loads(r.text)
    rows = data.get('rows')
    if rows == None:
        return {}
    series_id = set(row.get('series_id') for row in rows)
    print(series_id)
    

if __name__ == '__main__':
    get_team_series(4)
