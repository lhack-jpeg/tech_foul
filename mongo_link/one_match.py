"""
This module contains the constructor for one match using requests and json
"""
import requests
import variables
import json
from time import sleep

headers = {"api_key": variables.API_KEY}


def get_api_rating(team_id):
    """
    Returns the team rating of a team from the opendota api.
    """
    r = requests.get(
        f"https://api.opendota.com/api/teams/{team_id}", headers=headers
    )
    data = r.text
    data = json.loads(data)
    entries = ("last_match_time", "name", "tag", "id")
    for key in entries:
        if key in data:
            del data[key]
    return data


class One_Match:
    """
    Match constructor for building stats for teams. Takes a siongle match_object from sql alchemy
    """

    def __init__(self, match_obj):
        """Saves Match_id"""
        self.match_id = match_obj.id
        self.team_one = match_obj.team_one_id
        self.team_two = match_obj.team_two_id
        self.epoch_start = match_obj.epoch_time

    @classmethod
    def get_matches(cls, team_id):
        """Returns one teams previous 10 games"""
        r = requests.get(
            f"https://api.opendota.com/api/teams/{team_id}/matches",
            headers=headers,
        )
        data = r.text
        data = json.loads(data)
        match_ids = []
        for match in data:
            match_ids.append(match["match_id"])

        match_ids.sort(reverse=True)
        return match_ids[:10]

    @classmethod
    def get_rich_match_info(cls, match_id):
        """Takes a list of matches and returns a list of JSON objects"""
        rich_match_list = []
        for match in match_id:
            r = requests.get(
                f"https://api.opendota.com/api/matches/{match}",
                headers=headers,
            )
            data = r.text
            data = json.loads(data)
            rich_match_list.append(data)
        return rich_match_list
