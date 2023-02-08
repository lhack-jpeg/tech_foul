import unittest
from sql_model import Match, Team, mysql_connect, MyEnum, Team_rating


class TestSQLModel(unittest.TestCase):
    """
    Test the models in sql_models
    """

    def test_class_docs(self):
        self.assertTrue(len("sql_model".__doc__) > 1)
        self.assertTrue(len(Match.__doc__) > 1)
        self.assertTrue(len(Team.__doc__) > 1)
        self.assertTrue(len(MyEnum.__doc__) > 1)
        self.assertTrue(len(Team_rating.__doc__) > 1)
