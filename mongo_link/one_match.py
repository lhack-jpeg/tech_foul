"""
This module contains the constructor for one match using requests and json
"""
import requests
import json
from os import getenv, path

if path.exists("variables.py"):
    import variables
"""
Check for env variables
"""
if getenv("API_KEY"):
    API_KEY = getenv("API_KEY")
else:
    import variables

    API_KEY = variables.API_KEY

headers = {"api_key": API_KEY}


def get_api_rating(team_id):
    """
    Returns the team rating of a team from the opendota api.
    """
    r = requests.get(
        f"https://api.opendota.com/api/teams/{team_id}", headers=headers
    )
    data = r.text
    data = json.loads(data)
    entries = ("last_match_time", "name", "tag", "team_id", "logo_url")
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
        self.team_one_name = match_obj.team_one
        self.team_two_name = match_obj.team_two

    @classmethod
    def get_matches(cls, team_id):
        """Returns one teams previous 10 games"""
        response_status = 0
        while response_status != 200:
            r = requests.get(
                f"https://api.opendota.com/api/teams/{team_id}/matches",
                headers=headers,
            )
            response_status = r.status_code
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
            response_status = 0
            # If status code is not 200, match results where not obtained and retries
            while response_status != 200:
                r = requests.get(
                    f"https://api.opendota.com/api/matches/{match}",
                    headers=headers,
                )
                response_status = r.status_code
            data = r.text
            data = json.loads(data)
            rich_match_list.append(data)
        return rich_match_list
