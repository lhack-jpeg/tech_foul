# Project Tech Foul

This project is a node.js web application to provide pre match analytics of professional Dota2 matches.
The project consists of a nodeJS server inside of the tech_foul_app, a scrapy spyder and a python program
that acts as the link between MySQL database and the MongoDB.

## Tech_foul_app

This is an expressjs application using Node.js, ejs, MySQL and MongoDB.
The server loads up all upcoming matches from the MySQL database and gives a brief overview of the teams,
tournament, Best of and start time.

When a single match is clicked, MongoDB is queried and return a rich object of the teams previous performances condensed down
into easy to read stats and highlights.

### Runing the server

To start the server run the following in the root of `tech_foul_app/` folder:

-   `npm run start` for a production ready server.
-   `npm run dev` for a live reloading webserver
-   `npm run test`

## Liquidpedia_match_scraper

This scrapy project parses [Upcoming and ongoing matches](https://liquipedia.net/dota2/Liquipedia:Upcoming_and_ongoing_matches)
from the Dota2 liquidpedia website and stores it in MySQL. The runs checks on the data scraped to ensure that only new data is
inserted in the table.
