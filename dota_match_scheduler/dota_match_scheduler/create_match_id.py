'''
This module contains the function to create a hexadecimal value
for the match id.
'''
from hashlib import md5


def create_match_id(team_one, team_two, start_time):
    '''
    takes the three values and hashes them using the md5 function to return a
    a hexideciaml string.
    '''
    match_id = f"{str(team_one)}{str(team_two)}{str(start_time)}".encode()
    match_id = md5(match_id)
    match_id = str(match_id.hexdigest())
    return match_id
