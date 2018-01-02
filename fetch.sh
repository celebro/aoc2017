session=`cat session.txt`
session=${session//$'\n'/} # Remove all newlines.
if [ -z "$VAR" ]; then
    session=`cat ../session.txt`
    session=${session//$'\n'/} # Remove all newlines.
fi
# echo "$session"
curl --cookie "session=$session" "https://adventofcode.com/$1/day/$2/input" -o "$2.txt"

cp ../template.js $2.js
