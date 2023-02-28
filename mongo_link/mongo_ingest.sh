#!/bin/bash
# This script is used to run the mongo sql link every 15 minutes
echo '**********************'
cd /home/luke-hackett/dota_project/tech_foul/mongo_link
date +'%a %b %e %H:%M:%S %Z %Y'
echo 'Creating mongo objects'
python3 sql_mongo_link.py
echo 'Finished script'
echo '----------------------'
