# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from dota_match_scheduler.models import db_connect, Match, Team, MyEnum
from sqlalchemy.orm import sessionmaker
from dota_match_scheduler.get_team_or_match import get_team_id, get_match_id
from scrapy.exceptions import DropItem
from sqlalchemy import desc
from dota_match_scheduler.create_match_id import create_match_id
from dota_match_scheduler.mongo_db_connect import get_mongoDB


class DotaMatchSchedulerPipeline:
    def process_item(self, item, spider):
        return item


class SaveMatchesPipeline(object):
    def __init__(self):
        """
        Initialises cnnection.
        """
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)

    def process_item(self, item, spider):
        """
        Saves matches to the database. This is called on every item.
        """
        session = self.Session()
        match = Match()

        match.team_one = item["team_left"]
        match.team_one_id = get_team_id(match.team_one)
        match.team_two = item["team_right"]
        match.team_two_id = get_team_id(match.team_two)
        match.match_time = item["start_time"]
        match.epoch_time = item["epoch_time"]
        match.match_format = item["match_format"]
        match.tournament_name = item["tournament"]
        match.id = create_match_id(
            item['team_left'], item['team_right'], item['start_time'])

        # ! check the sqlalchemy for league and return the id

        session.add(match)
        session.commit()
        session.close()
        return item


class UpdatePipeline(object):
    '''
    This pipeline checks to see if the same match exists but a different time.
    '''

    def __init__(self):
        '''
        Initialise pipeline
        '''
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)
        self.MongoDB = get_mongoDB()

    def process_item(self, item, spider):
        '''
        queries the database, and checks if the match has the same teams, league, match_format
        if true, updates the start time with the new time else will pass.
        '''
        session = self.Session()
        matches_coll = self.MongoDB['matches']
        team_one_id = get_team_id(item['team_left'])
        team_two_id = get_team_id(item['team_right'])
        tournament = item['tournament']
        check_match = session.query(Match).filter(
            Match.team_one_id == team_one_id,
            Match.team_one_id == team_two_id,
            Match.tournament_name == tournament).one_or_none()
        # if check_match is None:
        #     return item
        check_match = check_match[0]
        print(check_match.epoch_time < item['epoch_time'])
        if check_match.epoch_time < item['epoch_time']:
            check_match = session.merge(check_match)
            check_match.epoch_time = item['epoch_time']
            check_match.start_time = item['start_time']
            new_match_id = create_match_id(
                item['team_left'], item['team_right'], item['start_time'])
            matches_coll.find_one_and_update({'match_id': check_match.id},
                                             {'$set': {'match_id': new_match_id}})
            check_match.match_id = new_match_id
            session.commit()
        return item

# Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect.


class DuplicatesPipelines(object):
    """
    Checks to see if item is already in the database.
    """

    def __init__(self):
        """
        Initialises pipeline.
        """
        engine = db_connect()
        self.Session = sessionmaker(bind=engine)

    def process_item(self, item, spider):
        '''
        Checks to see if match already exists, if true then item is dropped.
        '''
        session = self.Session()
        match_id = create_match_id(
            item['team_left'], item['team_right'], item['start_time'])
        match_exists = get_match_id(match_id)
        team_2_id = (
            session.query(Team.id)
            .filter(Team.name == item["team_right"])
            .order_by(desc(Team.id))
            .first()
        )
        team_1_id = (
            session.query(Team.id)
            .filter(Team.name == item["team_left"])
            .order_by(desc(Team.id))
            .first()
        )
        session.close()

        # If team name doesn't return an ID, item wil,be dropped.
        try:
            team_id = team_2_id[0]
        except TypeError:
            raise DropItem(f"Can not access id")

        try:
            team_id = team_1_id[0]
        except TypeError:
            raise DropItem(f"Can not access id")

        if match_exists is not None:
            raise DropItem(f"Duplicate match exists {match_id}")
        else:
            return item
