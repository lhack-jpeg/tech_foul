"""
This module gets up coming matches from the mysql database and fetches each teams last 10 results.
It then condenses it down to key metrics and stores it in a mongo database
"""

from models import mysql_connect, Match, Team_rating, Team
from sqlalchemy.orm import sessionmaker
import pymongo
import variables
from one_match import One_Match
from mongo_db_connect import get_mongoDB
import pprint

engine = mysql_connect()
Session = sessionmaker(bind=engine)
session = Session()
headers = {"api_key": variables.API_KEY}


def get_sql_matches():
    """returns all matches from MySQL Database"""
    return session.query(Match)


def create_match_list(match_object):
    """
    Creates the JSON file of stats for two teams.
    """
    matches_dict = {}
    single_match = One_Match(match_object)
    matches_dict["match_id"] = match_object.id
    matches_dict["team_one"] = {}
    matches_dict["team_two"] = {}
    matches_dict["team_one"]["id"] = single_match.team_one
    matches_dict["team_two"]["id"] = single_match.team_two
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
    team_id = matches_dict["id"]
    prev_performance = ""
    match_duration = []
    average_score = []
    first_bloods = []
    matches = matches_dict["rich_info"]
    matches.reverse()
    team_dict = {}
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
                first_blood_binary += player["firstblood_claimed"]
        first_bloods.append(first_blood_binary)
    team_dict["avg_match_time"] = sum(match_duration) / 10
    team_dict["avg_score"] = sum(average_score) / 10
    team_dict["first_blood_pct"] = sum(first_bloods) / 10
    team_dict["prev_form"] = prev_performance

    return team_dict


if __name__ == "__main__":
    matches = list(get_sql_matches())
    matches = matches[0:2]
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
            match["team_one_stats"] = team_one_stats
            match["team_two_stats"] = team_two_stats
            del match["team_one"]["rich_info"]
            del match["team_two"]["rich_info"]
            del match["team_two"]["match_ids"]
            del match["team_one"]["match_ids"]
            mongo_matches.insert_one(match)
