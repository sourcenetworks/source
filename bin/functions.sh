source_start () {
  echo "Source is starting!"
  (npm --prefix ./server start)
}

source_stop () {
  echo "Source is Stopping!"
}
