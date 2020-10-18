if ! screen -list | grep -q "kalendarz"; then
  cd /home/pi/sql/kalendarz
  screen -S kalendarz -d -m node app.js
fi
