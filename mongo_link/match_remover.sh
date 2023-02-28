#!/bin/bash
# This script removes is used in the crontab to automate the removal of games
# every 15 minutes
echo '**********************'
cd /home/luke-hackett/dota_project/tech_foul/mongo_link
pwd
date +'%a %b %e %H:%M:%S %Z %Y'
echo 'Started removing matches program'
python3 match_remover.py;
echo 'Finished matches'
echo '----------------------'

