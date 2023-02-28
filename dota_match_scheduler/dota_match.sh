#!/bin/bash
echo '**********************'
date +'%a %b %e %H:%M:%S %Z %Y'
cd /home/luke-hackett/dota_project/tech_foul/dota_match_scheduler
echo 'Crawling for matches'
scrapy crawl match_scheduler;
echo 'Finished crawling'
echo '---------------------'
