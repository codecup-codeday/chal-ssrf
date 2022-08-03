#!/bin/bash
FLAG="${FLAG:-test}"
echo '<font size="100">' >> flag.html
echo ${FLAG} >> flag.html
echo '</font>' >> flag.html
python3 -m http.server 80 &> /dev/null &
pid=$!
sleep 1
node /www/index.js