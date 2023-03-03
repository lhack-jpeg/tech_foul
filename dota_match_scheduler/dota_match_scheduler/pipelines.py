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
        self.MongoDB = get_mongoDB()

    def process_item(self, item, spider):
        '''
        Checks to see if match already exists, if true then item is dropped.
        '''
        session = self.Session()
        mongo_matches = self.MongoDB['matches']
        match_id = create_match_id(
            item['team_left'], item['team_right'], item['tournament'])
        match_exists = get_match_id(match_id)
        team_2_id = (
            session.query(Team.id)
            .filter(Team.name == item["team_right"])
            .order_by((Team.id.desc()))
            .first()
        )
        team_1_id = (
            session.query(Team.id)
            .filter(Team.name == item["team_left"])
            .order_by((Team.id.desc()))
            .first()
        )
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
            if match_exists.epoch_time < item['epoch_time']:
                match_exists.epoch_time = item['epoch_time']
                match_exists.start_time = item['start_time']
                session.commit()
                mongo_matches.update_one(
                    {'match_id': match_exists.id},
                    {'$set': {'epoch_time': item['epoch_time']}})
            session.close()
        else:
            return item
