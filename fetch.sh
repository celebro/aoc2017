session=`cat session.txt`
session=${session//$'\n'/} # Remove all newlines.
curl --cookie "session=$session" "https://adventofcode.com/2017/day/$1/input" -o "$1.txt"
