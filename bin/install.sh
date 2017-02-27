#!/bin/sh

# This is the source install script
#
# Usage: curl sourcewifi.com/install.sh | sudo sh
#
#   Currently supports:
#     Raspbian 4.4
#

install_requirements () {
  sudo apt-get -y update
  sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
  sudo apt-get -y install nodejs
  sudo apt-get -y install npm
  sudo apt-get -y install hostapd
  sudo apt-get -y install dnsmasq
}

install_source () {
  git clone https://github.com/sourcewifi/source-router
  sudo cp source-router/source-config/dnsmasq.conf /etc/dnsmasq.conf
  sudo cp source-router/source-config/hosts /etc/hosts
  sudo cp source-router/source-config/hostapd.conf /etc/hostapd/hostapd.conf
  sudo cp source-router/source-config/interfaces /etc/network/interfaces

  sudo npm --prefix ./source-router/source-firewall install
  (cd source-router/source-firewall; sudo npm link)
  (cd source-router/source-server; sudo npm link source-firewall)
  sudo npm --prefix ./source-router/source-server install

  # IPv4 packet forwarding
  sudo sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

  # hostpad daemon
  sudo sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd
}

start_services () {
  sudo service dnsmasq start
  sudo service hostapd start
  sudo ifconfig wlan0 192.168.24.1
  sudo service dnsmasq restart
  sudo service hostapd restart
}

start_source () {
  sudo npm --prefix ./source-router/source-server start
}

main () {
  install_requirements
  install_source
  start_services
  start_source
}

main
