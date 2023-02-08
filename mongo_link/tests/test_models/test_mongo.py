import unittest
import inspect
import os, sys
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sql_model import Match
import urllib.parse
import sql_mongo_link
import variables as DB
from mongo_db_connect import get_mongoDB

sys.path.append(os.path.dirname(os.path.realpath(__file__)))


class TestMongo(unittest.TestCase):
    """
    Unit tests for mongo data link between sql and mongoDB
    """

    @classmethod
    def setUpClass(cls):
        """Get functions from file"""
        cls.mongo_funcs = inspect.getmembers(sql_mongo_link, inspect.isfunction)

    def setUp(self):
        """
        Set up test class.
        """
        self.engine = create_engine(
            f"mysql+mysqldb://{DB.MYSQL_DB_USER}:{urllib.parse.quote(DB.MYSQL_DB_PASS)}@{DB.MYSQL_DB_HOST}/{DB.MYSQL_DB}",
            pool_pre_ping=True,
        )
        self.session = Session(bind=self.engine)
        self.mongo_DB = get_mongoDB()
        self.mongo_matches = self.mongo_DB["matches"]

    def test_docs(self):
        """Test sql_mongo_link_docs."""
        for func in self.mongo_funcs:
            if len(func[1].__doc__) < 1:
                print(func)
            self.assertTrue(len(func[1].__doc__) >= 1)

        module_docs = "sql_mongo_link".__doc__
        self.assertTrue(len(module_docs) > 1)

    def test_sql_matches_data(self):
        """Test the return result of SQL query."""
        result = self.session.query(Match).first()
        self.assertIsNotNone(result)
        self.assertEqual(type(result.id), type("String"))
        self.assertEqual(int, type(result.team_one_id))

    def test_mongo_result(self):
        """Test to ensure that match info from mongoDB."""
        mysql_result = self.session.query(Match).first()
        mongo_result = self.mongo_matches.find_one(
            {"match_id": mysql_result.id}
        )
        self.assertIsNotNone(mongo_result)
        self.assertEqual(mongo_result.get("match_id"), mysql_result.id)

    def test_mongo_match_keys(self):
        """test the keys from the mongo match stored."""
        obj_keys = ["_id", "match_id", "epoch_time", "team_one", "team_two"]
        mysql_result = self.session.query(Match).first()
        mongo_result = self.mongo_matches.find_one(
            {"match_id": mysql_result.id}
        )
        for key in mongo_result.keys():
            self.assertIn(key, obj_keys)


if __name__ == "__main__":
    unittest.main()
