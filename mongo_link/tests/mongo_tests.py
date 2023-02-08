import unittest
import inspect
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base, Match
import variables as DB
import urllib.parse
import sql_mongo_link
from mongo_db_connect import get_mongoDB


class TestMongo(unittest.TestCase):
    """
    Unit tests for mongo data link between sql and mongoDB
    """

    def setUpClass(cls):
        """Get functions from file"""
        cls.mongo_funcs = inspect.getmembers(sql_mongo_link, inspect.isfunction)

    def setUp(self):
        """
        Set up test class.
        """
        self.engine = create_engine(
            f"mysql+mysqldb://{DB.MYSQL_DB_USER}:\
                {urllib.parse.quote(DB.MYSQL_DB_PASS)}@\
                    {DB.MYSQL_DB_HOST}/{DB.MYSQL_DB}",
            pool_pre_ping=True,
        )
        self.session = Session(bind=self.engine)
        Base.metadata.create_all(self.engine)
        self.mongo_connection = get_mongoDB()

    def tearDown(self):
        """
        Breaks down the test session
        """
        Base.metadata.drop_all(self.engine)
        self.mongo_connection.close()

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
        self.assertIsInstance(type(result.id), type("String"))
        self.assertEqual(type(int) == type(result.team_one_id))

    def test_mongo_result(self):
        """Test to ensure that match info from mongoDB."""
