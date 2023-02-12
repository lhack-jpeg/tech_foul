"""
This file contains the model definition of a match and team in the dota_stats database
"""
from sqlalchemy import (
    Column,
    String,
    DateTime,
    Integer,
    BigInteger,
    Enum,
    create_engine,
    ForeignKey,
    Text,
    Float,
)
import enum
from sqlalchemy.ext.declarative import declarative_base
import urllib.parse
from os import getenv, path

if path.exists("variables.py"):
    import variables as DB

# Import database secrets
if getenv("MYSQL_DB_HOST"):
    MYSQL_DB_USER = getenv("MYSQL_DB_USER")
else:
    MYSQL_DB_USER = DB.MYSQL_DB_USER
if getenv("MYSQL_DB_PASS"):
    MYSQL_DB_PASS = getenv("MYSQL_DB_PASS")
else:
    MYSQL_DB_PASS = DB.MYSQL_DB_PASS
if getenv("MYSQL_DB_HOST"):
    MYSQL_DB_HOST = getenv("MYSQL_DB_HOST")
else:
    MYSQL_DB_HOST = DB.MYSQL_DB_HOST
if getenv("MYSQL_DB"):
    MYSQL_DB = getenv("MYSQL_DB")
else:
    MYSQL_DB = DB.MYSQL_DB
import variables as DB

Base = declarative_base()


def mysql_connect():
    """
    Returns a connection instance to the MySQL Database
    """
    return create_engine(
        f"mysql+mysqldb://{DB.MYSQL_DB_USER}:{urllib.parse.quote(DB.MYSQL_DB_PASS)}@{DB.MYSQL_DB_HOST}/{DB.MYSQL_DB}",
        pool_pre_ping=True,
    )


class MyEnum(enum.Enum):
    """Enum declaration for match types"""

    one = "Bo1"
    two = "Bo2"
    three = "Bo3"
    four = "Bo5"


class Match(Base):
    """Match object declaration"""

    __tablename__ = "matches"

    id = Column(String(256), primary_key=True)
    team_one = Column("team_one", String(128), nullable=False)
    team_two = Column("team_two", String(128), nullable=False)
    match_format = Column(String(5))
    match_time = Column("match_time", DateTime, nullable=False)
    epoch_time = Column("epoch_time", BigInteger, nullable=False)
    team_one_id = Column(BigInteger, ForeignKey("teams.id"), nullable=False)
    team_two_id = Column(BigInteger, ForeignKey("teams.id"), nullable=False)
    tournament_name = Column("tournament_name", String(128))


class Team(Base):
    """This constructor is for the team/organisation data."""

    __tablename__ = "teams"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(255))
    tag = Column(String(255))
    logo_url = Column(Text)


class Team_rating(Base):
    """This constructor is for the team ratings table"""

    __tablename__ = "team_ratings"

    id = Column(Integer, primary_key=True)
    team_id = Column(BigInteger)
    rating = Column(Float)
    wins = Column(Integer)
    losses = Column(Integer)
    last_match_time = Column(BigInteger)
    inserted_at = Column(DateTime)
