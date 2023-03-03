'''
File contains the functions to query the database from Team or Matches
'''

from dota_match_scheduler.models import db_connect, Team, Match
from sqlalchemy.orm import sessionmaker

engine = db_connect()
Session = sessionmaker(bind=engine)
session = Session()


def get_team_id(team_name):
    '''
    Takes a team_name and queries the database, returns either
    the first row
    '''
    team_id = session.query(Team.id).filter(Team.name == team_name).first()
    return team_id[0]


def get_match_id(match_id):
    '''
    Take a match_id and queries the database. Returns one or None.
    '''
    print('---------------------------------------')
    print(f'match_id is {match_id}')
    match_row = session.query(Match).filter(
        Match.id == match_id).one_or_none()
    print(f'inside match_id function {match_row}')
    return match_row
