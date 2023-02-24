"""Gets the logo of a team"""
from sqlalchemy.orm import sessionmaker
from sql_model import mysql_connect, Team

engine = mysql_connect()
Session = sessionmaker(bind=engine)
session = Session()


def get_team_logo(team_id):
    """
    Takes the team id and queries the database and returns the string of
    the logo_url or a generic logo of Dota2
    """
    team_logo = session.query(Team.logo_url).filter(Team.id == team_id).first()
    if team_logo is None:
        return "https://www.pngfind.com/pngs/m/77-774896_dota-2-logo-png-graphic-design-transparent-png.png"
    return team_logo[0]
