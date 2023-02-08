import unittest
import inspect
import os, sys
from one_match import One_Match, get_api_rating
import one_match
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sql_model import Match, Team
import variables as DB
import urllib.parse

sys.path.append(os.path.dirname(os.path.realpath(__file__)))


class TestOneMatch(unittest.TestCase):
    """Tests for One Match class."""

    @classmethod
    def setUpClass(cls):
        """Get functions from file"""
        cls.one_match_funcs = inspect.getmembers(one_match, inspect.isfunction)

    def setUp(self):
        """
        Set up the test class.
        """
        self.engine = create_engine(
            f"mysql+mysqldb://{DB.MYSQL_DB_USER}:{urllib.parse.quote(DB.MYSQL_DB_PASS)}@{DB.MYSQL_DB_HOST}/{DB.MYSQL_DB}",
            pool_pre_ping=True,
        )
        self.session = Session(bind=self.engine)

    def test_one_match_docs(self):
        """Test base docs."""
        module_docs = "one_match".__doc__
        self.assertTrue(len(module_docs) > 1)
        class_docs = One_Match.__doc__
        self.assertTrue(len(class_docs) > 1)

    def test_func_docstr(self):
        """Tests for docstrings in all functions"""
        for func in self.one_match_funcs:
            if len(func[1].__doc__) < 1:
                print(func)
            self.assertTrue(len(func[1].__doc__) >= 1)

    def test_obj_class(self):
        """
        Test for class instance
        """
        result = self.session.query(Match).first()
        test_obj = One_Match(result)
        self.assertTrue(isinstance(test_obj, One_Match))

    def test_get_matches(self):
        """
        Test the get matches method
        """
        one_game = self.session.query(Match).first()
        match_id_list = One_Match.get_matches(one_game.team_one_id)
        self.assertIsNotNone(match_id_list)
        self.assertEqual(type(match_id_list), list)
        self.assertTrue(len(match_id_list) == 10)
        for id in match_id_list:
            self.assertTrue(type(id), int)

    def test_get_api_rating(self):
        """
        Check to see return of api for single team.
        """
        one_team = self.session.query(Team).first()
        result = get_api_rating(one_team.id)
        self.assertIsNotNone(result)
        obj_keys = ["rating", "wins", "losses"]
        for key in result.keys():
            self.assertIn(key, obj_keys)

    def test_get_rich_match_info(self):
        """
        Test method for rich match infos
        """
        one_game = self.session.query(Match).first()
        match_id_list = One_Match.get_matches(one_game.team_one_id)
        rich_list = One_Match.get_rich_match_info(match_id_list)
        self.assertIsNotNone(rich_list)
        self.assertEqual(type(rich_list), list)


if __name__ == "__main__":
    unittest.main()
