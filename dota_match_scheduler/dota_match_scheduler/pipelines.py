# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from dota_match_scheduler.models import db_connect, Match, Team, MyEnum
from sqlalchemy.orm import sessionmaker
from get_team_or_match import get_team_id, get_match_id
from scrapy.exceptions import DropItem
from sqlalchemy import desc
from hashlib import md5


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
        match_id = f'{str(item["team_left"])}{str(item["team_right"])}{str(item["epoch_time"])}'.encode(
        )
        match_id = md5(match_id)
        match_id = str(match_id.hexdigest())
        match.id = match_id

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

    def process_item(self, item, spider):
        '''
        queries the database, and checks if the match has the same teams, league, match_format
        if true, updates the start time with the new time else will pass.
        '''
        session = self.Session()
        team_one_id = get_team_id(item['team_left'])
        team_two_id = get_team_id(item['team_right'])
        check_match = session.query(Match).filter(Team)


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
        match_id = f'{str(item["team_left"])}{str(item["team_right"])}{str(item["epoch_time"])}'.encode(
        )
        match_id = md5(match_id)
        match_id = str(match_id.hexdigest())
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
