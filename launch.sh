#!/bin/bash
FLAG="${FLAG:-test}"
# make flag.html file
echo '<font size="100">' >> flag.html
echo ${FLAG} >> flag.html
echo '</font>' >> flag.html
# start simple http server with python
python3 -m http.server 80 &> /dev/null &
pid=$!
sleep 1
node /www/index.js