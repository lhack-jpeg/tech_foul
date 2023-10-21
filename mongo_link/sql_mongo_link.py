"""
This module gets up coming matches from the mysql database and fetches each teams last 10 results.
It then condenses it down to key metrics and stores it in a mongo database
"""

from sql_model import mysql_connect, Match, Team_rating, Team
from sqlalchemy.orm import sessionmaker
from get_team_logo import get_team_logo
from datetime import date, datetime, timedelta
import math
from os import path, getenv
from one_match import One_Match, get_api_rating
from mongo_db_connect import get_mongoDB

if path.exists("./variables.py"):
    import variables
engine = mysql_connect()
Session = sessionmaker(bind=engine)
session = Session()
today = date.today()

if getenv("API_KEY"):
    API_KEY = getenv("API_KEY")
else:
    import variables

    API_KEY = variables.API_KEY

headers = {"api_key": API_KEY}

def get_sql_matches():
    """returns all matches from MySQL Database"""
    return session.query(Match)

def get_team_rating(team_id):
    """
    Returns the teams current rating as well as wins, losses and elo over time as Dict
    If team is not in team_ratings, it will fetch the current rating from opendota api.
    """
    team_rating = (
        session.query(Team_rating)
        .filter(
            Team_rating.team_id == team_id, Team_rating.inserted_at == today
        )
        .first()
    )
    if team_rating is None:
        team_stats = get_api_rating(team_id)
    else:
        team_stats = {}
        team_stats.update({"rating": team_rating.rating})
        team_stats.update({"wins": team_rating.wins})
        team_stats.update({"Losses": team_rating.losses})

    return team_stats


def win_probability(team_1_elo, team_2_elo):
    """Returns the win probability of the two teams playing each other."""
    elo_diff = team_2_elo - team_1_elo
    win_prob = 1 / (1 + 10 ** (elo_diff / 400))
    return win_prob


def create_match_list(match_object):
    """
    Creates the JSON file of stats for two teams.
    """
    matches_dict = {}
    single_match = One_Match(match_object)
    matches_dict["match_id"] = match_object.id
    matches_dict["epoch_time"] = single_match.epoch_start
    matches_dict["team_one"] = {}
    matches_dict["team_two"] = {}
    matches_dict["team_one"]["team_id"] = single_match.team_one
    matches_dict["team_one"]["name"] = single_match.team_one_name
    matches_dict["team_one"]["logo"] = get_team_logo(single_match.team_one)
    matches_dict["team_two"]["team_id"] = single_match.team_two
    matches_dict["team_two"]["name"] = single_match.team_two_name
    matches_dict["team_two"]["logo"] = get_team_logo(single_match.team_two)
    matches_dict["team_one"]["match_ids"] = One_Match.get_matches(
        single_match.team_one
    )
    matches_dict["team_two"]["match_ids"] = One_Match.get_matches(
        single_match.team_two
    )
    matches_dict["team_one"]["rich_info"] = One_Match.get_rich_match_info(
        matches_dict["team_one"].get("match_ids")
    )
    matches_dict["team_two"]["rich_info"] = One_Match.get_rich_match_info(
        matches_dict["team_two"].get("match_ids")
    )
    return matches_dict


def get_stats(matches_dict):
    """
    Takes in a teams dict of previous matches returns win_loss
    """
    team_dict = {}
    team_id = matches_dict["team_id"]
    team_dict.update(get_team_rating(team_id))
    prev_performance = ""
    match_duration = []
    average_score = []
    first_bloods = []
    matches = matches_dict["rich_info"]
    matches.reverse()
    flag = False
    for match in matches:
        match_duration.append(match.get("duration"))
        if match.get("radiant_team_id") == team_id:
            flag = True
        if match.get("radiant_win") == True and flag:
            prev_performance += "W"
        else:
            prev_performance += "L"
        if flag:
            average_score.append(match.get("radiant_score"))
        else:
            average_score.append(match.get("dire_score"))
        first_blood_binary = 0
        for player in match["players"]:
            if player["isRadiant"] == flag:
                if player.get("firstblood_claimed") != None:
                    first_blood_binary += player["firstblood_claimed"]
        first_bloods.append(first_blood_binary)
    team_dict["avg_match_time"] = math.floor(sum(match_duration) / 10)
    seconds_convert = str(timedelta(seconds=team_dict['avg_match_time']))
    team_dict["avg_match_time"] = seconds_convert
    team_dict["avg_score"] = sum(average_score) / 10
    team_dict["first_blood_pct"] = sum(first_bloods) / 10
    team_dict["prev_form"] = prev_performance

    return team_dict


if __name__ == "__main__":
    matches = list(get_sql_matches())
    mongoDB = get_mongoDB()
    mongo_matches = mongoDB["matches"]
    for match in matches:
        print(match.id)
        if mongo_matches.find_one({"match_id": match.id}) is not None:
            pass
        else:
            match = create_match_list(match)
            team_one_stats = get_stats(match["team_one"])
            team_two_stats = get_stats(match["team_two"])
            match["team_one"].update(team_one_stats)
            match["team_two"].update(team_two_stats)
            elo_win_pct = win_probability(
                match["team_one"]["rating"], match["team_two"]["rating"]
            )
            match["team_one"]["elo_win_pct"] = elo_win_pct
            match["team_two"]["elo_win_pct"] = 1 - elo_win_pct
            del match["team_one"]["rich_info"]
            del match["team_two"]["rich_info"]
            del match["team_two"]["match_ids"]
            del match["team_one"]["match_ids"]
            mongo_matches.insert_one(match)
