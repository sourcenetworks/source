source_start () {
  echo "Source is starting!"
  (sudo nohup npm --prefix ./server start </dev/null &>/dev/null &)
  echo "Source started"
}

source_stop () {
  echo "Source is stopping!"
  sudo kill -2 $(pgrep -f server.js)
  echo "Source stopped"
}

source_status () {
  if [ "" = "$(pgrep -f server.js)" ] ; then
    echo "Source is not running. You can start Source by running ./bin/source start"
  else
    echo "Source is running. You can stop Source by running ./bin/source stop"
  fi
}

source_restart () {
  source_stop
  sudo service hostapd restart
  sudo service dnsmasq restart
  source_start
}
